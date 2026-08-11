// pages/[username].js — save as [username].js (GitHub can't show brackets in
// chat, but the actual filename on disk must be exactly [username].js)
import Head from "next/head";
import { useState, useEffect } from "react";
import clientPromise from "../lib/mongodb";
import DuoBadge from "../components/DuoBadge";
import ItinScoreBadge from "../components/ItinScoreBadge";

// ─── Cloudinary upload helper ─────────────────────────────────────────────────
async function uploadToCloudinary(base64DataUri, folder = "linkitin") {
  // Require crypto locally to prevent Next.js from bundling it to the client and crashing
  const crypto = require("crypto");

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars not configured");
  }

  const timestamp    = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature    = crypto
    .createHmac("sha256", CLOUDINARY_API_SECRET)
    .update(paramsToSign)
    .digest("hex");

  const formData = new FormData();
  formData.append("file",      base64DataUri);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key",   CLOUDINARY_API_KEY);
  formData.append("signature", signature);
  formData.append("folder",    folder);

  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error?.message || "Cloudinary upload failed");
  }
  return json.secure_url;
}

async function maybeUpload(value, folder) {
  if (value && value.startsWith("data:image/")) {
    return await uploadToCloudinary(value, folder);
  }
  return value || "";
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PLAT = {
  email:        { i:"fas fa-envelope",      c:"#EA4335", u:(v)=>`mailto:${v}`,                                    n:"Email" },
  whatsapp:     { i:"fab fa-whatsapp",       c:"#25D366", u:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,          n:"WhatsApp" },
  instagram:    { i:"fab fa-instagram",      c:"#E4405F", u:(v)=>`https://instagram.com/${v.replace("@","")}`,    n:"Instagram" },
  facebook:     { i:"fab fa-facebook-f",     c:"#1877F2", u:(v)=>`https://facebook.com/${v}`,                     n:"Facebook" },
  github:       { i:"fab fa-github",         c:"#ccc",    u:(v)=>`https://github.com/${v}`,                       n:"GitHub" },
  snapchat:     { i:"fab fa-snapchat",       c:"#FFE700", u:(v)=>`https://snapchat.com/add/${v}`,                 n:"Snapchat" },
  youtube:      { i:"fab fa-youtube",        c:"#FF0000", u:(v)=>`https://youtube.com/${v}`,                      n:"YouTube" },
  twitter:      { i:"fab fa-x-twitter",      c:"#ccc",    u:(v)=>`https://twitter.com/${v.replace("@","")}`,      n:"Twitter" },
  linkedin:     { i:"fab fa-linkedin-in",    c:"#0A66C2", u:(v)=>`https://linkedin.com/in/${v}`,                  n:"LinkedIn" },
  tiktok:       { i:"fab fa-tiktok",         c:"#ccc",    u:(v)=>`https://tiktok.com/@${v.replace("@","")}`,      n:"TikTok" },
  discord:      { i:"fab fa-discord",        c:"#5865F2", u:(v)=>`https://discord.com/users/${v}`,                n:"Discord" },
  telegram:     { i:"fab fa-telegram",       c:"#26A5E4", u:(v)=>`https://t.me/${v.replace("@","")}`,             n:"Telegram" },
  twitch:       { i:"fab fa-twitch",         c:"#9146FF", u:(v)=>`https://twitch.tv/${v}`,                        n:"Twitch" },
  spotify:      { i:"fab fa-spotify",        c:"#1DB954", u:(v)=>`https://open.spotify.com/user/${v}`,            n:"Spotify" },
  pinterest:    { i:"fab fa-pinterest",      c:"#E60023", u:(v)=>`https://pinterest.com/${v}`,                    n:"Pinterest" },
  reddit:       { i:"fab fa-reddit-alien",   c:"#FF4500", u:(v)=>`https://reddit.com/user/${v}`,                  n:"Reddit" },
  medium:       { i:"fab fa-medium",         c:"#ccc",    u:(v)=>`https://medium.com/${v.replace("@","")}`,       n:"Medium" },
  codepen:      { i:"fab fa-codepen",        c:"#ccc",    u:(v)=>`https://codepen.io/${v}`,                       n:"CodePen" },
  behance:      { i:"fab fa-behance",        c:"#1769FF", u:(v)=>`https://behance.net/${v}`,                      n:"Behance" },
  dribbble:     { i:"fab fa-dribbble",       c:"#ea4c89", u:(v)=>`https://dribbble.com/${v}`,                     n:"Dribbble" },
  stackoverflow:{ i:"fab fa-stack-overflow", c:"#F58025", u:(v)=>`https://stackoverflow.com/users/${v}`,          n:"Stack Overflow" },
};

const BADGE_ICONS = {
  coder:"fas fa-code", software_dev:"fas fa-code", web_dev:"fas fa-globe",
  app_dev:"fas fa-mobile-screen", data_sci:"fas fa-database", ai_eng:"fas fa-robot",
  devops:"fas fa-server", cybersec:"fas fa-shield-halved", trader:"fas fa-chart-line",
  investor:"fas fa-coins", crypto:"fas fa-bitcoin-sign", banker:"fas fa-building-columns",
  accountant:"fas fa-calculator", fin_analyst:"fas fa-chart-pie", designer:"fas fa-pen-ruler",
  ui_ux:"fas fa-swatchbook", creator:"fas fa-camera", artist:"fas fa-palette",
  photographer:"fas fa-camera-retro", filmmaker:"fas fa-film", musician:"fas fa-music",
  writer:"fas fa-pen-nib", blogger:"fas fa-blog", influencer:"fas fa-star",
  podcaster:"fas fa-microphone", streamer:"fab fa-twitch", entrepreneur:"fas fa-rocket",
  business:"fas fa-briefcase", manager:"fas fa-people-group", consultant:"fas fa-handshake",
  marketer:"fas fa-bullhorn", sales:"fas fa-tags", lawyer:"fas fa-scale-balanced",
  architect:"fas fa-drafting-compass", engineer:"fas fa-screwdriver-wrench",
  researcher:"fas fa-microscope", doctor:"fas fa-user-doctor", nurse:"fas fa-user-nurse",
  pharmacist:"fas fa-pills", psychologist:"fas fa-brain", teacher:"fas fa-chalkboard-user",
  professor:"fas fa-user-tie", lecturer:"fas fa-chalkboard", scientist:"fas fa-flask",
  athlete:"fas fa-person-running", traveler:"fas fa-plane", foodie:"fas fa-utensils",
  chef:"fas fa-utensils", farmer:"fas fa-seedling", gamer:"fas fa-gamepad",
  parent:"fas fa-heart", volunteer:"fas fa-hands-holding-heart", model:"fas fa-person",
  editor:"fas fa-film", animator:"fas fa-wand-sparkles", illustrator:"fas fa-pen-fancy",
  copywriter:"fas fa-pen", journalist:"fas fa-newspaper", actor:"fas fa-masks-theater",
  dancer:"fas fa-music", comedian:"fas fa-face-grin-tears", life_coach:"fas fa-comments",
  nutritionist:"fas fa-apple-whole", real_estate:"fas fa-house", event_mgr:"fas fa-calendar-star",
  pilot:"fas fa-plane-circle-check", electrician:"fas fa-bolt", mechanic:"fas fa-wrench",
  student:"fas fa-graduation-cap", other:"fas fa-star",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcAge(dob) {
  if (!dob) return null;
  const t = new Date(), b = new Date(dob);
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a > 0 ? a : null;
}

function track(username, event) {
  fetch("/api/track", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ username, event }),
  }).catch(()=>{});
}

