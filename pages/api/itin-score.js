// pages/api/itin-score.js
// GET ?username=xxx — PUBLIC. Returns a user's Itin Score.
// Completely separate from Dynamic Duo — just a personal counter that
// goes up +10 per unique profile view. Stored on the user document in
// Mongo (itinScore field), incremented server-side from track.js. No
// browser storage involved anywhere in this.
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { username } = req.query;
  if (!username) return res.status(400).json({ score: 0 });

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const user   = await db.collection("users").findOne(
      { username: username.toLowerCase() },
      { projection: { itinScore: 1, _id: 0 } }
    );
    return res.status(200).json({ score: user?.itinScore || 0 });
  } catch (err) {
    console.error("[/api/itin-score]", err);
    return res.status(200).json({ score: 0 });
  }
}
