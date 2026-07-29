// pages/api/delete.js — NO-AUTH TEST VERSION (same as your original)
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const uname  = username.toLowerCase();

    // Clean up any duo this user was in, so deleting a profile doesn't
    // leave a dangling half-duo behind for the partner.
    await db.collection("duos").deleteMany({
      $or: [{ userA: uname }, { userB: uname }],
    });

    await db.collection("users").deleteOne({ username: uname });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[/api/delete]", err);
    return res.status(500).json({ error: "Database error" });
  }
}
