// pages/api/create.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const {
    username,
    name,
    dob,
    location,
    bio,
    aboutme,
    avatar,
    socialProfiles,
    links,
    interests
  } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: "Username can only contain letters, numbers, underscores, and hyphens"
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const uname = username.toLowerCase();

    // findOneAndUpdate with upsert:true
    //   → If username EXISTS  : updates all fields  (fixes the "no change on edit" bug)
    //   → If username is NEW  : creates it fresh
    // This replaces the old insertOne + "username already taken" block.
    await db.collection("users").findOneAndUpdate(
      { username: uname },
      {
        $set: {
          username:       uname,
          name:           name             || "",
          dob:            dob              || null,
          location:       location         || "",
          bio:            bio              || "",
          aboutme:        aboutme          || "",
          avatar:         avatar           || "",
          socialProfiles: socialProfiles   || {},
          links:          links            || [],
          interests:      interests        || {},
          updatedAt:      new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),  // only written on first create
        },
      },
      {
        upsert: true,            // create if not found
        returnDocument: "after",
      }
    );

    // Build full URL from request host so it works on any domain
    const host     = req.headers.host || "mywebsammu.vercel.app";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const base     = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    return res.status(200).json({ url: `${base}/${uname}` });
  } catch (err) {
    console.error("[/api/create]", err);
    return res.status(500).json({ error: "Database error" });
  }
}
