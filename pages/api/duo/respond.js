// pages/api/duo/respond.js — NO-AUTH TEST VERSION
// POST { username, action: "accept" | "decline" }
// `username` = the person responding (must be the invited party, not the inviter).
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, action } = req.body || {};
  const me = (username || "").toLowerCase();
  if (!me) return res.status(400).json({ error: "Username required" });
  if (!["accept", "decline"].includes(action)) return res.status(400).json({ error: "Invalid action" });

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const pending = await db.collection("duos").findOne({
      status: "pending",
      $or: [{ userA: me }, { userB: me }],
    });
    if (!pending) return res.status(404).json({ error: "No pending invite found." });
    if (pending.invitedBy === me) {
      return res.status(400).json({ error: "You can't respond to your own invite." });
    }

    if (action === "decline") {
      await db.collection("duos").deleteOne({ _id: pending._id });
      return res.status(200).json({ ok: true, status: "declined" });
    }

    const other = pending.invitedBy;
    const conflict = await db.collection("duos").findOne({
      status: "active",
      $or: [{ userA: me }, { userB: me }, { userA: other }, { userB: other }],
    });
    if (conflict) {
      return res.status(400).json({ error: "One of you already joined a different duo." });
    }

    await db.collection("duos").updateOne(
      { _id: pending._id },
      { $set: { status: "active", startDate: new Date() } }
    );
    return res.status(200).json({ ok: true, status: "active" });
  } catch (err) {
    console.error("[/api/duo/respond]", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
