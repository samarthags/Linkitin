// pages/api/track.js — same dedup/fingerprint logic as your original, PLUS:
// - if the user is in an active duo, feeds combined stats + streak
// - +10 Itin Score for every unique view (separate from Duo entirely)

import clientPromise from "../../lib/mongodb";
import { bumpDuoStreak } from "../../lib/duo";

function makeKey(req, username, event) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim()
           || req.headers["x-real-ip"]
           || req.socket?.remoteAddress
           || "unknown";
  const ua  = (req.headers["user-agent"] || "").slice(0, 80);
  const day = new Date().toISOString().slice(0, 10);
  let h = 0;
  const s = `${ip}|${ua}|${day}|${event}|${username}`;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i), h |= 0;
  return `dedup:${Math.abs(h).toString(36)}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, event } = req.body || {};
  if (!username || !event) return res.status(400).end();

  const allowed = ["view", "link_click", "spotify_play", "share"];
  if (!allowed.includes(event)) return res.status(400).end();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const uname  = username.toLowerCase();

    // ── Dedup — server-side fingerprint only, no browser storage involved ──
    const key   = makeKey(req, uname, event);
    const dedup = db.collection("dedup");
    const already = await dedup.findOne({ _id: key });
    if (already) return res.status(200).json({ ok: true, deduped: true });

    const expiresAt = new Date(Date.now() + 86400 * 1000);
    await dedup.insertOne({ _id: key, expiresAt });
    await dedup.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, background: true });

    // ── Increment the profile's own analytics + Itin Score ──
    const inc = {};
    if (event === "view") {
      inc["analytics.views"] = 1;
      inc["itinScore"]       = 10; // +10 per unique view, separate from Duo
    }
    if (event === "link_click")   inc["analytics.linkClicks"]   = 1;
    if (event === "spotify_play") inc["analytics.spotifyPlays"] = 1;
    if (event === "share")        inc["analytics.shares"]       = 1;

    await db.collection("users").updateOne({ username: uname }, { $inc: inc });

    // ── Feed an active duo, if this user has one ──
    const duo = await db.collection("duos").findOne({
      status: "active",
      $or: [{ userA: uname }, { userB: uname }],
    });
    if (duo) {
      const duoInc = {};
      if (event === "view")       duoInc["combinedStats.views"]  = 1;
      if (event === "link_click") duoInc["combinedStats.clicks"] = 1;
      if (event === "share")      duoInc["combinedStats.shares"] = 1;

      if (Object.keys(duoInc).length) {
        await db.collection("duos").updateOne({ _id: duo._id }, { $inc: duoInc });
        await bumpDuoStreak(db, duo._id, uname);
      }
    }

    return res.status(200).json({ ok: true, deduped: false });
  } catch (err) {
    console.error("[track]", err);
    return res.status(500).end();
  }
}
