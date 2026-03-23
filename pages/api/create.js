// pages/api/create.js
import clientPromise from "../../lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function maybeUpload(value) {
  if (!value || !value.startsWith("data:image/")) return value || "";
  try {
    const result = await cloudinary.uploader.upload(value, {
      folder: "linkitin",
    });
    return result.secure_url;
  } catch (err) {
    console.error("[Cloudinary upload error]", err.message);
    throw new Error("Cloudinary: " + err.message);
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: "8mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    username, name, dob, location, bio, aboutme,
    avatar, socialProfiles, links, interests,
    favSong, favArtist, favSongUrl, favSongTrackId,
    _isEditing,
  } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return res.status(400).json({ error: "Username can only contain letters, numbers, _ and -" });
  }

  const uname = username.toLowerCase();

  try {
    const safeAvatar = await maybeUpload(avatar);

    const safeLinks = await Promise.all(
      (links || []).map(async (lnk) => ({
        ...lnk,
        icon: await maybeUpload(lnk.icon),
      }))
    );

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
          avatar:         safeAvatar,
          socialProfiles: socialProfiles || {},
          links:          safeLinks,
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
    if (err.message?.toLowerCase().includes("cloudinary")) {
      return res.status(500).json({ error: "Image upload failed. Please try again." });
    }
    return res.status(500).json({ error: "Database error" });
  }
}
