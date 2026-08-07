// pages/api/duo/index.js
// GET /api/duo?username=xxx — PUBLIC. Used on the profile page to render
// the Duo badge. Level/days are computed fresh on every read from lib/duo.
import clientPromise from "../../../lib/mongodb";
import { bondDays, levelFromDays, daysToNextLevel } from "../../../lib/duo";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { username } = req.query;
  if (!username) return res.status(400).json({ duo: null });
  const u = username.toLowerCase();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const duo = await db.collection("duos").findOne({
      status: "active",
      $or: [{ userA: u }, { userB: u }],
    });
    if (!duo) return res.status(200).json({ duo: null });

    const partnerUsername = duo.userA === u ? duo.userB : duo.userA;
    const [me, partner] = await Promise.all([
      db.collection("users").findOne({ username: u }, { projection: { name: 1, avatar: 1, username: 1 } }),
      db.collection("users").findOne({ username: partnerUsername }, { projection: { name: 1, avatar: 1, username: 1 } }),
    ]);

    const daysBonded = bondDays(duo.startDate);

    return res.status(200).json({
      duo: {
        startDate:       duo.startDate,
        daysBonded,
        level:           levelFromDays(daysBonded),
        daysToNextLevel: daysToNextLevel(daysBonded),
        streak:          duo.streak || { current: 0, longest: 0 },
        combinedStats:   duo.combinedStats || { views: 0, clicks: 0, shares: 0 },
        me,
        partner,
      },
    });
  } catch (err) {
    console.error("[/api/duo]", err);
    return res.status(200).json({ duo: null });
  }
}
