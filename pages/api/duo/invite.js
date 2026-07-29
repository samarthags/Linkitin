// pages/api/duo/invite.js — NO-AUTH TEST VERSION
// POST { fromUsername, toUsername }
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { fromUsername, toUsername } = req.body || {};
  const from = (fromUsername || "").toLowerCase();
  const to   = (toUsername || "").toLowerCase();

  if (!from || !to || from === to) {
    return res.status(400).json({ error: "Enter a valid, different username to invite." });
  }

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const [fromUser, toUser] = await Promise.all([
      db.collection("users").findOne({ username: from }),
      db.collection("users").findOne({ username: to }),
    ]);
    if (!fromUser) return res.status(404).json({ error: "Your profile wasn't found." });
    if (!toUser)   return res.status(404).json({ error: "That username doesn't exist." });

    const alreadyActive = await db.collection("duos").findOne({
      status: "active",
      $or: [{ userA: from }, { userB: from }],
    });
    if (alreadyActive) {
      return res.status(400).json({ error: "You're already in a duo. End it before starting a new one." });
    }

    const [userA, userB] = [from, to].sort();
    const existingPair = await db.collection("duos").findOne({ userA, userB });
    if (existingPair) {
      if (existingPair.status === "active")  return res.status(400).json({ error: "Already duo'd with this user." });
      if (existingPair.status === "pending") return res.status(400).json({ error: "An invite with this user is already pending." });
    }

    await db.collection("duos").updateOne(
      { userA, userB },
      {
        $set: { userA, userB, status: "pending", invitedBy: from, createdAt: new Date() },
        $setOnInsert: {
          combinedStats: { views: 0, clicks: 0, shares: 0 },
          streak: { current: 0, longest: 0, lastBothActiveDate: null },
          activeToday: {},
          level: 1,
        },
      },
      { upsert: true }
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[/api/duo/invite]", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
