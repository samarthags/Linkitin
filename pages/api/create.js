// pages/api/create.js
// POST /api/create
// Creates a new profile. If username already exists, updates it (upsert).
// This ensures the update flow always works even if /api/update isn't wired up.

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      username, name, dob, location, bio, aboutme, avatar,
      socialProfiles, links, interests,
    } = req.body;

    if (!username || !name) {
      return res.status(400).json({ error: "Username and name are required" });
    }

    // Sanitise username
    const safeUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!safeUsername) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const profiles = readProfiles();
    const exists = !!profiles[safeUsername];

    // Upsert — create or update
    profiles[safeUsername] = {
      username:       safeUsername,
      name:           name       || "",
      dob:            dob        || "",
      location:       location   || "",
      bio:            bio        || "",
      aboutme:        aboutme    || "",
      avatar:         avatar     || "",
      socialProfiles: socialProfiles || {},
      links:          links          || [],
      interests:      interests      || {},
      createdAt:      profiles[safeUsername]?.createdAt || new Date().toISOString(),
      updatedAt:      new Date().toISOString(),
    };

    writeProfiles(profiles);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mywebsam.site";
    const url = `${baseUrl}/${safeUsername}`;

    return res.status(200).json({
      url,
      username: safeUsername,
      created:  !exists,
      updated:  exists,
    });

  } catch (err) {
    console.error("Create/update error:", err);
    return res.status(500).json({ error: "Failed to save profile" });
  }
}
