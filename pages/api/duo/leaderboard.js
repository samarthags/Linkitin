// pages/api/duo/leaderboard.js
// GET — public. Top 50 active duos sorted by combined activity.
import clientPromise from "../../../lib/mongodb";
import { combinedActivityTotal } from "../../../lib/duo";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    // Sort in JS since "combined activity" is a weighted formula, not a
    // single stored field — fine at this scale; move to a cached/sorted
    // field if the duos collection grows past a few thousand docs.
    const active = await db.collection("duos").find({ status: "active" }).toArray();
    active.sort((a, b) => combinedActivityTotal(b.combinedStats) - combinedActivityTotal(a.combinedStats));
    const top = active.slice(0, 50);

    const enriched = await Promise.all(top.map(async (d) => {
      const [a, b] = await Promise.all([
        db.collection("users").findOne({ username: d.userA }, { projection: { name: 1, avatar: 1, username: 1 } }),
        db.collection("users").findOne({ username: d.userB }, { projection: { name: 1, avatar: 1, username: 1 } }),
      ]);
      return { userA: a, userB: b, level: d.level, combinedStats: d.combinedStats, startDate: d.startDate };
    }));

    return res.status(200).json({ leaderboard: enriched });
  } catch (err) {
    console.error("[/api/duo/leaderboard]", err);
    return res.status(200).json({ leaderboard: [] });
  }
}
