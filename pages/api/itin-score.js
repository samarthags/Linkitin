// pages/api/itin-score.js
// GET /api/itin-score?username=xxx  ->  { score, tier }
// Tiers: Bronze 0+, Silver 1000+, Gold 5000+, Platinum 10000+.
import clientPromise from "../../lib/mongodb";

const TIERS = [
  { min: 0,     label: "Bronze"   },
  { min: 1000,  label: "Silver"   },
  { min: 5000,  label: "Gold"     },
  { min: 10000, label: "Platinum" },
];

function tierFor(score) {
  let t = TIERS[0];
  for (const tier of TIERS) if (score >= tier.min) t = tier;
  return t;
}

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "username required" });
  }

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const user = await db.collection("users").findOne(
      { username: String(username).toLowerCase() },
      { projection: { itinScore: 1 } }
    );

    const score = user?.itinScore || 0;
    return res.status(200).json({ score, tier: tierFor(score).label });
  } catch (e) {
    console.error("[api/itin-score]", e);
    return res.status(500).json({ error: "Failed to load score" });
  }
}
