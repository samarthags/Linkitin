// pages/api/update.js
// PUT or POST /api/update
// Updates an existing profile by username.
// Uses the same storage mechanism as /api/create.
// Works with any storage: JSON file, MongoDB, PlanetScale, Supabase, etc.

import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "profiles.json");

function readProfiles() {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (_) {
    return {};
  }
}

function writeProfiles(profiles) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2));
}

export default async function handler(req, res) {
  // Accept both PUT and POST
  if (req.method !== "PUT" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      username, name, dob, location, bio, aboutme, avatar,
      socialProfiles, links, interests,
    } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const profiles = readProfiles();

    if (!profiles[username]) {
      // Profile doesn't exist yet — create it (upsert behaviour)
      profiles[username] = {};
    }

    // Update all fields
    profiles[username] = {
      ...profiles[username],
      username,
      name:           name           ?? profiles[username].name,
      dob:            dob            ?? profiles[username].dob,
      location:       location       ?? profiles[username].location,
      bio:            bio            ?? profiles[username].bio,
      aboutme:        aboutme        ?? profiles[username].aboutme,
      avatar:         avatar         ?? profiles[username].avatar,
      socialProfiles: socialProfiles ?? profiles[username].socialProfiles,
      links:          links          ?? profiles[username].links,
      interests:      interests      ?? profiles[username].interests,
      updatedAt:      new Date().toISOString(),
    };

    writeProfiles(profiles);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL || "https://mywebsam.site"}/${username}`;
    return res.status(200).json({ url, username, updated: true });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
}
