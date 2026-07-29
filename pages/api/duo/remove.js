// pages/api/duo/remove.js — NO-AUTH TEST VERSION
// POST { username } — ends that user's current duo (active or pending).
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username } = req.body || {};
  const me = (username || "").toLowerCase();
  if (!me) return res.status(400).json({ error: "Username required" });

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const result = await db.collection("duos").deleteOne({ $or: [{ userA: me }, { userB: me }] });
    return res.status(200).json({ ok: true, removed: result.deletedCount > 0 });
  } catch (err) {
    console.error("[/api/duo/remove]", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
