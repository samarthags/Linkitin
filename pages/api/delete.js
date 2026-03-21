// pages/api/delete.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username } = req.body;

  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    await db.collection("users").deleteOne({ username: username.toLowerCase() });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[/api/delete]", err);
    return res.status(500).json({ error: "Database error" });
  }
}
