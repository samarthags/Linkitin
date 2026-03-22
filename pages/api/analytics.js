// pages/api/analytics.js
// GET /api/analytics?username=xxx
// Returns live analytics counts from MongoDB

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { username } = req.query;
  if (!username) return res.status(400).end();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const user   = await db.collection("users").findOne(
      { username: username.toLowerCase() },
      { projection: { analytics: 1, _id: 0 } }
    );
    const a = user?.analytics || {};
    return res.status(200).json({
      views:        a.views        || 0,
      linkClicks:   a.linkClicks   || 0,
      spotifyPlays: a.spotifyPlays || 0,
      shares:       a.shares       || 0,
    });
  } catch (err) {
    return res.status(500).json({ views:0, linkClicks:0, spotifyPlays:0, shares:0 });
  }
}
