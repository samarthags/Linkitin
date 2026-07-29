// pages/api/duo/search.js — NO-AUTH TEST VERSION
// GET ?q=xxx&exclude=myusername — username autocomplete for sending invites.
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { q, exclude } = req.query;
  if (!q || q.trim().length < 2) return res.status(200).json({ results: [] });

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const filter = {
      username: { $regex: `^${q.toLowerCase().replace(/[^a-z0-9_-]/g, "")}` },
    };
    if (exclude) filter.username.$ne = exclude.toLowerCase();

    const results = await db.collection("users").find(
      filter,
      { projection: { username: 1, name: 1, avatar: 1 } }
    ).limit(8).toArray();

    return res.status(200).json({ results });
  } catch (err) {
    console.error("[/api/duo/search]", err);
    return res.status(200).json({ results: [] });
  }
}
