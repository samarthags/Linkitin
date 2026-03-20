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
    aboutme,
    avatar,
    banner,
    socialProfiles,
    links
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

    const existing = await db.collection("users").findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
    
    if (existing) {
      return res.status(400).json({ error: "Username already taken" });
    }

    await db.collection("users").insertOne({
      username: username.toLowerCase(),
      name,
      dob: dob || null,
      location: location || "",
      aboutme: aboutme || "",
      avatar: avatar || "",
      banner: banner || "",
      socialProfiles: socialProfiles || {
        email: "",
        whatsapp: "",
        instagram: "",
        facebook: "",
        github: "",
        snapchat: "",
        youtube: "",
        twitter: "",
        linkedin: "",
        tiktok: "",
        discord: "",
        telegram: "",
        twitch: "",
        spotify: "",
        medium: "",
        devto: "",
        behance: "",
        dribbble: "",
        pinterest: "",
        reddit: "",
        threads: "",
        bluesky: ""
      },
      links: links || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(200).json({ url: `/${username.toLowerCase()}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}