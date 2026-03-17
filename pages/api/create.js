import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, name, bio } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const existing = await db.collection("users").findOne({ username });

  if (existing) {
    return res.status(400).json({ error: "Username already taken" });
  }

  await db.collection("users").insertOne({
    username,
    name,
    bio,
    createdAt: new Date(),
  });

  res.status(200).json({ url: `/${username}` });
}