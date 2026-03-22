// pages/api/profile.js
// GET /api/profile?username=xxx
// Returns full profile data as JSON — used by Expo AI bot

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { username } = req.query;
  if (!username || username.length < 2) return res.status(400).json({ error: "username required" });

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const user   = await db.collection("users").findOne(
      { username: username.toLowerCase() },
      { projection: { _id: 0, avatar: 0 } } // exclude avatar (too large)
    );

    if (!user) return res.status(404).json({ error: "not found" });

    // Return clean profile data
    res.status(200).json({
      username:       user.username       || "",
      name:           user.name           || "",
      dob:            user.dob            || null,
      bio:            user.bio            || "",
      aboutme:        user.aboutme        || "",
      socialProfiles: user.socialProfiles || {},
      links:          user.links          || [],
      interests:      user.interests      || {},
      favSong:        user.favSong        || "",
      favArtist:      user.favArtist      || "",
    });
  } catch (err) {
    console.error("[/api/profile]", err);
    res.status(500).json({ error: "server error" });
  }
}