// ─── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen({ visible }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fafaf7",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        transition: "opacity 0.45s ease, visibility 0.45s ease",
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      <style>{`
        @keyframes lsDots {
          0%,80%,100% { opacity: 0.15; transform: translateY(0) scale(1); }
          40% { opacity: 1; transform: translateY(-6px) scale(1.15); }
        }
        .ls-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ls-dots span {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0a0a0a;
          animation: lsDots 1.3s ease-in-out infinite;
        }
        .ls-dots span:nth-child(2) { animation-delay: .18s; }
        .ls-dots span:nth-child(3) { animation-delay: .36s; }
      `}</style>
      <div className="ls-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ─── Share sheet ───────────────────────────────────────────────────────────────
function ShareSheet({ url, name, onClose }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  async function doCopy() {
    try { await navigator.clipboard.writeText(url); }
    catch (_) {
      const el=document.createElement("textarea"); el.value=url;
      el.style.cssText="position:fixed;opacity:0;"; document.body.appendChild(el);
      el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(()=>setCopied(false),2200);
  }

  const opts = [
    {l:"Copy Link", ic:"fas fa-copy",          bg:"#0a0a0a",fg:"#d7ff3f",fn:doCopy},
    {l:"WhatsApp",  ic:"fab fa-whatsapp",       bg:"#f2fdf5",fg:"#25D366",fn:()=>window.open(`https://wa.me/?text=${enc("Visit "+name+"'s Profile: "+url)}`)},
    {l:"Instagram", ic:"fab fa-instagram",      bg:"#fef2f5",fg:"#E4405F",fn:()=>window.open(`https://www.instagram.com/?url=${enc(url)}`)},
    {l:"Snapchat",  ic:"fab fa-snapchat",       bg:"#fffce8",fg:"#c9a800",fn:()=>window.open(`https://www.snapchat.com/scan?attachmentUrl=${enc(url)}`)},
    {l:"Telegram",  ic:"fab fa-telegram",       bg:"#eef8fd",fg:"#26A5E4",fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc("Visit "+name+"'s Profile!")}`)},
    {l:"Twitter",   ic:"fab fa-x-twitter",      bg:"#f3f3f0", fg:"#0a0a0a",fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc("Visit "+name+"'s Profile! "+url)}`)},
    {l:"Facebook",  ic:"fab fa-facebook-f",     bg:"#eef4ff",fg:"#1877F2",fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`)},
    {l:"LinkedIn",  ic:"fab fa-linkedin-in",    bg:"#e8f3fc",fg:"#0A66C2",fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}&summary=${enc("Visit "+name+"'s Profile!")}`)},
    {l:"Reddit",    ic:"fab fa-reddit-alien",   bg:"#fff2ed",fg:"#FF4500",fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}&title=${enc("Visit "+name+"'s Profile!")}`)},
    {l:"Email",     ic:"fas fa-envelope",       bg:"#fef2f2",fg:"#EA4335",fn:()=>window.open(`mailto:?subject=${enc("Visit "+name+"'s Profile!")}&body=${enc("Visit "+name+"'s Profile: "+url)}`)},
    {l:"SMS",       ic:"fas fa-comment-sms",    bg:"#f0fdf4",fg:"#10b981",fn:()=>window.open(`sms:?body=${enc("Visit "+name+"'s Profile: "+url)}`)},
  ];

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(10,10,10,.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fafaf7",border:"2px solid #0a0a0a",borderBottom:"none",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,paddingBottom:44,animation:"ssUp .28s cubic-bezier(.34,1.4,.64,1) both"}}>
        <style>{`@keyframes ssUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
        <div style={{display:"flex",justifyContent:"center",padding:"14px 0 8px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#0a0a0a",opacity:.2}}/>
        </div>
        <div style={{padding:"8px 20px 14px",borderBottom:"1.5px solid #eae8dd",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:900,fontSize:15,color:"#0a0a0a",textTransform:"uppercase",letterSpacing:".02em"}}>Share</div>
            <div style={{fontSize:11,color:"#6b6b60",marginTop:2,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",background:"#0a0a0a",border:"none",fontSize:17,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>
        <div style={{padding:"14px 10px 0",display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {opts.map(o=>(
            <button key={o.l} onClick={o.fn} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,width:72,padding:"10px 4px",border:"none",background:"transparent",cursor:"pointer",borderRadius:14,outline:"none",WebkitTapHighlightColor:"transparent",transition:"background .12s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f0f0e8"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:52,height:52,borderRadius:14,background:o.bg,color:o.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:o.l==="Copy Link"?"none":"1.5px solid rgba(10,10,10,.08)"}}>
                {o.l==="Copy Link"&&copied?<i className="fas fa-check" style={{color:"#d7ff3f"}}/>:<i className={o.ic}/>}
              </div>
              <span style={{fontSize:10.5,fontWeight:700,color:"#0a0a0a",textAlign:"center",lineHeight:1.2}}>{o.l==="Copy Link"&&copied?"Copied!":o.l}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────
export default function ProfilePage({ user, pageUrl, avatarUrl }) {
  const [shareOpen,    setShareOpen]    = useState(false);
  const [spOpen,       setSpOpen]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [showBirthday, setShowBirthday] = useState(false);
  const [duo,          setDuo]          = useState(null);

  useEffect(()=>{
    if (user?.username) track(user.username, "view");
  },[]);

  // ── Dynamic Duo: fetch public duo status for this profile ──
  useEffect(() => {
    if (!user?.username) return;
    fetch(`/api/duo?username=${user.username}`)
      .then(r => r.json())
      .then(d => setDuo(d.duo))
      .catch(() => {});
  }, [user?.username]);

  /* ── Fixed light theme — TeenStore-inspired: cream bg, black text, muted lime accent ── */
  const theme = { accent:"#cfe95f", glow:"rgba(207,233,95,.22)", hero:"#fafaf7", badge:"#0a0a0a" };

  useEffect(()=>{
    if (!user) { setLoading(false); return; }

    let resolved = false;
    const done = () => {
      if (resolved) return;
      resolved = true;
      setTimeout(() => setLoading(false), 320);
    };

    const safety = setTimeout(done, 4000);
    const pending = [];

    if (user.avatar) {
      const img = new Image();
      img.src = user.avatar;
      if (!img.complete) {
        pending.push(new Promise(res => { img.onload = res; img.onerror = res; }));
      }
    }

    (user.links || []).forEach(lnk => {
      if (lnk.icon?.startsWith("https://")) {
        const img = new Image();
        img.src = lnk.icon;
        if (!img.complete) {
          pending.push(new Promise(res => { img.onload = res; img.onerror = res; }));
        }
      }
    });

    const fontReady = document.fonts ? document.fonts.ready : Promise.resolve();

    Promise.all([fontReady, ...pending]).then(() => {
      clearTimeout(safety);
      done();
    });

    return () => clearTimeout(safety);
  }, [user]);

  // ── SEO helpers ──────────────────────────────────────────────────────────────
  const userAge   = user ? calcAge(user.dob) : null;
  const socials   = user ? Object.entries(user.socialProfiles||{}).filter(([,v])=>v?.trim()).filter(([k])=>PLAT[k]) : [];
  const interests = user ? Object.values(user.interests||{}).flat().filter(v=>v&&typeof v==="string").slice(0,12) : [];
  const bio       = user ? (user.aboutme||user.bio||"") : "";
  const badge     = user?.interests?.role;
  const badgeIcon = badge && BADGE_ICONS[badge];
  const badgeLabel= badge ? badge.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase()) : null;

  const richDesc = user
    ? [
        badgeLabel ? `${user.name} — ${badgeLabel}` : user.name,
        bio ? bio.slice(0, 120) : null,
        socials.length ? `Find ${user.name} on ${socials.slice(0,3).map(([k])=>PLAT[k].n).join(", ")}` : null,
        `Linkitin profile`,
      ].filter(Boolean).join(". ")
    : "Profile not found on Linkitin";

  const ptitle    = user ? `${user.name} (@${user.username}) | Linkitin` : "Not Found | Linkitin";
  const keywords  = user
    ? [
        user.name, user.username, "linkitin",
        badgeLabel, "link in bio", "profile",
        ...socials.map(([k])=>PLAT[k].n),
        ...interests.slice(0,6),
      ].filter(Boolean).join(", ")
    : "linkitin, profile";

  const sameAsUrls = socials.map(([k,v]) => PLAT[k].u(v)).filter(u => !u.startsWith("mailto:"));
  const jsonLd = user ? [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${pageUrl.split("/").slice(0,3).join("/")}/#website`,
      "name": "Linkitin",
      "url": pageUrl.split("/").slice(0,3).join("/"),
      "description": "Create your free link-in-bio profile on Linkitin",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${pageUrl.split("/").slice(0,3).join("/")}/{search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${pageUrl}#profilepage`,
      "name": `${user.name}'s Profile`,
      "url": pageUrl,
      "description": richDesc,
      "dateModified": new Date().toISOString(),
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Linkitin", "item": pageUrl.split("/").slice(0,3).join("/") },
          { "@type": "ListItem", "position": 2, "name": user.name, "item": pageUrl }
        ]
      },
      "mainEntity": { "@id": `${pageUrl}#person` }
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${pageUrl}#person`,
      "name": user.name,
      "url": pageUrl,
      "image": {
        "@type": "ImageObject",
        "url": avatarUrl,
        "width": 400,
        "height": 400,
        "caption": `${user.name} profile photo`
      },
      ...(bio ? { "description": bio } : {}),
      ...(badgeLabel ? { "jobTitle": badgeLabel } : {}),
      ...(userAge ? { "age": userAge } : {}),
      ...(sameAsUrls.length ? { "sameAs": sameAsUrls } : {}),
      ...(interests.length ? { "knowsAbout": interests } : {}),
      "mainEntityOfPage": { "@id": `${pageUrl}#profilepage` },
    }
  ] : null;

  if (!user) {
    return (
      <>
        <Head>
          <title>Not Found | Linkitin</title>
          <link rel="icon" href="/icon.png" type="image/png" />
          <meta name="robots" content="noindex, nofollow"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Sora',sans-serif;background:#fafaf7;color:#0a0a0a;min-height:100vh;display:flex;align-items:center;justify-content:center;}`}</style>
        </Head>
        <div style={{textAlign:"center",padding:32}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#0a0a0a",border:"none",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32,color:"#d7ff3f"}}>
            <i className="fas fa-user-slash"/>
          </div>
          <h1 style={{fontSize:22,fontWeight:900,marginBottom:8,color:"#0a0a0a",textTransform:"uppercase"}}>Profile Not Found</h1>
          <p style={{color:"#6b6b60",marginBottom:28}}>This username doesn't exist yet.</p>
          <a href="/create" style={{background:"#0a0a0a",color:"#d7ff3f",padding:"14px 30px",borderRadius:14,fontWeight:800,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,outline:"none",WebkitTapHighlightColor:"transparent",textTransform:"uppercase",letterSpacing:".03em"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
          <div style={{marginTop:40,fontSize:12,color:"#b0b0a0",fontWeight:600}}>
            Developed by <strong style={{color:"#6b6b60"}}>Samartha Gs</strong>
          </div>
        </div>
      </>
    );
  }

  const themeStyle = {
    "--theme-accent": theme.accent,
    "--theme-glow":   theme.glow,
    "--theme-hero":   theme.hero,
  };

  // animation classes only attach once the loading splash has cleared,
  // so the reveal plays as a real staggered entrance instead of everything
  // already being in its final state when the splash fades out.
  const reveal = (cls) => (!loading ? ` ${cls}` : "");

  return (
    <>
      <Head>
        {/* ── Primary SEO ── */}
        <title>{ptitle}</title>
        <meta name="description"    content={richDesc}/>
        <meta name="keywords"       content={keywords}/>
        <meta name="author"         content={user.name}/>
        <meta name="robots"         content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
        <meta name="googlebot"      content="index, follow, max-image-preview:large, max-snippet:-1"/>
        <link rel="canonical"       href={pageUrl}/>

        {/* ── Viewport / Theme / PWA hints ── */}
        <meta name="viewport"           content="width=device-width,initial-scale=1,viewport-fit=cover"/>
        <meta name="theme-color"        content="#fafaf7"/>
        <style>{`body{--theme-accent:${theme.accent};--theme-glow:${theme.glow};}`}</style>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="format-detection"   content="telephone=no"/>
        <link rel="icon"                href="/icon.png" type="image/png"/>
        <link rel="apple-touch-icon"    href="/icon.png"/>

        {/* ── Open Graph ── */}
        <meta property="og:type"              content="profile"/>
        <meta property="og:title"             content={ptitle}/>
        <meta property="og:description"       content={richDesc}/>
        <meta property="og:url"               content={pageUrl}/>
        <meta property="og:site_name"         content="Linkitin"/>
        <meta property="og:locale"            content="en_US"/>
        <meta property="og:image"             content={avatarUrl}/>
        <meta property="og:image:secure_url"  content={avatarUrl}/>
        <meta property="og:image:width"       content="400"/>
        <meta property="og:image:height"      content="400"/>
        <meta property="og:image:type"        content="image/jpeg"/>
        <meta property="og:image:alt"         content={`${user.name}'s profile photo`}/>
        {user.username && <meta property="profile:username" content={user.username}/>}

        {/* ── Twitter / X Card ── */}
        <meta name="twitter:card"        content="summary_large_image"/>
        <meta name="twitter:site"        content="@linkitin"/>
        <meta name="twitter:title"       content={ptitle}/>
        <meta name="twitter:description" content={richDesc}/>
        <meta name="twitter:image"       content={avatarUrl}/>
        <meta name="twitter:image:alt"   content={`${user.name}'s profile photo`}/>
        {user.socialProfiles?.twitter &&
          <meta name="twitter:creator" content={`@${user.socialProfiles.twitter.replace("@","")}`}/>}

        {/* ── Article / Author signal ── */}
        <meta property="article:author" content={pageUrl}/>

        {/* ── JSON-LD Structured Data ── */}
        {jsonLd && jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* ── Preconnect / Critical resource hints ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com"/>
        {user.avatar && <link rel="preload" as="image" href={user.avatar} fetchpriority="high"/>}
        <link rel="dns-prefetch" href="https://open.spotify.com"/>

        {/* ── Fonts & Icons ── */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{background:#fafaf7;color:#0a0a0a;font-family:'Sora',sans-serif;min-height:100vh;overflow-x:hidden;}

          /* ── TeenStore-inspired light theme: cream bg, black text, muted lime accent ── */
          .themed-bg{background:var(--theme-hero,#fafaf7);min-height:100vh;}
          .soc-btn:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 6px 16px rgba(10,10,10,.08);border-color:#0a0a0a;}
          .foot-cta:hover{color:#0a0a0a!important;}

          @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
          @keyframes slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
          @keyframes popIn{from{opacity:0;transform:scale(.85);}to{opacity:1;transform:scale(1);}}
          @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
          @keyframes agePop{from{opacity:0;transform:translateY(-3px) scale(.92);}to{opacity:1;transform:translateY(0) scale(1);}}
          @keyframes heroZoom{from{transform:scale(1.08);}to{transform:scale(1);}}
          .agePop{animation:agePop .28s cubic-bezier(.34,1.56,.64,1) both;}

          .s1{animation:slideUp .62s .02s cubic-bezier(.16,1,.3,1) both;}
          .s2{animation:slideUp .62s .10s cubic-bezier(.16,1,.3,1) both;}
          .s3{animation:slideUp .62s .18s cubic-bezier(.16,1,.3,1) both;}
          .s4{animation:slideUp .62s .26s cubic-bezier(.16,1,.3,1) both;}
          .s5{animation:slideUp .62s .34s cubic-bezier(.16,1,.3,1) both;}
          .s6{animation:slideUp .62s .42s cubic-bezier(.16,1,.3,1) both;}
          .s7{animation:slideUp .62s .50s cubic-bezier(.16,1,.3,1) both;}
          .s-fab{animation:popIn .5s .3s cubic-bezier(.34,1.56,.64,1) both;}

          .hero{position:relative;width:100%;height:52vh;min-height:280px;max-height:440px;overflow:hidden;animation:fadeIn .8s ease both;background:#fafaf7;}
          .hero::before{
            content:"";position:absolute;top:-20%;right:-15%;width:60%;height:70%;
            background:radial-gradient(circle,var(--theme-glow,rgba(207,233,95,.22)) 0%,rgba(207,233,95,0) 70%);
            pointer-events:none;z-index:0;
          }
          .hero-img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;position:relative;z-index:1;border-radius:0 0 32px 32px;filter:brightness(1.01) contrast(1.02) saturate(1.03);animation:heroZoom 6s ease-out both;}
          .hero-fade{
            position:absolute;inset:0;pointer-events:none;z-index:1;
            background:linear-gradient(
              to bottom,
              rgba(250,250,247,0) 0%,
              rgba(250,250,247,.04) 45%,
              rgba(250,250,247,.22) 65%,
              rgba(250,250,247,.62) 82%,
              rgba(250,250,247,.94) 94%,
              rgba(250,250,247,1) 100%
            );
          }

          .hero-ph{width:100%;height:52vh;min-height:300px;max-height:460px;background:#fafaf7;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
          .hero-ph::before{
            content:"";position:absolute;top:-20%;right:-15%;width:60%;height:70%;
            background:radial-gradient(circle,var(--theme-glow,rgba(207,233,95,.22)) 0%,rgba(207,233,95,0) 70%);
            pointer-events:none;
          }
          .av-ph{width:110px;height:110px;border-radius:50%;background:#0a0a0a;border:3px solid #0a0a0a;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:900;color:#d7ff3f;position:relative;z-index:1;}

          .id-block{text-align:center;padding:0 20px 0;position:relative;z-index:2;margin-top:-56px;}
          .pname{font-size:clamp(30px,8.5vw,50px);font-family:'Archivo Black','Sora',sans-serif;font-weight:400;color:#0a0a0a;letter-spacing:-.01em;line-height:1.02;margin-bottom:10px;text-transform:uppercase;}
          .badge-row{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:4px;}

          /* ── Age pill — outlined, clickable, toggles age ↔ birthday ── */
          .age-pill{
            display:inline-flex;align-items:center;gap:5px;
            background:#fff;
            border:2px solid #0a0a0a;
            border-radius:999px;padding:6px 13px;
            font-size:12px;font-weight:800;
            color:#0a0a0a;
            cursor:pointer;
            transition:background .25s cubic-bezier(.16,1,.3,1),transform .22s cubic-bezier(.34,1.56,.64,1);
            user-select:none;
          }
          .age-pill:hover{background:#f3f3ea;}
          .age-pill:active{transform:scale(.94);}
          .age-pill i{font-size:9px;opacity:.7;}

          /* ── Badge pill — solid black + muted lime, matches Duo badge ── */
          .badge-pill{
            display:inline-flex;align-items:center;gap:6px;
            background:#0a0a0a;
            border:none;
            border-radius:999px;
            padding:6px 14px 6px 11px;
            font-size:12px;font-weight:800;
            color:var(--theme-accent,#cfe95f);
            letter-spacing:.04em;
            text-transform:uppercase;
            cursor:default;
            -webkit-tap-highlight-color:transparent;
          }
          .badge-pill i{ font-size:10px; color:var(--theme-accent,#cfe95f); }

          /* ── Badge row items pop in one after another, staggered by inline delay ── */
          @keyframes badgePop{from{opacity:0;transform:translateY(6px) scale(.9);}to{opacity:1;transform:translateY(0) scale(1);}}
          .bp{animation:badgePop .42s cubic-bezier(.34,1.56,.64,1) both;}

          .content{max-width:520px;margin:0 auto;padding:18px 16px 72px;}
          .bio-text{font-size:15px;line-height:1.7;color:#2e2e28;text-align:center;margin-bottom:24px;font-weight:400;}

          .soc-row{display:flex;justify-content:center;flex-wrap:wrap;gap:9px;margin-bottom:20px;}
          .soc-btn{
            width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;
            font-size:17px;background:#fff;border:1.5px solid #e5e5da;
            transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .18s,border-color .15s;
            position:relative;
          }
          .soc-btn:active{transform:scale(.93);}

          .links-container{margin-bottom:20px;}
          .links{display:flex;flex-direction:column;gap:10px;}
          .lbtn{
            display:flex;align-items:center;width:100%;padding:13px 15px;
            background:#fff;border:1.5px solid rgba(10,10,10,.10);border-radius:18px;
            cursor:pointer;box-shadow:0 1px 3px rgba(10,10,10,.045);
            transition:transform .32s cubic-bezier(.16,1,.3,1),box-shadow .32s cubic-bezier(.16,1,.3,1),border-color .22s,background .22s;
          }
          .lbtn:hover{background:#f8fbe8;border-color:rgba(10,10,10,.26);box-shadow:0 12px 28px rgba(10,10,10,.10);transform:translateY(-3px);}
          .lbtn:active{transform:translateY(-1px) scale(.99);}
          .lbtn:active{background:#f0f0e5;}
          .lbtn-ic-wrap{width:50px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
          .lbtn-ic{width:50px;height:50px;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:24px;color:#0a0a0a;background:#f3f3ea;border:1.5px solid #e5e5da;flex-shrink:0;}
          .lbtn-t{flex:1;font-size:14px;font-weight:700;color:#0a0a0a;padding:0 12px;letter-spacing:-.01em;}
          .lbtn-a{font-size:10px;color:#0a0a0a;opacity:.35;transition:transform .14s;flex-shrink:0;}
          .lbtn:hover .lbtn-a{opacity:.7;transform:translateX(2px);}

          .sp-block{margin-bottom:20px;}
          .sp-card{background:#fff;border:1.5px solid rgba(10,10,10,.10);border-radius:20px;overflow:hidden;cursor:pointer;box-shadow:0 1px 3px rgba(10,10,10,.045);transition:box-shadow .32s cubic-bezier(.16,1,.3,1),transform .32s cubic-bezier(.16,1,.3,1);}
          .sp-card:hover{box-shadow:0 12px 28px rgba(10,10,10,.10);transform:translateY(-2px);}
          .sp-trig{display:flex;align-items:center;gap:13px;padding:14px 16px;position:relative;}
          .sp-trig.open{border-bottom:1.5px solid #e5e5da;}
          .sp-art{width:50px;height:50px;border-radius:10px;background:#0a0a0a;border:none;display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--theme-accent,#cfe95f);flex-shrink:0;}
          .sp-meta{flex:1;min-width:0;}
          .sp-eye{font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#8a8a7c;margin-bottom:4px;display:flex;align-items:center;gap:5px;}
          .sp-dot{display:none;}
          .sp-title{font-size:14px;font-weight:700;color:#0a0a0a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3;}
          .sp-artist{font-size:11.5px;color:#5c5c50;margin-top:2px;}
          .sp-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
          .sp-play-btn{width:34px;height:34px;border-radius:50%;background:#0a0a0a;border:none;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--theme-accent,#cfe95f);transition:transform .15s;flex-shrink:0;}
          .sp-card:hover .sp-play-btn{transform:scale(1.08);}
          .sp-embed{overflow:hidden;background:#fff;padding:10px 10px 0;}

          .foot{text-align:center;padding:8px 0 4px;}
          .foot-cta{font-size:12px;color:#8a8a7c;font-weight:700;letter-spacing:.02em;}

          /* ── Share FAB — Apple-style: transparent glass, minimal, outlined icon ── */
          .sfab{
            position:fixed;top:16px;right:16px;width:44px;height:44px;border-radius:50%;
            background:rgba(255,255,255,.5);
            -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
            border:1.5px solid rgba(10,10,10,.12);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;color:#0a0a0a;cursor:pointer;z-index:80;
            transition:transform .18s cubic-bezier(.34,1.56,.64,1),background .15s;
            box-shadow:0 2px 10px rgba(10,10,10,.06);
          }
          .sfab:hover{transform:translateY(-2px) scale(1.05);background:rgba(255,255,255,.78);}
          .sfab:active{transform:scale(.93);}

          @media(max-width:420px){
            .hero{height:48vh;}
            .id-block{margin-top:-44px;}
            .pname{font-size:26px;}
            .content{padding:10px 14px 56px;}
            .lbtn{min-height:54px;border-radius:14px;}
            .lbtn-t{font-size:14px;}
            .soc-btn{width:42px;height:42px;font-size:16px;border-radius:11px;}
            .sp-trig{padding:12px 14px;}
            .badge-row{gap:6px;}
          }

          /* ── Tablet ── */
          @media(min-width:601px){
            .content{max-width:580px;padding:22px 24px 84px;}
            .bio-text{font-size:16px;}
            .soc-btn{width:50px;height:50px;font-size:18px;}
            .lbtn{padding:14px 16px;}
            .lbtn-t{font-size:15px;}
          }

          /* ── Desktop ── */
          @media(min-width:900px){
            .hero{height:58vh;max-height:520px;border-radius:0 0 44px 44px;box-shadow:0 24px 60px rgba(10,10,10,.10);}
            .content{max-width:640px;padding:26px 24px 96px;}
            .pname{font-size:clamp(38px,5vw,56px);}
            .lbtn:hover{transform:translateY(-3px);}
            .lbtn{transition:background .22s,box-shadow .32s cubic-bezier(.16,1,.3,1),transform .32s cubic-bezier(.16,1,.3,1),border-color .22s;}
            .soc-btn:hover{transform:translateY(-4px) scale(1.08);}
          }
        `}</style>
      </Head>

      {/* ── LOADING SPLASH ── */}
      <LoadingScreen visible={loading} />

      {/* ── Theme background overlay + subtle dot-grid texture for depth ── */}
      <div style={{position:"fixed",inset:0,background:theme.hero,zIndex:-1,opacity:.6,pointerEvents:"none"}}/>
      <div style={{
        position:"fixed",inset:0,zIndex:-1,pointerEvents:"none",
        backgroundImage:"radial-gradient(rgba(10,10,10,.05) 1px, transparent 1px)",
        backgroundSize:"22px 22px",
      }}/>

      {/* ── Share FAB (Apple-style) ── */}
      <button className={`sfab${reveal("s-fab")}`} onClick={()=>{
        setShareOpen(true);
        track(user.username,"share");
      }} aria-label="Share">
        <i className="fas fa-arrow-up-from-bracket"/>
      </button>

      {/* ── HERO ── */}
      {user.avatar ? (
        <div className="hero">
          <img
            src={user.avatar}
            alt={`${user.name}'s profile photo`}
            className="hero-img"
            fetchpriority="high"
          />
          <div className="hero-fade"/>
        </div>
      ) : (
        <div className="hero-ph">
          <div className="av-ph">{user.name?.charAt(0)?.toUpperCase()||"?"}</div>
        </div>
      )}

      {/* ── Identity ── */}
      <div className={`id-block${reveal("s1")}`}>
        <h1 className="pname">{user.name}</h1>
        <div className="badge-row">
          {/* Age pill — click to toggle between age and birthday */}
          {userAge && user.dob && (
            <span className={reveal("bp")} style={{animationDelay:"0s"}}>
              <span
                key={showBirthday ? "bday" : "age"}
                className="age-pill agePop"
                onClick={() => setShowBirthday(v => !v)}
                title={showBirthday ? "Show age" : "Show birthday"}
              >
                <i className={showBirthday ? "fas fa-calendar-heart" : "fas fa-user"}/>
                {showBirthday
                  ? new Date(user.dob + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : `${userAge} y/o`}
              </span>
            </span>
          )}
          {/* Advanced badge pill */}
          {badgeLabel && (
            <span className={reveal("bp")} style={{animationDelay:".06s"}}>
              <span className="badge-pill">
                {badgeIcon && <i className={badgeIcon}/>}
                {badgeLabel}
              </span>
            </span>
          )}
          {/* Itin score — compact, tap for full tier breakdown. Works for any
              profile: it fetches live by user.username, nothing hardcoded. */}
          <span className={reveal("bp")} style={{animationDelay:".12s"}}>
            <ItinScoreBadge username={user.username} />
          </span>
          {/* Dynamic Duo — same compact-pill + modal pattern as Itin Score */}
          {duo && (
            <span className={reveal("bp")} style={{animationDelay:".18s"}}>
              <DuoBadge duo={{...duo, me: {username: user.username, name: user.name, avatar: user.avatar}}} />
            </span>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="content">

        {bio && <p className={`bio-text${reveal("s2")}`}>{bio}</p>}

        {socials.length > 0 && (
          <div className={`soc-row${reveal("s3")}`}>
            {socials.map(([pl,val],idx)=>{
              const m=PLAT[pl];
              return(
                <a key={pl} href={m.u(val)} target="_blank" rel="noopener noreferrer"
                  className={`soc-btn${reveal("bp")}`} title={m.n} aria-label={m.n}
                  style={{color:m.c, animationDelay:`${idx*0.035}s`}}
                  onClick={()=>track(user.username, `social_${pl}`)}>
                  <i className={m.i}/>
                </a>
              );
            })}
          </div>
        )}

        {(user.links||[]).length > 0 && (
          <div className={`links-container${reveal("s4")}`}>
            <div className="links">
              {user.links.map((lnk,i)=>(
                <a key={lnk.id||i} href={lnk.url} target="_blank" rel="noopener noreferrer"
                  className={`lbtn${reveal("bp")}`}
                  style={{animationDelay:`${i*0.05}s`}}
                  aria-label={lnk.title}
                  onClick={()=>track(user.username,"link_click")}>
                  <div className="lbtn-ic-wrap">
                    <div className="lbtn-ic">
                      {(lnk.icon?.startsWith("https://") || lnk.icon?.startsWith("data:"))
                        ? <img src={lnk.icon} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",borderRadius:"10px"}} alt=""/>
                        : lnk.icon?.startsWith("fas ") || lnk.icon?.startsWith("fab ")
                          ? <i className={lnk.icon}/>
                          : <span style={{fontSize:17}}>{lnk.icon||"🔗"}</span>}
                    </div>
                  </div>
                  <div className="lbtn-t">{lnk.title}</div>
                  <div className="lbtn-a"><i className="fas fa-arrow-up-right-from-square"/></div>
                </a>
              ))}
            </div>
          </div>
        )}

        {user.favSongTrackId && (
          <div className={`sp-block${reveal("s5")}`}>
            <div className="sp-card">
              <div className={`sp-trig${spOpen?" open":""}`}
                onClick={()=>{setSpOpen(v=>!v);if(!spOpen)track(user.username,"spotify_play");}}>
                <div className="sp-art"><i className="fas fa-music"/></div>
                <div className="sp-meta">
                  <div className="sp-eye"><span className="sp-dot"/>Favourite one</div>
                  <div className="sp-title">{user.favSong||"My Favourite Song"}</div>
                  {user.favArtist&&<div className="sp-artist">{user.favArtist}</div>}
                </div>
                <div className="sp-right">
                  <div className="sp-play-btn">
                    <i className={spOpen?"fas fa-chevron-up":"fas fa-play"} style={{marginLeft:spOpen?0:2}}/>
                  </div>
                </div>
              </div>
              {spOpen&&(
                <div className="sp-embed">
                  <iframe
                    src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0&autoplay=1`}
                    width="100%" height="380" frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy" style={{display:"block",width:"100%",maxWidth:"100%"}}
                    title={`${user.favSong || "Favourite Song"} by ${user.favArtist || "Artist"}`}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`foot${reveal("s7")}`}>
          <a href="/" className="foot-cta">Create your own profile — it's free</a>
        </div>

      </div>

      {shareOpen&&<ShareSheet url={pageUrl} name={user.name} onClose={()=>setShareOpen(false)}/>}
    </>
  );
}

// ─── SSR ──────────────────────────────────────────────────────────────────────
export async function getServerSideProps({ params, req }) {
  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const raw    = await db.collection("users").findOne(
      { username: params.username.toLowerCase() },
      { projection: { _id: 0 } }
    );

    const host    = req.headers.host || "linkitin.site";
    const proto   = host.startsWith("localhost") ? "http" : "https";
    const base    = `${proto}://${host}`;
    const pageUrl = `${base}/${params.username.toLowerCase()}`;

    if (!raw) {
      return { props: { user: null, pageUrl, avatarUrl: `${base}/api/avatar/${params.username.toLowerCase()}` } };
    }

    // ── Migrate any legacy base64 blobs to Cloudinary on first view ──────────
    let needsUpdate = false;

    let safeAvatar = raw.avatar || "";
    if (safeAvatar.startsWith("data:image/")) {
      try {
        safeAvatar = await uploadToCloudinary(safeAvatar, "linkitin/avatars");
        needsUpdate = true;
      } catch (e) {
        console.error("[username SSR] avatar upload failed:", e.message);
        safeAvatar = "";
      }
    }

    const safeLinks = await Promise.all(
      (raw.links || []).map(async (lnk) => {
        if (lnk.icon && lnk.icon.startsWith("data:image/")) {
          try {
            const url = await uploadToCloudinary(lnk.icon, "linkitin/link-icons");
            needsUpdate = true;
            return { ...lnk, icon: url };
          } catch (e) {
            console.error("[username SSR] link icon upload failed:", e.message);
            return { ...lnk, icon: "fas fa-link" };
          }
        }
        return lnk;
      })
    );

    if (needsUpdate) {
      try {
        await db.collection("users").updateOne(
          { username: raw.username },
          { $set: { avatar: safeAvatar, links: safeLinks, updatedAt: new Date() } }
        );
      } catch (e) {
        console.error("[username SSR] migration save failed:", e.message);
      }
    }

    const avatarUrl = safeAvatar || `${base}/api/avatar/${params.username.toLowerCase()}`;

    return {
      props: {
        pageUrl,
        avatarUrl,
        user: JSON.parse(JSON.stringify({
          username:       raw.username       || "",
          name:           raw.name           || "",
          dob:            raw.dob            || null,
          bio:            raw.bio            || "",
          aboutme:        raw.aboutme        || "",
          avatar:         safeAvatar,
          socialProfiles: raw.socialProfiles || {},
          links:          safeLinks,
          interests:      raw.interests      || {},
          favSong:        raw.favSong        || "",
          favArtist:      raw.favArtist      || "",
          favSongTrackId: raw.favSongTrackId || "",
        }))
      }
    };
  } catch(e) {
    console.error("[username page]", e);
    const host  = req?.headers?.host || "linkitin.site";
    const proto = host.startsWith("localhost") ? "http" : "https";
    const base  = `${proto}://${host}`;
    return { props: { user: null, pageUrl: `${base}/${params.username}`, avatarUrl: `${base}/api/avatar/${params.username}` } };
  }
}
