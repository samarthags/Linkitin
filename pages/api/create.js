// pages/api/create.js
// POST /api/create
// Saves or UPDATES a profile in MongoDB — same collection "users"
// that pages/[username].js reads from. Uses findOneAndUpdate (upsert)
// so calling it again with the same username UPDATES instead of duplicating.

import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      username, name, dob, location, bio, aboutme,
      avatar, socialProfiles, links, interests,
    } = req.body;

    if (!username || !name) {
      return res.status(400).json({ error: "Username and name are required" });
    }

    // Sanitise — lowercase, only safe chars
    const uname = username.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!uname) return res.status(400).json({ error: "Invalid username" });

    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    // findOneAndUpdate with upsert:
    //   • If username exists  → updates every field  (this fixes the "no change" bug)
    //   • If username is new  → inserts it fresh
    const result = await db.collection("users").findOneAndUpdate(
      { username: uname },                // find by username
      {
        $set: {
          username,
          name:           name            || "",
          dob:            dob             || null,
          location:       location        || "",
          bio:            bio             || "",
          aboutme:        aboutme         || "",
          avatar:         avatar          || "",
          socialProfiles: socialProfiles  || {},
          links:          links           || [],
          interests:      interests       || {},
          updatedAt:      new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),          // only set on first insert
        },
      },
      {
        upsert:         true,             // create if not found
        returnDocument: "after",          // return updated doc
      }
    );

    // Build the profile URL using the request host
    // so it works on any domain (localhost, vercel, custom domain)
    const host     = req.headers.host || "mywebsammu.vercel.app";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const base     = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    const url      = `${base}/${uname}`;

    return res.status(200).json({ url, username: uname });

  } catch (err) {
    console.error("[/api/create] MongoDB error:", err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}
