// pages/sitemap.xml.js
// Dynamic XML sitemap: lists the homepage plus every public, indexable
// profile straight from MongoDB. Scales to any number of profiles without
// touching this file. Add this URL (https://linkitin.site/sitemap.xml) to
// Google Search Console and reference it from /public/robots.txt.
import clientPromise from "../lib/mongodb";

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function getServerSideProps({ req, res }) {
  const host  = req.headers.host || "linkitin.site";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const base  = `${proto}://${host}`;

  let usernames = [];
  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    // Only include profiles that are public and have real content — the
    // same bar used for indexability on the profile page itself, so the
    // sitemap never advertises URLs Google is told to noindex.
    const docs = await db.collection("users").find(
      {
        deleted: { $ne: true },
        suspended: { $ne: true },
        isPrivate: { $ne: true },
        private: { $ne: true },
        public: { $ne: false },
        status: { $nin: ["deleted", "suspended", "banned", "private"] },
      },
      { projection: { username: 1, updatedAt: 1, _id: 0 } }
    ).limit(50000).toArray(); // sitemap protocol cap per file

    usernames = docs.filter(d => d.username);
  } catch (e) {
    console.error("[sitemap] failed to load profiles:", e.message);
  }

  const urls = [
    { loc: base, priority: "1.0", changefreq: "daily" },
    ...usernames.map(d => ({
      loc: `${base}/${d.username}`,
      priority: "0.7",
      changefreq: "weekly",
      lastmod: d.updatedAt ? new Date(d.updatedAt).toISOString() : undefined,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(body);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
