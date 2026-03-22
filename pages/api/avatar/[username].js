// pages/api/avatar/[username].js
// Serves the user's avatar as a real image URL.
// WhatsApp / Instagram / Twitter crawlers cannot load base64 data URLs
// from meta tags — they need a real https:// URL.
// This endpoint converts the stored base64 → proper image response.

import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).end();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const user   = await db.collection("users").findOne(
      { username: username.toLowerCase() },
      { projection: { avatar: 1, _id: 0 } }
    );

    if (!user?.avatar) {
      // Return a 1x1 transparent PNG fallback
      const TRANSPARENT_PNG = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64"
      );
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.send(TRANSPARENT_PNG);
    }

    const avatar = user.avatar;

    if (avatar.startsWith("data:")) {
      // Parse base64 data URL: data:image/jpeg;base64,<data>
      const matches = avatar.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!matches) return res.status(400).end();
      const mimeType   = matches[1]; // e.g. "image/jpeg"
      const base64Data = matches[2];
      const imgBuffer  = Buffer.from(base64Data, "base64");

      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", imgBuffer.length);
      res.setHeader("Cache-Control", "public, max-age=86400"); // 24h cache
      return res.send(imgBuffer);
    } else {
      // It's already a real URL — redirect
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.redirect(302, avatar);
    }
  } catch (err) {
    console.error("[/api/avatar]", err);
    return res.status(500).end();
  }
}
