// pages/api/spotify-search.js
// GET /api/spotify-search?q=blinding+lights
// Searches Spotify for tracks and returns results.
// Uses Client Credentials flow — no user login needed.

let _token = null;
let _tokenExpiry = 0;

async function getToken() {
  // Return cached token if still valid
  if (_token && Date.now() < _tokenExpiry) return _token;

  const clientId     = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured");
  }

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method:  "POST",
    headers: {
      "Authorization": `Basic ${creds}`,
      "Content-Type":  "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Spotify auth failed: ${res.status}`);

  const data = await res.json();
  _token = data.access_token;
  // Expire 60 seconds early to be safe
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return _token;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(200).json({ tracks: [] });
  }

  try {
    const token = await getToken();

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=8&market=IN`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    if (!searchRes.ok) throw new Error(`Spotify search failed: ${searchRes.status}`);

    const data = await searchRes.json();

    const tracks = (data.tracks?.items || []).map(track => ({
      id:     track.id,
      name:   track.name,
      artist: track.artists.map(a => a.name).join(", "),
      album:  track.album.name,
      image:  track.album.images?.[1]?.url || track.album.images?.[0]?.url || null,
      url:    track.external_urls.spotify,
      preview: track.preview_url || null,   // 30-sec preview mp3 (may be null)
    }));

    return res.status(200).json({ tracks });

  } catch (err) {
    console.error("[/api/spotify-search]", err);
    return res.status(500).json({ tracks: [], error: err.message });
  }
}
