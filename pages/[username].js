// pages/[username].js — the filename on disk must be exactly [username].js
import Head from "next/head";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from "motion/react";
import clientPromise from "../lib/mongodb";
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

// ─── Motion presets ───────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.07, type: "spring", stiffness: 240, damping: 24 },
  }),
};
const popSpring = {
  hidden:  { opacity: 0, scale: 0.8 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.06, type: "spring", stiffness: 320, damping: 18 },
  }),
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

function truncate(str, max) {
  if (!str) return "";
  const s = String(str).trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

// JSON.stringify already escapes quotes; "<" is neutralized so user-entered
// data can never break out of the surrounding <script> tag.
function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch (_) { return ""; }
}

function prettyLabel(s) {
  return String(s).replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// Builds a .vcf file so visitors can save the person straight to their contacts.
function downloadVCard(user, pageUrl) {
  const sp = user.socialProfiles || {};
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${user.name}`,
    `N:;${user.name};;;`,
    `URL:${pageUrl}`,
  ];
  if (sp.email?.trim())    lines.push(`EMAIL:${sp.email.trim()}`);
  if (sp.whatsapp?.trim()) lines.push(`TEL;TYPE=CELL:${sp.whatsapp.trim()}`);
  const note = user.aboutme || user.bio;
  if (note) lines.push(`NOTE:${String(note).replace(/\r?\n/g, " ").replace(/[,;]/g, " ")}`);
  if (user.dob) lines.push(`BDAY:${user.dob}`);
  lines.push("END:VCARD");
  const blob = new Blob([lines.join("\r\n")], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${user.username || "contact"}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

// ─── Magnetic hover wrapper ───────────────────────────────────────────────────
function Magnetic({ children, strength = 0.35 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  function onMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onMouseLeave() { x.set(0); y.set(0); }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Split-letter name reveal: letters rise out of a mask, then jelly on hover ─
function SplitName({ text, start }) {
  const words = String(text).split(" ");
  const [free, setFree] = useState(false);
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setFree(true), 1500 + String(text).length * 45);
    return () => clearTimeout(t);
  }, [start, text]);
  let n = 0;
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className={`sw${free ? " free" : ""}`} aria-hidden="true">
          {w.split("").map((ch, ci) => {
            const d = 0.15 + (n++) * 0.045;
            return (
              <motion.span
                key={ci}
                className="sc"
                initial={{ y: "115%", rotate: 8, opacity: 0, filter: "blur(6px)" }}
                animate={start ? { y: "0%", rotate: 0, opacity: 1, filter: "blur(0px)" } : {}}
                transition={{ delay: d, type: "spring", stiffness: 200, damping: 18 }}
                whileHover={free ? { y: "-14%", scale: 1.12, rotate: ci % 2 ? 4 : -4, transition: { type: "spring", stiffness: 500, damping: 12 } } : undefined}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </>
  );
}

// ─── Infinite marquee of interests (auto-pauses on hover) ────────────────────
function Marquee({ items }) {
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-label="Interests">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span className="marquee-chip" key={i} aria-hidden={i >= items.length}>
            <i className="fas fa-sparkles" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Spotlight + 3D tilt link card — border glow follows the cursor ──────────
function TiltLink({ href, onClick, ariaLabel, children, index, featured }) {
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const srX = useSpring(rX, { stiffness: 260, damping: 20, mass: 0.5 });
  const srY = useSpring(rY, { stiffness: 260, damping: 20, mass: 0.5 });
  const lift = useMotionValue(0);
  const sLift = useSpring(lift, { stiffness: 260, damping: 22 });

  function onMouseMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rY.set((px - 0.5) * 8);
    rX.set((0.5 - py) * 6);
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
  function onMouseEnter() { lift.set(-3); }
  function onMouseLeave() { rX.set(0); rY.set(0); lift.set(0); }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`lbtn${featured ? " featured" : ""}`}
      aria-label={ariaLabel}
      onClick={onClick}
      initial="hidden"
      animate={index.animate}
      custom={index.i}
      variants={fadeUp}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.985 }}
      style={{ rotateX: srX, rotateY: srY, y: sLift, transformPerspective: 800 }}
    >
      <span className="lbtn-glow" aria-hidden="true" />
      {children}
    </motion.a>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen({ visible }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "#fafaf7", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
        transition: "opacity 0.45s ease, visibility 0.45s ease",
        opacity: visible ? 1 : 0, visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      <style>{`
        @keyframes lsDots {
          0%,80%,100% { opacity: .15; transform: translateY(0) scale(1); }
          40% { opacity: 1; transform: translateY(-6px) scale(1.15); }
        }
        .ls-dots{display:flex;align-items:center;gap:8px;}
        .ls-dots span{display:inline-block;width:8px;height:8px;border-radius:50%;background:#0a0a0a;animation:lsDots 1.3s ease-in-out infinite;}
        .ls-dots span:nth-child(2){animation-delay:.18s;}
        .ls-dots span:nth-child(3){animation-delay:.36s;}
      `}</style>
      <div className="ls-dots"><span /><span /><span /></div>
    </div>
  );
}

// ─── Sparkle burst (copy button) ──────────────────────────────────────────────
function SparkleBurst() {
  const particles = useRef(
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return { id: i, dx: Math.cos(angle) * 34, dy: Math.sin(angle) * 34 };
    })
  ).current;

  return (
    <>
      {particles.map(p => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: 0, x: p.dx, y: p.dy, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ position:"absolute", top:"50%", left:"50%", width:5, height:5, borderRadius:"50%", background:"#d7ff3f", pointerEvents:"none" }}
        />
      ))}
    </>
  );
}

// ─── Birthday confetti ────────────────────────────────────────────────────────
function Confetti() {
  const pieces = useRef(
    Array.from({ length: 46 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 360,
      y: -(120 + Math.random() * 280),
      r: Math.random() * 540 - 270,
      c: ["#d7ff3f", "#0a0a0a", "#ff5c8a", "#4cc9f0", "#ffd166"][i % 5],
      w: 6 + Math.random() * 6,
      d: Math.random() * 0.25,
    }))
  ).current;
  return (
    <div style={{ position:"fixed", left:"50%", top:"55%", zIndex:200, pointerEvents:"none" }} aria-hidden="true">
      {pieces.map(p => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 520], opacity: [1, 1, 0], rotate: p.r }}
          transition={{ duration: 2.4, delay: p.d, ease: "easeOut", times: [0, 0.35, 1] }}
          style={{ position:"absolute", width:p.w, height:p.w * 0.5, background:p.c, borderRadius:2 }}
        />
      ))}
    </div>
  );
}

// ─── Share sheet (bottom sheet on phones, centered card on desktop) ──────────
function ShareSheet({ url, name, onClose, onCopied, onSave }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const enc = encodeURIComponent;

  async function doCopy() {
    try { await navigator.clipboard.writeText(url); }
    catch (_) {
      const el=document.createElement("textarea"); el.value=url;
      el.style.cssText="position:fixed;opacity:0;"; document.body.appendChild(el);
      el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); onCopied && onCopied("Link copied");
    setTimeout(()=>setCopied(false),2200);
  }

  const opts = [
    {l:"Copy Link", ic:"fas fa-copy",          bg:"#0a0a0a",fg:"#d7ff3f",fn:doCopy},
    {l:"QR Code",   ic:"fas fa-qrcode",        bg:"#f3f3f0",fg:"#0a0a0a",fn:()=>setShowQr(v=>!v)},
    {l:"Save Contact", ic:"fas fa-address-card", bg:"#f3f3f0",fg:"#0a0a0a",fn:()=>{ onSave && onSave(); onClose(); }},
    {l:"WhatsApp",  ic:"fab fa-whatsapp",       bg:"#f2fdf5",fg:"#25D366",fn:()=>window.open(`https://wa.me/?text=${enc("Visit "+name+"'s Profile: "+url)}`)},
    {l:"Instagram", ic:"fab fa-instagram",      bg:"#fef2f5",fg:"#E4405F",fn:()=>window.open(`https://www.instagram.com/?url=${enc(url)}`)},
    {l:"Snapchat",  ic:"fab fa-snapchat",       bg:"#fffce8",fg:"#c9a800",fn:()=>window.open(`https://www.snapchat.com/scan?attachmentUrl=${enc(url)}`)},
    {l:"Telegram",  ic:"fab fa-telegram",       bg:"#eef8fd",fg:"#26A5E4",fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc("Visit "+name+"'s Profile!")}`)},
    {l:"Twitter",   ic:"fab fa-x-twitter",      bg:"#f3f3f0",fg:"#0a0a0a",fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc("Visit "+name+"'s Profile! "+url)}`)},
    {l:"Facebook",  ic:"fab fa-facebook-f",     bg:"#eef4ff",fg:"#1877F2",fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`)},
    {l:"LinkedIn",  ic:"fab fa-linkedin-in",    bg:"#e8f3fc",fg:"#0A66C2",fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}&summary=${enc("Visit "+name+"'s Profile!")}`)},
    {l:"Reddit",    ic:"fab fa-reddit-alien",   bg:"#fff2ed",fg:"#FF4500",fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}&title=${enc("Visit "+name+"'s Profile!")}`)},
    {l:"Email",     ic:"fas fa-envelope",       bg:"#fef2f2",fg:"#EA4335",fn:()=>window.open(`mailto:?subject=${enc("Visit "+name+"'s Profile!")}&body=${enc("Visit "+name+"'s Profile: "+url)}`)},
    {l:"SMS",       ic:"fas fa-comment-sms",    bg:"#f0fdf4",fg:"#10b981",fn:()=>window.open(`sms:?body=${enc("Visit "+name+"'s Profile: "+url)}`)},
  ];

  return (
    <motion.div
      className="sheet-wrap"
      onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="sheet"
        onClick={e=>e.stopPropagation()}
        initial={{ y: 80, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        role="dialog" aria-label="Share profile"
      >
        <div className="sheet-grab"><div/></div>
        <div className="sheet-head">
          <div style={{minWidth:0}}>
            <div className="sheet-title">Share</div>
            <div className="sheet-url">{url}</div>
          </div>
          <motion.button whileTap={{ scale: 0.88 }} whileHover={{ rotate: 90 }} onClick={onClose} className="sheet-x" aria-label="Close">×</motion.button>
        </div>

        <AnimatePresence initial={false}>
          {showQr && (
            <motion.div
              key="qr"
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div className="qr-box">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${enc(url)}`}
                  alt={`QR code for ${name}'s profile`} width={170} height={170}
                />
                <span>Scan to open {name}'s profile</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="sheet-grid">
          {opts.map((o,i)=>(
            <motion.button
              key={o.l} onClick={o.fn}
              initial="hidden" animate="visible" custom={i} variants={popSpring}
              whileHover={{ y: -3 }} whileTap={{ scale: 0.93 }}
              className="sheet-opt"
            >
              <div className="sheet-ic" style={{background:o.bg,color:o.fg}}>
                {o.l==="Copy Link"&&copied?<i className="fas fa-check" style={{color:"#d7ff3f"}}/>:<i className={o.ic}/>}
                {o.l==="Copy Link"&&<AnimatePresence>{copied&&<SparkleBurst/>}</AnimatePresence>}
              </div>
              <span>{o.l==="Copy Link"&&copied?"Copied!":o.l}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────
export default function ProfilePage({ user, pageUrl, avatarUrl, siteUrl, robotsContent, isIndexable }) {
  const [shareOpen,    setShareOpen]    = useState(false);
  const [spOpen,       setSpOpen]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [showBirthday, setShowBirthday] = useState(false);
  const [isBirthday,   setIsBirthday]   = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [viewCount,    setViewCount]    = useState(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [showTop,      setShowTop]      = useState(false);
  const [query,        setQuery]        = useState("");
  const [toast,        setToast]        = useState("");
  const contentRef = useRef(null);
  const heroRef    = useRef(null);
  const searchRef  = useRef(null);
  const reduce     = useReducedMotion();

  // ── Cursor spotlight (desktop only) ──
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const smx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${smx}px ${smy}px, var(--spot), transparent 70%)`;

  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const mv = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", mv, { passive: true });
    return () => window.removeEventListener("mousemove", mv);
  }, []);

  useEffect(() => { document.body.style.background = "#fafaf7"; }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  // ── View tracking + live animated counter ──
  useEffect(()=>{
    if (!user?.username) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, event: "view" }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const n = d?.views ?? d?.count ?? d?.viewCount ?? null;
        if (typeof n === "number") setViewCount(n);
      })
      .catch(() => {});
  },[]);

  // ── Birthday check ──
  useEffect(() => {
    if (!user?.dob) return;
    const t = new Date();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    if (user.dob.slice(5, 10) === `${mm}-${dd}`) {
      setIsBirthday(true);
    }
  }, [user?.dob]);

  // ── Hero parallax ──
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallaxY     = useTransform(heroProgress, [0, 1], [0, 90]);
  const heroParallaxScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroParallaxFade  = useTransform(heroProgress, [0, 1], [1, 0.35]);

  useMotionValueEvent(heroProgress, "change", (latest) => {
    setStickyVisible(latest > 0.82);
  });

  const { scrollYProgress: pageProgress } = useScroll();
  const progressSmooth = useSpring(pageProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  useMotionValueEvent(pageProgress, "change", (v) => setShowTop(v > 0.2));

  // ── Reveal below-the-fold content once scrolled into view ──
  useEffect(() => {
    if (!contentRef.current || contentRevealed) return;
    const el = contentRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) { setContentRevealed(true); io.disconnect(); }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [contentRef, contentRevealed]);

  // ── Preload avatar + link icons, then lift the splash ──
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
      if (!img.complete) pending.push(new Promise(res => { img.onload = res; img.onerror = res; }));
    }

    (user.links || []).forEach(lnk => {
      if (lnk.icon?.startsWith("https://")) {
        const img = new Image();
        img.src = lnk.icon;
        if (!img.complete) pending.push(new Promise(res => { img.onload = res; img.onerror = res; }));
      }
    });

    const fontReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([fontReady, ...pending]).then(() => { clearTimeout(safety); done(); });

    return () => clearTimeout(safety);
  }, [user]);

  // ── Native share on phones, custom sheet everywhere else ──
  const openShare = useCallback(() => {
    if (!user) return;
    track(user.username, "share");
    const isTouch = window.matchMedia("(pointer:coarse)").matches;
    if (isTouch && navigator.share) {
      navigator.share({ title: `${user.name} on Linkitin`, text: `Visit ${user.name}'s profile`, url: pageUrl })
        .catch(() => {});
    } else {
      setShareOpen(true);
    }
  }, [user, pageUrl]);

  // ── Keyboard shortcuts (desktop): S share · T theme · / search links ──
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") { setShareOpen(false); return; }
      if (e.key === "s" || e.key === "S") { e.preventDefault(); setShareOpen(true); if (user) track(user.username, "share"); }
      else if (e.key === "/") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [user]);

  // ── SEO helpers ──
  const userAge   = user ? calcAge(user.dob) : null;
  const socials   = user ? Object.entries(user.socialProfiles||{}).filter(([,v])=>v?.trim()).filter(([k])=>PLAT[k]) : [];
  const interests = user ? Object.values(user.interests||{}).flat().filter(v=>v&&typeof v==="string").slice(0,12) : [];
  const marqueeItems = useMemo(() => {
    if (!user) return [];
    return Object.entries(user.interests || {})
      .filter(([k]) => k !== "role")
      .flatMap(([, v]) => (Array.isArray(v) ? v : [v]))
      .filter(v => v && typeof v === "string")
      .map(prettyLabel)
      .slice(0, 12);
  }, [user]);
  const bio       = user ? (user.aboutme||user.bio||"") : "";
  const badge     = user?.interests?.role;
  const badgeIcon = badge && BADGE_ICONS[badge];
  const badgeLabel= badge ? badge.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase()) : null;
  const origin    = siteUrl || (pageUrl ? pageUrl.split("/").slice(0,3).join("/") : "https://linkitin.site");
  const websiteId = `${origin}/#website`;
  const orgId     = `${origin}/#organization`;

  const richDescFull = user
    ? [
        badgeLabel ? `${user.name} — ${badgeLabel}.` : null,
        bio ? bio : null,
        !bio ? `Explore ${user.name}'s links, social profiles and online presence on Linkitin.` : (socials.length ? `Find ${user.name} on ${socials.slice(0,3).map(([k])=>PLAT[k].n).join(", ")}.` : null),
      ].filter(Boolean).join(" ")
    : "Profile not found on Linkitin";

  const richDesc = user ? truncate(richDescFull, 155) : richDescFull;
  const ptitle   = user ? truncate(`${user.name} — Links, Socials & Profile | Linkitin`, 60) : "Profile Not Found | Linkitin";
  const keywords = user
    ? [
        user.name, user.username, "linkitin",
        badgeLabel, "link in bio", "profile",
        ...socials.map(([k])=>PLAT[k].n),
        ...interests.slice(0,6),
      ].filter(Boolean).join(", ")
    : "linkitin, profile";

  const sameAsUrls = socials.map(([k,v]) => PLAT[k].u(v)).filter(u => !u.startsWith("mailto:"));

  const jsonLd = (user && isIndexable) ? [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      "name": "Linkitin",
      "url": origin,
      "description": "Create your free link-in-bio profile on Linkitin",
      "publisher": { "@id": orgId },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${origin}/{search_term_string}` },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": orgId,
      "name": "Linkitin",
      "url": origin,
      "logo": `${origin}/icon.png`
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${pageUrl}#profilepage`,
      "name": `${user.name}'s Profile`,
      "url": pageUrl,
      "description": richDesc,
      "dateModified": new Date().toISOString(),
      "isPartOf": { "@id": websiteId },
      "publisher": { "@id": orgId },
      "breadcrumb": { "@id": `${pageUrl}#breadcrumb` },
      "mainEntity": { "@id": `${pageUrl}#person` }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Linkitin", "item": origin },
        { "@type": "ListItem", "position": 2, "name": user.name, "item": pageUrl }
      ]
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
      "subjectOf": { "@id": websiteId },
    }
  ] : null;

  // ── Not-found screen ──
  if (!user) {
    return (
      <>
        <Head>
          <title>Profile Not Found | Linkitin</title>
          <link rel="icon" href="/icon.png" type="image/png" />
          <meta name="robots" content="noindex, nofollow"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Sora',sans-serif;background:#fafaf7;color:#0a0a0a;min-height:100vh;display:flex;align-items:center;justify-content:center;}`}</style>
        </Head>
        <main style={{textAlign:"center",padding:32}}>
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            style={{width:80,height:80,borderRadius:"50%",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32,color:"#d7ff3f"}}>
            <i className="fas fa-user-slash"/>
          </motion.div>
          <h1 style={{fontSize:22,fontWeight:900,marginBottom:8,color:"#0a0a0a",textTransform:"uppercase"}}>Profile Not Found</h1>
          <p style={{color:"#6b6b60",marginBottom:28}}>This username doesn't exist yet.</p>
          <a href="/create" style={{background:"#0a0a0a",color:"#d7ff3f",padding:"14px 30px",borderRadius:14,fontWeight:800,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none",textTransform:"uppercase",letterSpacing:".03em"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
          <div style={{marginTop:40,fontSize:12,color:"#b0b0a0",fontWeight:600}}>
            Developed by <strong style={{color:"#6b6b60"}}>Samartha Gs</strong>
          </div>
        </main>
      </>
    );
  }

  const links = user.links || [];
  const filteredLinks = query.trim()
    ? links.filter(l => `${l.title} ${hostOf(l.url)}`.toLowerCase().includes(query.trim().toLowerCase()))
    : links;
  const showSearch = links.length > 5;
  const ready = !loading;

  return (
    <div className="page">
      <Head>
        {/* ── Primary SEO ── */}
        <title>{ptitle}</title>
        <meta name="description"    content={richDesc}/>
        <meta name="keywords"       content={keywords}/>
        <meta name="author"         content={user.name}/>
        <meta name="robots"         content={robotsContent}/>
        <meta name="googlebot"      content={robotsContent}/>
        <link rel="canonical"       href={pageUrl}/>

        {/* ── Viewport / Theme / PWA hints ── */}
        <meta name="viewport"           content="width=device-width,initial-scale=1,viewport-fit=cover"/>
        <meta name="theme-color"        content="#fafaf7"/>
        <meta name="color-scheme"       content="light"/>
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
        <meta property="og:image"             content={avatarUrl || `${origin}/og-image.png`}/>
        <meta property="og:image:secure_url"  content={avatarUrl || `${origin}/og-image.png`}/>
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
        <meta name="twitter:image"       content={avatarUrl || `${origin}/og-image.png`}/>
        <meta name="twitter:image:alt"   content={`${user.name}'s profile photo`}/>
        {user.socialProfiles?.twitter &&
          <meta name="twitter:creator" content={`@${user.socialProfiles.twitter.replace("@","")}`}/>}

        <meta property="article:author" content={pageUrl}/>

        {/* ── JSON-LD Structured Data (only when indexable) ── */}
        {jsonLd && jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
          />
        ))}

        {/* ── Resource hints ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com"/>
        {user.avatar && <link rel="preload" as="image" href={user.avatar} fetchpriority="high"/>}
        <link rel="dns-prefetch" href="https://open.spotify.com"/>

        {/* ── Fonts & Icons ── */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:wght@500;700&family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html{scroll-behavior:smooth;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;font-family:inherit;}
          a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid var(--fg);outline-offset:3px;}
          body{background:#fafaf7;font-family:'Sora',sans-serif;overflow-x:hidden;}
          ::selection{background:#d7ff3f;color:#0a0a0a;}

          /* ── Theme tokens ── */
          .page{
            --accent:#d7ff3f;
            --bg:#fafaf7; --fg:#0a0a0a; --muted:#6b6b60; --soft:#2e2e28;
            --card:#fff; --card-2:#f3f3ea; --border:rgba(10,10,10,.10); --border-strong:rgba(10,10,10,.28);
            --chip:#0a0a0a; --chip-fg:#d7ff3f; --glass:rgba(255,255,255,.62);
            --spot:rgba(215,255,63,.20); --blob-a:rgba(215,255,63,.55); --blob-b:rgba(120,200,255,.30); --blob-c:rgba(255,150,190,.22);
            --shadow:0 1px 3px rgba(10,10,10,.05); --shadow-lg:0 18px 40px rgba(10,10,10,.12);
            --dots:rgba(10,10,10,.045); --fade:var(--bg); --img-dim:.84;
            position:relative;min-height:100vh;background:var(--bg);color:var(--fg);
            transition:background .45s ease,color .45s ease;
          }

          .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}

          /* ── Background layers ── */
          .bg-layer{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
          .blob{position:absolute;border-radius:50%;filter:blur(70px);will-change:transform;}
          .bg-dots{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(var(--dots) 1px,transparent 1px);background-size:22px 22px;}
          .bg-spot{position:fixed;inset:0;z-index:0;pointer-events:none;}
          @media(hover:none),(pointer:coarse){.bg-spot{display:none;}}

          .scroll-progress{position:fixed;top:0;left:0;right:0;height:3px;background:var(--fg);transform-origin:0% 50%;z-index:120;}

          /* ── Sticky mini-header (phones/tablets) ── */
          .sticky-head{
            position:fixed;top:0;left:0;right:0;z-index:90;display:flex;align-items:center;gap:11px;
            padding:calc(10px + env(safe-area-inset-top,0px)) 16px 10px;
            background:var(--glass);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);
            border-bottom:1.5px solid var(--border);
          }
          .sticky-head-av{width:34px;height:34px;border-radius:50%;object-fit:cover;border:1.5px solid var(--border);flex-shrink:0;}
          .sticky-head-name{font-size:14px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
          .round-btn{
            width:44px;height:44px;border-radius:50%;background:var(--glass);
            -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
            border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;
            font-size:16px;color:var(--fg);cursor:pointer;box-shadow:var(--shadow);
          }
          .round-btn.sm{width:32px;height:32px;font-size:13px;background:var(--chip);color:var(--chip-fg);border:none;flex-shrink:0;}
          .top-actions{position:fixed;top:calc(16px + env(safe-area-inset-top,0px));right:16px;z-index:100;display:flex;gap:10px;align-items:center;}

          /* ── Layout shell ── */
          .shell{position:relative;z-index:1;max-width:560px;margin:0 auto;}
          .profile-col{display:flex;flex-direction:column;align-items:stretch;}

          /* Hero */
          .hero{position:relative;width:100%;height:54vh;min-height:300px;max-height:460px;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 58%,rgba(0,0,0,.55) 78%,transparent 100%);mask-image:linear-gradient(to bottom,#000 0%,#000 58%,rgba(0,0,0,.55) 78%,transparent 100%);}
          .hero-img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;position:relative;z-index:1;filter:brightness(var(--img-dim));}
          .hero-fade{display:none;position:absolute;inset:0;pointer-events:none;z-index:2;background:linear-gradient(to bottom,transparent 0%,transparent 48%,color-mix(in srgb,var(--fade) 30%,transparent) 68%,color-mix(in srgb,var(--fade) 80%,transparent) 88%,var(--fade) 100%);}
          .hero-ph{width:100%;height:46vh;min-height:260px;max-height:400px;display:flex;align-items:center;justify-content:center;position:relative;}
          .av-ph{width:120px;height:120px;border-radius:50%;background:var(--chip);display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:900;color:var(--chip-fg);box-shadow:0 0 0 8px var(--card-2);}

          .id-block{text-align:center;padding:0 20px;position:relative;z-index:3;margin-top:-36px;}
          .pname{font-size:clamp(34px,10vw,54px);font-family:'Archivo Black','Sora',sans-serif;font-weight:400;letter-spacing:-.015em;line-height:1.02;margin-bottom:14px;text-transform:uppercase;overflow-wrap:anywhere;}
          .sw{display:inline-block;white-space:nowrap;overflow:hidden;padding:.06em .02em .1em;vertical-align:top;margin-right:.28em;}
          .sw.free{overflow:visible;}
          .sc{cursor:default;}
          .sw:last-child{margin-right:0;}
          .sc{display:inline-block;will-change:transform;}

          .badge-row{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
          .pill{display:inline-flex;align-items:center;gap:6px;background:var(--card);border:1.5px solid var(--border-strong);border-radius:999px;padding:6px 13px;font-size:12px;font-weight:700;user-select:none;}
          .pill i{font-size:10px;opacity:.7;}
          .pill.click{cursor:pointer;transition:background .25s,transform .22s cubic-bezier(.34,1.56,.64,1);}
          .pill.click:hover{background:var(--card-2);}
          .pill.click:active{transform:scale(.94);}
          .pill.mono{font-family:'JetBrains Mono',monospace;font-weight:700;}
          .badge-pill{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:6px;background:var(--chip);border-radius:999px;padding:6px 14px 6px 11px;font-size:12px;font-weight:800;color:var(--chip-fg);letter-spacing:.04em;text-transform:uppercase;}
          .badge-pill i{font-size:10px;}
          .badge-pill::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);transform:translateX(-120%);animation:sheen 3.6s 1.4s ease-in-out infinite;}
          @keyframes sheen{0%{transform:translateX(-120%);}40%,100%{transform:translateX(120%);}}
          .agePop{animation:agePop .28s cubic-bezier(.34,1.56,.64,1) both;}
          @keyframes agePop{from{opacity:0;transform:translateY(-3px) scale(.92);}to{opacity:1;transform:translateY(0) scale(1);}}

          .bio-text{font-size:15px;line-height:1.7;color:var(--soft);text-align:center;max-width:46ch;margin:0 auto;}

          .bday-banner{margin:16px auto 0;display:inline-flex;align-items:center;gap:8px;background:var(--chip);color:var(--chip-fg);padding:8px 16px;border-radius:999px;font-size:12.5px;font-weight:800;}

          /* Action buttons */
          .actions{display:flex;gap:10px;justify-content:center;margin-top:20px;}
          .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 20px;border-radius:14px;font-size:13px;font-weight:800;cursor:pointer;border:1.5px solid transparent;letter-spacing:.01em;}
          .btn-primary{background:var(--chip);color:var(--chip-fg);}
          .btn-ghost{background:var(--card);color:var(--fg);border-color:var(--border-strong);}

          /* Content column */
          .content{padding:26px 16px 72px;}
          .section-head{display:flex;align-items:center;gap:10px;margin:2px 2px 12px;}
          .section-title{font-family:'Archivo Black','Sora',sans-serif;font-size:15px;letter-spacing:.01em;text-transform:uppercase;}
          .section-count{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;background:var(--card-2);border:1px solid var(--border);border-radius:999px;padding:2px 9px;color:var(--muted);}
          .section-line{flex:1;height:1.5px;background:var(--border);border-radius:2px;}

          .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px;}
          .stat{background:var(--card);border:1.5px solid var(--border);border-radius:18px;padding:12px 10px;text-align:center;box-shadow:var(--shadow);}
          .stat b{display:block;font-family:'Archivo Black','Sora',sans-serif;font-size:22px;font-weight:400;line-height:1.1;}
          .stat span{display:block;font-size:11px;font-weight:600;color:var(--muted);margin-top:3px;}

          .soc-row{display:flex;justify-content:center;flex-wrap:wrap;gap:9px;margin-bottom:22px;}
          .soc-btn{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;background:var(--card);border:1.5px solid var(--border);box-shadow:var(--shadow);position:relative;}

          .marquee{overflow:hidden;margin:0 -16px 22px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);}
          .marquee-track{display:flex;gap:10px;width:max-content;animation:marq 32s linear infinite;padding:2px 0;}
          .marquee:hover .marquee-track{animation-play-state:paused;}
          .marquee-chip{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;background:var(--card);border:1.5px solid var(--border);border-radius:999px;padding:7px 14px;font-size:12.5px;font-weight:600;}
          .marquee-chip i{font-size:10px;color:var(--muted);}
          @keyframes marq{to{transform:translateX(-50%);}}

          /* Link search */
          .search{display:flex;align-items:center;gap:10px;background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:0 14px;margin-bottom:12px;transition:border-color .2s,box-shadow .2s;}
          .search:focus-within{border-color:var(--fg);box-shadow:0 0 0 4px var(--spot);}
          .search i{font-size:13px;color:var(--muted);}
          .search input{flex:1;min-width:0;background:transparent;border:none;outline:none!important;color:var(--fg);font-size:14px;font-family:inherit;padding:13px 0;}
          .search kbd{display:none;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;border:1.5px solid var(--border-strong);border-radius:6px;padding:1px 7px;color:var(--muted);}
          .empty{text-align:center;color:var(--muted);font-size:13.5px;padding:26px 10px;}

          /* Link cards */
          .links{display:flex;flex-direction:column;gap:10px;margin-bottom:22px;}
          .lbtn{
            position:relative;overflow:hidden;display:flex;align-items:center;width:100%;padding:12px 14px;
            background:var(--card);border:1.5px solid var(--border);border-radius:20px;cursor:pointer;box-shadow:var(--shadow);
            --mx:50%;--my:50%;transition:border-color .25s,box-shadow .3s;
          }
          .lbtn-glow{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .3s;background:radial-gradient(220px circle at var(--mx) var(--my),var(--spot),transparent 70%);}
          .lbtn:hover{border-color:var(--border-strong);box-shadow:var(--shadow-lg);}
          .lbtn:hover .lbtn-glow{opacity:1;}
          .lbtn-ic{position:relative;width:50px;height:50px;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:22px;background:var(--card-2);border:1.5px solid var(--border);flex-shrink:0;}
          .lbtn-body{position:relative;flex:1;min-width:0;padding:0 12px;}
          .lbtn-t{font-size:14.5px;font-weight:700;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
          .lbtn-h{font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:500;color:var(--muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
          .lbtn-a{position:relative;width:30px;height:30px;border-radius:50%;background:var(--card-2);display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1),background .25s,color .25s;}
          .lbtn:hover .lbtn-a{background:var(--chip);color:var(--chip-fg);transform:translate(2px,-2px) rotate(8deg);}

          /* Spotify */
          .sp-block{margin-bottom:22px;}
          .sp-card{background:var(--card);border:1.5px solid var(--border);border-radius:22px;overflow:hidden;cursor:pointer;box-shadow:var(--shadow);}
          .sp-trig{display:flex;align-items:center;gap:13px;padding:14px 16px;}
          .sp-trig.open{border-bottom:1.5px solid var(--border);}
          .sp-art{width:50px;height:50px;border-radius:12px;background:var(--chip);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--chip-fg);flex-shrink:0;}
          .sp-meta{flex:1;min-width:0;}
          .sp-eye{font-size:11px;font-weight:700;color:var(--muted);margin-bottom:4px;display:flex;align-items:center;gap:8px;}
          .eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px;}
          .eq i{display:block;width:3px;background:var(--fg);border-radius:2px;height:4px;}
          .eq.on i{animation:eq 0.9s ease-in-out infinite;}
          .eq.on i:nth-child(2){animation-delay:.15s;}
          .eq.on i:nth-child(3){animation-delay:.3s;}
          .eq.on i:nth-child(4){animation-delay:.45s;}
          @keyframes eq{0%,100%{height:3px;}50%{height:12px;}}
          .sp-title{font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3;}
          .sp-artist{font-size:12px;color:var(--muted);margin-top:2px;}
          .sp-play-btn{width:36px;height:36px;border-radius:50%;background:var(--chip);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--chip-fg);flex-shrink:0;}
          .sp-embed{overflow:hidden;background:var(--card);padding:10px 10px 0;}

          .foot{text-align:center;padding:10px 0 4px;}
          .foot-cta{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--fg);font-weight:800;border:1.5px solid var(--border-strong);border-radius:999px;padding:10px 18px;transition:background .25s,color .25s;}
          .foot-cta:hover{background:var(--chip);color:var(--chip-fg);}
          .foot-attrib{font-size:11px;color:var(--muted);font-weight:600;margin-top:12px;}
          .foot-attrib a{text-decoration:underline;text-underline-offset:2px;}
          .hints{display:none;justify-content:center;gap:16px;margin-top:14px;font-size:11px;color:var(--muted);font-weight:600;}
          .hints kbd{font-family:'JetBrains Mono',monospace;font-size:10.5px;border:1.5px solid var(--border-strong);border-radius:6px;padding:1px 6px;margin-right:5px;}

          .name-line{display:block;height:6px;width:70px;margin:0 auto 16px;border-radius:6px;background:var(--accent);box-shadow:0 0 0 1.5px var(--fg);transform-origin:center;}
          .lbtn.featured{background:linear-gradient(135deg,#fff 0%,#f6ffd2 100%);border-color:var(--border-strong);padding:16px 16px;}
          .lbtn.featured .lbtn-ic{width:58px;height:58px;}
          .lbtn-tag{display:inline-block;font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:var(--chip);color:var(--chip-fg);border-radius:999px;padding:2px 8px;margin-bottom:5px;}
          @media(hover:hover){
            .soc-btn::after{content:attr(data-label);position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(-50%,4px);background:var(--chip);color:var(--chip-fg);font-size:11px;font-weight:700;padding:4px 9px;border-radius:8px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;}
            .soc-btn:hover::after{opacity:1;transform:translate(-50%,0);}
          }
          .to-top{position:fixed;right:16px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:95;width:44px;height:44px;border-radius:50%;background:var(--chip);color:var(--chip-fg);border:none;display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;box-shadow:var(--shadow-lg);}
          .foot{text-align:center;padding:4px 0 0;}
          .foot-cta{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:700;color:var(--soft);background:var(--card);border:1.5px solid var(--border);border-radius:999px;padding:6px 6px 6px 13px;box-shadow:var(--shadow);transition:border-color .25s,box-shadow .25s;}
          .foot-cta i{font-size:11px;}
          .foot-cta b{background:var(--chip);color:var(--chip-fg);border-radius:999px;padding:3px 9px;font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;}
          .foot-cta:hover{background:var(--card);color:var(--fg);border-color:var(--border-strong);box-shadow:var(--shadow-lg);}

          /* Toast */
          .toast{position:fixed;left:50%;bottom:calc(28px + env(safe-area-inset-bottom,0px));z-index:1200;background:var(--chip);color:var(--chip-fg);font-size:13px;font-weight:800;padding:11px 20px;border-radius:999px;display:flex;align-items:center;gap:8px;box-shadow:var(--shadow-lg);}

          /* Share sheet */
          .sheet-wrap{position:fixed;inset:0;background:rgba(10,10,10,.55);z-index:1000;display:flex;align-items:flex-end;justify-content:center;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);}
          .sheet{background:#fafaf7;color:#0a0a0a;border:2px solid #0a0a0a;border-bottom:none;border-radius:26px 26px 0 0;width:100%;max-width:520px;padding-bottom:calc(36px + env(safe-area-inset-bottom,0px));max-height:92vh;overflow-y:auto;}
          .sheet-grab{display:flex;justify-content:center;padding:14px 0 8px;}
          .sheet-grab div{width:40px;height:4px;border-radius:2px;background:#0a0a0a;opacity:.2;}
          .sheet-head{padding:8px 20px 14px;border-bottom:1.5px solid #eae8dd;display:flex;align-items:center;justify-content:space-between;gap:12px;}
          .sheet-title{font-weight:900;font-size:15px;text-transform:uppercase;letter-spacing:.02em;}
          .sheet-url{font-size:11px;color:#6b6b60;margin-top:2px;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
          .sheet-x{width:34px;height:34px;border-radius:50%;background:#0a0a0a;border:none;font-size:18px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
          .sheet-grid{padding:14px 10px 0;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;}
          .sheet-opt{display:flex;flex-direction:column;align-items:center;gap:6px;width:72px;padding:10px 4px;border:none;background:transparent;cursor:pointer;border-radius:14px;}
          .sheet-opt span{font-size:10.5px;font-weight:700;color:#0a0a0a;text-align:center;line-height:1.2;}
          .sheet-ic{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;border:1.5px solid rgba(10,10,10,.08);position:relative;}
          .qr-box{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 0 6px;font-size:12px;font-weight:600;color:#6b6b60;}
          .qr-box img{border-radius:16px;border:1.5px solid #eae8dd;background:#fff;}

          /* ── Phones ── */
          @media(max-width:420px){
            .content{padding:22px 14px 56px;}
            .lbtn{border-radius:16px;}
            .soc-btn{width:44px;height:44px;font-size:17px;border-radius:12px;}
            .btn{padding:12px 16px;}
          }

          /* ── Tablet ── */
          @media(min-width:601px){
            .shell{max-width:640px;}
            .hero{height:52vh;}
            .bio-text{font-size:16px;}
            .content{padding:26px 24px 84px;}
          }

          /* ── Laptop / desktop: two-column layout, sticky profile card ── */
          @media(min-width:1024px){
            .shell{max-width:1180px;display:grid;grid-template-columns:420px minmax(0,1fr);gap:44px;padding:44px 36px 40px;align-items:start;}
            .profile-col{position:sticky;top:36px;background:var(--card);border:1.5px solid var(--border);border-radius:36px;overflow:hidden;padding-bottom:30px;box-shadow:var(--shadow-lg);--fade:var(--card);}
            .hero{height:440px;max-height:none;min-height:0;}
            .hero-img{border-radius:0;}
            .hero-ph{height:300px;}
            .id-block{margin-top:-34px;padding:0 28px;}
            .pname{font-size:clamp(36px,3.4vw,48px);}
            .sticky-head{display:none;}
            .content{padding:6px 0 80px;max-width:none;}
            .stats{grid-template-columns:repeat(3,1fr);}
            .marquee{margin:0 0 22px;}
            .search kbd{display:inline-block;}
            .links{gap:12px;}
            .lbtn{padding:14px 18px;border-radius:22px;}
            .lbtn-ic{width:56px;height:56px;}
            .lbtn-t{font-size:15.5px;}
            .hints{display:flex;}
            .sheet-wrap{align-items:center;}
            .sheet{border-radius:28px;border-bottom:2px solid #0a0a0a;padding-bottom:28px;}
          }
          @media(min-width:1440px){
            .shell{max-width:1320px;grid-template-columns:460px minmax(0,1fr);gap:56px;}
            .hero{height:480px;}
          }

          @media(prefers-reduced-motion:reduce){
            .marquee-track,.badge-pill::after,.eq.on i{animation:none!important;}
            html{scroll-behavior:auto;}
          }
        `}</style>
      </Head>

      {/* ── LOADING SPLASH ── */}
      <LoadingScreen visible={loading} />

      {/* ── Background: animated aurora + dots + cursor spotlight ── */}
      <div className="bg-layer" aria-hidden="true">
        {[
          { c:"var(--blob-a)", s:420, t:"-8%",  l:"-10%", dx:[0,80,-30,0],  dy:[0,60,100,0],   d:22 },
          { c:"var(--blob-b)", s:380, t:"30%",  l:"68%",  dx:[0,-90,40,0],  dy:[0,-50,70,0],   d:26 },
          { c:"var(--blob-c)", s:340, t:"72%",  l:"8%",   dx:[0,60,-60,0],  dy:[0,-80,-20,0],  d:30 },
        ].map((b, i) => (
          <motion.div
            key={i}
            className="blob"
            style={{ width:b.s, height:b.s, top:b.t, left:b.l, background:b.c }}
            animate={reduce ? undefined : { x: b.dx, y: b.dy, scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="bg-dots" aria-hidden="true" />
      <motion.div className="bg-spot" style={{ background: spotlight }} aria-hidden="true" />

      {/* ── Scroll progress bar ── */}
      <motion.div className="scroll-progress" style={{ scaleX: progressSmooth }} />

      {/* ── Sticky mini-header (phones/tablets) ── */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            className="sticky-head"
            initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -70, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {user.avatar
              ? <img src={user.avatar} alt="" className="sticky-head-av" />
              : <div className="sticky-head-av" style={{background:"var(--chip)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--chip-fg)",fontWeight:800,fontSize:13}}>{user.name?.charAt(0)?.toUpperCase()||"?"}</div>}
            <span className="sticky-head-name">{user.name}</span>
            <motion.button className="round-btn sm" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }} onClick={openShare} aria-label="Share">
              <i className="fas fa-arrow-up-from-bracket"/>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating controls: theme + share ── */}
      <motion.div
        className="top-actions"
        initial={{ opacity: 0, scale: 0.6 }} animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.5 }}
      >
        <Magnetic strength={0.3}>
          <motion.button className="round-btn" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.88 }} onClick={openShare} aria-label="Share" title="Share (S)">
            <i className="fas fa-arrow-up-from-bracket"/>
          </motion.button>
        </Magnetic>
      </motion.div>

      <main id="profile-main" className="shell">
        <nav aria-label="Breadcrumb" className="sr-only">
          <a href={origin}>Home</a> › <span aria-current="page">{user.name}</span>
        </nav>

        {/* ── PROFILE COLUMN — photo, name, badges, bio, actions ── */}
        <header className="profile-col" ref={heroRef}>
          {user.avatar ? (
            <motion.div className="hero" style={{ opacity: heroParallaxFade }}>
              <motion.img
                src={user.avatar}
                alt={`${user.name} profile photo`}
                className="hero-img"
                fetchpriority="high"
                initial={{ scale: 1.14 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ y: heroParallaxY, scale: heroParallaxScale }}
              />
              <div className="hero-fade"/>
            </motion.div>
          ) : (
            <div className="hero-ph">
              <motion.div
                className="av-ph"
                initial={{ scale: 0.5, opacity: 0 }} animate={ready ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
              >
                {user.name?.charAt(0)?.toUpperCase()||"?"}
              </motion.div>
            </div>
          )}

          <div className="id-block">
            <h1 className="pname" aria-label={user.name}>
              <SplitName text={user.name} start={ready} />
            </h1>
            <motion.span
              className="name-line" aria-hidden="true"
              initial={{ scaleX: 0, opacity: 0 }} animate={ready ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ delay: 0.95, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />

            <div className="badge-row">
              {userAge && user.dob && (
                <motion.span initial="hidden" animate={ready ? "visible" : "hidden"} custom={1} variants={popSpring}>
                  <span
                    key={showBirthday ? "bday" : "age"}
                    className="pill click agePop"
                    role="button" tabIndex={0}
                    onClick={() => setShowBirthday(v => !v)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShowBirthday(v => !v); } }}
                    title={showBirthday ? "Show age" : "Show birthday"}
                  >
                    <i className={showBirthday ? "fas fa-calendar-day" : "fas fa-user"}/>
                    {showBirthday
                      ? new Date(user.dob + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : `${userAge} y/o`}
                  </span>
                </motion.span>
              )}
              {badgeLabel && (
                <motion.span initial="hidden" animate={ready ? "visible" : "hidden"} custom={2} variants={popSpring}>
                  <span className="badge-pill">
                    {badgeIcon && <i className={badgeIcon}/>}
                    {badgeLabel}
                  </span>
                </motion.span>
              )}
              {/* Itin score — compact, tap for the full tier breakdown */}
              <ItinScoreBadge username={user.username} />
            </div>

            {bio && (
              <motion.p
                className="bio-text"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {bio}
              </motion.p>
            )}

            {isBirthday && (
              <motion.div
                className="bday-banner"
                initial={{ opacity: 0, scale: 0.6 }} animate={ready ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.9 }}
              >
                <span aria-hidden="true">🎂</span> It's {user.name}'s birthday today
              </motion.div>
            )}

          </div>
        </header>

        {/* ── CONTENT COLUMN — stats, socials, interests, links, music ── */}
        <div className="content" ref={contentRef}>
          <article>

            {socials.length > 0 && (
              <section className="soc-row" aria-label={`${user.name}'s social profiles`}>
                {socials.map(([pl,val],idx)=>{
                  const m=PLAT[pl];
                  return(
                    <motion.a
                      key={pl} href={m.u(val)} target="_blank" rel="me noopener noreferrer"
                      className="soc-btn" data-label={m.n} aria-label={`${user.name} on ${m.n}`}
                      style={{ color: m.c === "#ccc" ? "var(--fg)" : m.c }}
                      initial="hidden" animate={contentRevealed ? "visible" : "hidden"} custom={idx + 1} variants={popSpring}
                      whileHover={{ y: -4, scale: 1.1, rotate: -4, borderColor: "rgba(128,128,128,.6)" }}
                      whileTap={{ scale: 0.92 }}
                      onClick={()=>track(user.username, `social_${pl}`)}>
                      <i className={m.i}/>
                    </motion.a>
                  );
                })}
              </section>
            )}

            <Marquee items={marqueeItems} />

            {links.length > 0 && (
              <section aria-label={`${user.name}'s links`}>
                <div className="section-head">
                  <span className="section-title">Links</span>
                  <span className="section-count">{filteredLinks.length}</span>
                  <span className="section-line" />
                </div>

                {showSearch && (
                  <div className="search">
                    <i className="fas fa-magnifying-glass" aria-hidden="true"/>
                    <input
                      ref={searchRef} type="search" value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search links" aria-label="Search links"
                    />
                    <kbd>/</kbd>
                  </div>
                )}

                <div className="links">
                  <AnimatePresence mode="popLayout">
                    {filteredLinks.map((lnk,i)=>(
                      <TiltLink
                        key={lnk.id||lnk.url||i}
                        href={lnk.url}
                        ariaLabel={lnk.title}
                        featured={i === 0 && !query.trim() && filteredLinks.length > 1}
                        index={{ animate: contentRevealed ? "visible" : "hidden", i }}
                        onClick={()=>track(user.username,"link_click")}
                      >
                        <div className="lbtn-ic">
                          {(lnk.icon?.startsWith("https://") || lnk.icon?.startsWith("data:"))
                            ? <img src={lnk.icon} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} alt="" loading="lazy"/>
                            : lnk.icon?.startsWith("fas ") || lnk.icon?.startsWith("fab ")
                              ? <i className={lnk.icon}/>
                              : <span style={{fontSize:20}}>{lnk.icon||"🔗"}</span>}
                        </div>
                        <div className="lbtn-body">
                          {i === 0 && !query.trim() && filteredLinks.length > 1 && <span className="lbtn-tag">Featured</span>}
                          <div className="lbtn-t">{lnk.title}</div>
                          {hostOf(lnk.url) && <div className="lbtn-h">{hostOf(lnk.url)}</div>}
                        </div>
                        <div className="lbtn-a"><i className="fas fa-arrow-up-right"/></div>
                      </TiltLink>
                    ))}
                  </AnimatePresence>
                  {filteredLinks.length === 0 && (
                    <p className="empty">No links match "{query}". Clear the search to see all links.</p>
                  )}
                </div>
              </section>
            )}

            {user.favSongTrackId && (
              <motion.div
                className="sp-block"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <motion.div className="sp-card" whileHover={{ y: -2 }}>
                  <div
                    className={`sp-trig${spOpen?" open":""}`}
                    onClick={()=>{setSpOpen(v=>!v);if(!spOpen)track(user.username,"spotify_play");}}
                  >
                    <div className="sp-art"><i className="fas fa-music"/></div>
                    <div className="sp-meta">
                      <div className="sp-eye">
                        <span className={`eq${spOpen?" on":""}`} aria-hidden="true"><i/><i/><i/><i/></span>
                        Favourite one
                      </div>
                      <div className="sp-title">{user.favSong||"My Favourite Song"}</div>
                      {user.favArtist&&<div className="sp-artist">{user.favArtist}</div>}
                    </div>
                    <motion.div className="sp-play-btn" whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.1 }}>
                      <i className={spOpen?"fas fa-chevron-up":"fas fa-play"} style={{marginLeft:spOpen?0:2}}/>
                    </motion.div>
                  </div>
                  <AnimatePresence initial={false}>
                    {spOpen&&(
                      <motion.div
                        className="sp-embed"
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <iframe
                          src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0&autoplay=1`}
                          width="100%" height="380" frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy" style={{display:"block",width:"100%",maxWidth:"100%"}}
                          title={`${user.favSong || "Favourite Song"} by ${user.favArtist || "Artist"}`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </article>

          <motion.footer
            className="foot"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <motion.a href="/" className="foot-cta" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <i className="fas fa-wand-magic-sparkles"/> Create your profile <b>Free</b>
            </motion.a>
            <div className="hints" aria-hidden="true">
              <span><kbd>S</kbd>Share</span>
              {showSearch && <span><kbd>/</kbd>Search</span>}
            </div>
          </motion.footer>
        </div>
      </main>

      {/* ── Birthday confetti (once, shortly after the splash) ── */}
      {isBirthday && ready && !reduce && <Confetti />}

      <AnimatePresence>
        {showTop && (
          <motion.button
            className="to-top" aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ y: -3 }} whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          >
            <i className="fas fa-arrow-up"/>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast" role="status"
            initial={{ opacity: 0, y: 30, x: "-50%", scale: 0.9 }} animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }} exit={{ opacity: 0, y: 20, x: "-50%", scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <i className="fas fa-circle-check" style={{ color: "var(--chip-fg)" }}/> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareOpen && <ShareSheet url={pageUrl} name={user.name} onClose={()=>setShareOpen(false)} onCopied={showToast} onSave={()=>{ downloadVCard(user, pageUrl); track(user.username, "save_contact"); showToast("Contact saved"); }}/>}
      </AnimatePresence>
    </div>
  );
}

// ─── SSR ──────────────────────────────────────────────────────────────────────
export async function getServerSideProps({ params, req, res }) {
  const host    = req.headers.host || "linkitin.site";
  const proto   = host.startsWith("localhost") ? "http" : "https";
  const base    = `${proto}://${host}`;
  const usernameParam = String(params.username || "").toLowerCase();
  const pageUrl = `${base}/${usernameParam}`;

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const raw    = await db.collection("users").findOne(
      { username: usernameParam },
      { projection: { _id: 0 } }
    );

    if (!raw) {
      // Nonexistent username: real HTTP 404 so search engines never index it
      if (res) res.statusCode = 404;
      return { props: { user: null, pageUrl, avatarUrl: `${base}/api/avatar/${usernameParam}`, siteUrl: base, robotsContent: "noindex, nofollow", isIndexable: false } };
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

    const avatarUrl = safeAvatar || `${base}/api/avatar/${usernameParam}`;

    // ── Indexability logic ────────────────────────────────────────────────
    const statusStr   = raw.status ? String(raw.status).toLowerCase() : "";
    const isDeleted    = !!raw.deleted || statusStr === "deleted";
    const isSuspended  = !!raw.suspended || statusStr === "suspended" || statusStr === "banned";
    const isPrivate    = !!raw.isPrivate || !!raw.private || raw.public === false || statusStr === "private";
    const hasAnyContent = !!(raw.name) && (
      !!(raw.bio || raw.aboutme) ||
      (Array.isArray(raw.links) && raw.links.length > 0) ||
      (raw.socialProfiles && Object.values(raw.socialProfiles).some(v => v && String(v).trim()))
    );

    const isIndexable = !isDeleted && !isSuspended && !isPrivate && hasAnyContent;

    if (isDeleted && res) res.statusCode = 410; // Gone
    const robotsContent = isIndexable
      ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      : "noindex, nofollow";

    return {
      props: {
        pageUrl,
        avatarUrl,
        siteUrl: base,
        robotsContent,
        isIndexable,
        user: JSON.parse(JSON.stringify({
          username:       raw.username       || usernameParam,
          name:           raw.name           || raw.username || usernameParam,
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
    if (res) res.statusCode = 500;
    return { props: { user: null, pageUrl, avatarUrl: `${base}/api/avatar/${usernameParam}`, siteUrl: base, robotsContent: "noindex, nofollow", isIndexable: false } };
  }
}
