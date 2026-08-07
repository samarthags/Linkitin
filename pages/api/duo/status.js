// pages/api/duo/status.js — NO-AUTH TEST VERSION
// GET ?username=xxx — dashboard duo state for that username.
import clientPromise from "../../../lib/mongodb";
import { bondDays, levelFromDays, daysToNextLevel } from "../../../lib/duo";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { username } = req.query;
  if (!username) return res.status(400).json({ status: "none" });
  const me = username.toLowerCase();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const doc = await db.collection("duos").findOne({ $or: [{ userA: me }, { userB: me }] });
    if (!doc) return res.status(200).json({ status: "none" });

    const partnerUsername = doc.userA === me ? doc.userB : doc.userA;
    const partner = await db.collection("users").findOne(
      { username: partnerUsername },
      { projection: { name: 1, avatar: 1, username: 1 } }
    );

    if (doc.status === "pending") {
      const status = doc.invitedBy === me ? "pending_sent" : "pending_received";
      return res.status(200).json({ status, partner });
    }

    const daysBonded = bondDays(doc.startDate);

    return res.status(200).json({
      status: "active",
      partner,
      duo: {
        startDate:       doc.startDate,
        daysBonded,
        level:           levelFromDays(daysBonded),
        daysToNextLevel: daysToNextLevel(daysBonded),
        streak:          doc.streak || { current: 0, longest: 0 },
        combinedStats:   doc.combinedStats || { views: 0, clicks: 0, shares: 0 },
      },
    });
  } catch (err) {
    console.error("[/api/duo/status]", err);
    return res.status(500).json({ status: "none" });
  }
}
