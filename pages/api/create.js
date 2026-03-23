// pages/api/create.js
import clientPromise from "../../lib/mongodb";
import crypto from "crypto";

// ─── Cloudinary upload helper ────────────────────────────────────────────────
// Uploads a base64 data-URI to Cloudinary and returns the secure CDN URL.
// No SDK needed — plain fetch + HMAC signature.
async function uploadToCloudinary(base64DataUri, folder = "linkitin") {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars not configured");
  }

  const timestamp    = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature    = crypto
    .createHmac("sha256", CLOUDINARY_API_SECRET)
    .update(paramsToSign)
    .digest("hex");

  const formData = new FormData();
  formData.append("file",      base64DataUri);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key",   CLOUDINARY_API_KEY);
  formData.append("signature", signature);
  formData.append("folder",    folder);

  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const json = await res.json();

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || "Cloudinary upload failed");
  }
  return json.secure_url; // https://res.cloudinary.com/…
}

// If value is a raw base64 data-URI → upload it and return CDN URL.
// If it's already a normal URL or empty → return unchanged.
async function maybeUpload(value, folder) {
  if (value && value.startsWith("data:image/")) {
    return await uploadToCloudinary(value, folder);
  }
  return value || "";
}

// ─── Body size limit: allow base64 payloads ───────────────────────────────────
export const config = {
  api: { bodyParser: { sizeLimit: "8mb" } },
};

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    username, name, dob, location, bio, aboutme,
    avatar, socialProfiles, links, interests,
    favSong, favArtist, favSongUrl, favSongTrackId,
    _isEditing,   // true = user is updating their own profile
  } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return res.status(400).json({ error: "Username can only contain letters, numbers, _ and -" });
  }

  const uname = username.toLowerCase();

  try {
    // ── 1. Upload any base64 blobs to Cloudinary BEFORE touching the DB ────────
    const safeAvatar = await maybeUpload(avatar, "linkitin/avatars");

    const safeLinks = await Promise.all(
      (links || []).map(async (lnk) => ({
        ...lnk,
        icon: await maybeUpload(lnk.icon, "linkitin/link-icons"),
      }))
    );

    // ── 2. DB upsert ────────────────────────────────────────────────────────────
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const existing = await db.collection("users").findOne({ username: uname });

    if (existing && !_isEditing) {
      return res.status(400).json({ error: "Username already taken. Please choose a different one." });
    }

    await db.collection("users").findOneAndUpdate(
      { username: uname },
      {
        $set: {
          username,
          name:           name           || "",
          dob:            dob            || null,
          location:       location       || "",
          bio:            bio            || "",
          aboutme:        aboutme        || "",
          avatar:         safeAvatar,      // ← Cloudinary URL, never base64
          socialProfiles: socialProfiles || {},
          links:          safeLinks,       // ← link icons also CDN URLs
          interests:      interests      || {},
          favSong:        favSong        || "",
          favArtist:      favArtist      || "",
          favSongUrl:     favSongUrl     || "",
          favSongTrackId: favSongTrackId || "",
          updatedAt:      new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    const host     = req.headers.host || "mywebsammu.vercel.app";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const base     = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    return res.status(200).json({ url: `${base}/${uname}` });

  } catch (err) {
    console.error("[/api/create]", err);
    if (err.message?.includes("Cloudinary") || err.message?.includes("cloudinary")) {
      return res.status(500).json({ error: "Image upload failed. Please try again." });
    }
    return res.status(500).json({ error: "Database error" });
  }
}
