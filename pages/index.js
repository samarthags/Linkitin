import { useState, useRef, useCallback, useEffect } from "react";

/* ─────────────────────────────────────────────
   Module-level flag so the DOM injection runs
   EXACTLY ONCE across all re-renders, but only
   ever in the browser (never during SSR), which
   fixes both the Vercel "document is not defined"
   build error AND the mobile keyboard closing bug.
───────────────────────────────────────────── */
let _booted = false;

const CSS_CONTENT = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; background: #f0f2f5; color: #111827; }

      /* Kill ALL blue outlines and tap flash */
      * { -webkit-tap-highlight-color: transparent; }
      *:focus { outline: none !important; }
      button::-moz-focus-inner { border: 0; }
      input:focus, textarea:focus, select:focus {
        border-color: #4F6EF7 !important;
        box-shadow: 0 0 0 3px rgba(79,110,247,0.14) !important;
      }

      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #f0f0f0; }
      ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .fade-up { animation: fadeUp 0.28s cubic-bezier(.22,.68,0,1.15) both; }

      /* ── Inputs ── */
      .dp-input {
        width: 100%; padding: 11px 14px;
        background: #fff; border: 1.5px solid #e5e7eb;
        border-radius: 10px; color: #111827;
        font-family: 'Inter', sans-serif; font-size: 14px;
        transition: border-color .16s, box-shadow .16s;
      }
      .dp-input::placeholder { color: #adb5bd; }
      .dp-input:hover:not(:focus) { border-color: #c5cbf6; }

      /* ── Tag pills ── */
      .dp-tag {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 6px 13px; border-radius: 999px;
        border: 1.5px solid #e5e7eb;
        background: #fff; color: #6b7280;
        font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
        cursor: pointer; transition: all .15s ease;
        user-select: none;
      }
      .dp-tag:hover { border-color: #4F6EF7; color: #4F6EF7; background: #f0f3ff; }
      .dp-tag:active { transform: scale(0.95); }
      .dp-tag.on { background: #4F6EF7; border-color: #4F6EF7; color: #fff; }

      /* ── Buttons ── */
      .dp-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        padding: 12px 20px; border-radius: 10px; border: none;
        font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
        cursor: pointer; transition: background .15s, transform .1s, box-shadow .15s;
        user-select: none; white-space: nowrap;
      }
      .dp-btn:active { transform: scale(0.96) !important; box-shadow: none !important; }
      .dp-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

      .dp-btn-primary   { background: #4F6EF7; color: #fff; }
      .dp-btn-primary:hover   { background: #3d5fe8; box-shadow: 0 4px 16px rgba(79,110,247,0.28); transform: translateY(-1px); }
      .dp-btn-secondary { background: #fff; color: #374151; border: 1.5px solid #e5e7eb; }
      .dp-btn-secondary:hover { background: #f9fafb; transform: translateY(-1px); }
      .dp-btn-teal      { background: #0ea5e9; color: #fff; }
      .dp-btn-teal:hover      { background: #0284c7; box-shadow: 0 4px 16px rgba(14,165,233,0.28); transform: translateY(-1px); }
      .dp-btn-ghost     { background: transparent; color: #6b7280; border: 1.5px solid #e5e7eb; }
      .dp-btn-ghost:hover     { background: #f9fafb; color: #374151; }
      .dp-btn-danger    { background: transparent; color: #ef4444; border: 1.5px solid #fca5a5; padding: 7px 12px; font-size: 13px; }
      .dp-btn-danger:hover    { background: #fef2f2; border-color: #ef4444; }

      /* ── Social card ── */
      .dp-social-card {
        display: flex; align-items: center; gap: 10px;
        padding: 12px 14px; background: #fff;
        border: 1.5px solid #e5e7eb; border-radius: 10px;
        transition: border-color .15s, box-shadow .15s;
      }
      .dp-social-card:focus-within {
        border-color: #4F6EF7;
        box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
      }
      .dp-social-card input {
        flex: 1; border: none; background: transparent;
        font-family: 'Inter', sans-serif; font-size: 13.5px; color: #111827;
      }
      .dp-social-card input::placeholder { color: #adb5bd; }

      /* ── Link row ── */
      .dp-link-row {
        display: flex; align-items: center; gap: 10px;
        padding: 12px 14px; background: #fff;
        border: 1.5px solid #e5e7eb; border-radius: 10px;
        transition: border-color .15s, box-shadow .15s;
      }
      .dp-link-row:hover { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(79,110,247,0.07); }

      /* ── Card ── */
      .dp-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 20px 20px; }

      /* ── Section label ── */
      .dp-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }

      /* ── Step dots ── */
      .dp-step-dot {
        width: 30px; height: 30px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700; font-family: 'Inter', sans-serif;
        border: 2px solid #e5e7eb; background: #fff; color: #9ca3af;
        transition: all 0.22s ease;
      }
      .dp-step-dot.done   { background: #10b981; border-color: #10b981; color: #fff; }
      .dp-step-dot.active { background: #4F6EF7; border-color: #4F6EF7; color: #fff; box-shadow: 0 0 0 4px rgba(79,110,247,0.16); }
      .dp-step-lbl { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #adb5bd; white-space: nowrap; }
      .dp-step-lbl.active { color: #4F6EF7; }
      .dp-step-lbl.done   { color: #10b981; }

      /* ── Preview ── */
      .dp-preview { background: linear-gradient(145deg,#f8faff,#eef2ff); border: 1.5px solid #c7d2fe; border-radius: 16px; padding: 26px 20px; text-align: center; }
      .dp-preview.dark-prev { background: linear-gradient(145deg,#1a1c2e,#13141f); border-color: #2d3050; }
      .dp-prev-link { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; background: #fff; border-radius: 10px; border: 1.5px solid #e5e7eb; font-size: 14px; font-weight: 500; }
      .dp-prev-link.dark { background: #1e2140; border-color: #2d3050; color: #e2e8f0; }

      /* ── Misc ── */
      .dp-charcount { font-size: 11px; color: #adb5bd; text-align: right; margin-top: 4px; }
      .dp-charcount.warn { color: #f59e0b; }
      .dp-charcount.over { color: #ef4444; }
      .dp-hint { font-size: 12px; color: #6b7280; margin-top: 5px; display: flex; align-items: center; gap: 5px; }
      .dp-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; background: #d1fae5; color: #065f46; font-size: 11px; font-weight: 600; }

      .dp-footer { text-align: center; padding: 24px 16px 16px; font-size: 13px; color: #9ca3af; }
      .dp-footer a { color: #4F6EF7; text-decoration: none; font-weight: 600; }
      .dp-footer a:hover { text-decoration: underline; }

      .dp-topbar { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 11px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
`;

function bootStyles() {
  if (_booted) return;
  _booted = true;
  const FONT_LINKS = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800&family=JetBrains+Mono:wght@400;600&display=swap",
  ];
  FONT_LINKS.forEach((href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    }
  });
  if (!document.getElementById("devpro-global-css")) {
    const s = document.createElement("style");
    s.id = "devpro-global-css";
    s.textContent = CSS_CONTENT;
    document.head.appendChild(s);
  }
}

/* ─── Data constants ─── */
const SOCIAL_META = {
  email:         { icon: "fas fa-envelope",       color: "#EA4335", bg: "#fef2f2" },
  github:        { icon: "fab fa-github",          color: "#24292e", bg: "#f6f8fa" },
  twitter:       { icon: "fab fa-x-twitter",       color: "#111",    bg: "#f5f5f5" },
  linkedin:      { icon: "fab fa-linkedin-in",     color: "#0A66C2", bg: "#e8f3fc" },
  instagram:     { icon: "fab fa-instagram",       color: "#E4405F", bg: "#fdf2f4" },
  discord:       { icon: "fab fa-discord",         color: "#5865F2", bg: "#eef0ff" },
  youtube:       { icon: "fab fa-youtube",         color: "#FF0000", bg: "#fff2f2" },
  tiktok:        { icon: "fab fa-tiktok",          color: "#010101", bg: "#f5f5f5" },
  twitch:        { icon: "fab fa-twitch",          color: "#9146FF", bg: "#f3eeff" },
  spotify:       { icon: "fab fa-spotify",         color: "#1DB954", bg: "#edfaf3" },
  telegram:      { icon: "fab fa-telegram",        color: "#26A5E4", bg: "#edf7fd" },
  whatsapp:      { icon: "fab fa-whatsapp",        color: "#25D366", bg: "#edfaf3" },
  reddit:        { icon: "fab fa-reddit-alien",    color: "#FF4500", bg: "#fff2ed" },
  facebook:      { icon: "fab fa-facebook-f",      color: "#1877F2", bg: "#eef4ff" },
  snapchat:      { icon: "fab fa-snapchat",        color: "#d4b800", bg: "#fffce8" },
  medium:        { icon: "fab fa-medium",          color: "#333",    bg: "#f5f5f5" },
  devto:         { icon: "fab fa-dev",             color: "#0a0a0a", bg: "#f5f5f5" },
  codepen:       { icon: "fab fa-codepen",         color: "#111",    bg: "#f5f5f5" },
  stackoverflow: { icon: "fab fa-stack-overflow",  color: "#F58025", bg: "#fff4ed" },
  npm:           { icon: "fab fa-npm",             color: "#CC3534", bg: "#fff0f0" },
  behance:       { icon: "fab fa-behance",         color: "#1769FF", bg: "#eef2ff" },
  dribbble:      { icon: "fab fa-dribbble",        color: "#ea4c89", bg: "#fdf0f5" },
};

const ROLE_ICONS = {
  student: "fas fa-graduation-cap", developer: "fas fa-code",
  designer: "fas fa-pen-nib", creator: "fas fa-camera",
  gamer: "fas fa-gamepad", traveler: "fas fa-plane",
  athlete: "fas fa-person-running", artist: "fas fa-palette",
  musician: "fas fa-music", entrepreneur: "fas fa-briefcase",
  writer: "fas fa-feather-alt", other: "fas fa-star",
};

const STEPS = ["Basic", "Interests", "Social", "Links", "Review"];

const LINK_ICONS = [
  "fas fa-link","fas fa-globe","fas fa-briefcase","fas fa-folder","fas fa-star",
  "fas fa-heart","fas fa-rocket","fas fa-bolt","fas fa-book","fas fa-video",
  "fas fa-microphone","fas fa-store","fas fa-graduation-cap","fas fa-code",
  "fas fa-pen-nib","fas fa-camera","fas fa-music","fas fa-gamepad","fas fa-trophy",
];

/* ─── Main component ─── */
export default function DevProfileCreator() {
  // Boot styles once, safely in the browser only (fixes SSR/Vercel build error)
  useEffect(() => { bootStyles(); }, []);

  const [step, setStep]               = useState(1);
  const [uploading, setUploading]     = useState(false);
  const [dragOver, setDragOver]       = useState(false);
  const [generating, setGenerating]   = useState(false);
  const [submitLoading, setSubmit]    = useState(false);
  const [generatedBio, setGenBio]     = useState("");
  const [bioEdited, setBioEdited]     = useState(false);
  const [showIconPicker, setIconPick] = useState(false);
  const [previewTheme, setPrevTheme]  = useState("light");
  const [newLink, setNewLink]         = useState({ title: "", url: "", icon: "fas fa-link" });
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    username: "", name: "", dob: "", location: "", bio: "", website: "",
    avatar: "", socialProfiles: {}, links: [],
    interests: { role: "", hobbies: [], music: [], gaming: [], passions: [], skills: [] },
  });

  /* ── Options ── */
  const roles = [
    { v: "student", l: "Student" },      { v: "developer", l: "Developer" },
    { v: "designer", l: "Designer" },    { v: "creator", l: "Creator" },
    { v: "gamer", l: "Gamer" },          { v: "traveler", l: "Traveler" },
    { v: "athlete", l: "Athlete" },      { v: "artist", l: "Artist" },
    { v: "musician", l: "Musician" },    { v: "entrepreneur", l: "Entrepreneur" },
    { v: "writer", l: "Writer" },        { v: "other", l: "Other" },
  ];
  const hobbies  = ["Reading","Gaming","Coding","Drawing","Photography","Traveling","Cooking","Sports","Music","Dancing","Writing","Hiking","Swimming","Yoga","Meditation","Gardening","Streaming","Podcasting"];
  const music    = ["Pop","Rock","Hip Hop","Electronic","Jazz","Classical","R&B","Country","Metal","Indie","Latin","K-Pop","Folk","Ambient","Lo-fi","Phonk"];
  const games    = ["Minecraft","Fortnite","Valorant","League of Legends","GTA V","Call of Duty","Apex Legends","Among Us","Roblox","Mario","Zelda","Pokemon","Elden Ring","Skyrim","The Witcher","CS2","Dota 2"];
  const passions = ["Technology","Art","Music","Education","Environment","Social Justice","Health","Fitness","Animals","Space","Science","History","Philosophy","Open Source","AI / ML","Startups"];
  const skills   = ["JavaScript","TypeScript","Python","React","Next.js","Node.js","Rust","Go","Swift","Kotlin","UI/UX","Figma","Video Editing","Photography","Writing","DevOps","Blockchain","Data Science","Cybersecurity","3D / Blender"];

  const socials = [
    { n:"email",         l:"Email",          p:"your@email.com" },
    { n:"github",        l:"GitHub",          p:"username" },
    { n:"twitter",       l:"Twitter / X",     p:"@username" },
    { n:"linkedin",      l:"LinkedIn",        p:"username" },
    { n:"instagram",     l:"Instagram",       p:"@username" },
    { n:"discord",       l:"Discord",         p:"user#0000" },
    { n:"youtube",       l:"YouTube",         p:"@channel" },
    { n:"tiktok",        l:"TikTok",          p:"@username" },
    { n:"twitch",        l:"Twitch",          p:"username" },
    { n:"spotify",       l:"Spotify",         p:"username" },
    { n:"telegram",      l:"Telegram",        p:"@username" },
    { n:"whatsapp",      l:"WhatsApp",        p:"+1234567890" },
    { n:"reddit",        l:"Reddit",          p:"u/username" },
    { n:"facebook",      l:"Facebook",        p:"username" },
    { n:"snapchat",      l:"Snapchat",        p:"username" },
    { n:"medium",        l:"Medium",          p:"@username" },
    { n:"devto",         l:"DEV.to",          p:"username" },
    { n:"codepen",       l:"CodePen",         p:"username" },
    { n:"stackoverflow", l:"Stack Overflow",  p:"user ID" },
    { n:"npm",           l:"npm",             p:"~username" },
    { n:"behance",       l:"Behance",         p:"username" },
    { n:"dribbble",      l:"Dribbble",        p:"username" },
  ];

  /* ── Computed ── */
  const filledSocials = Object.entries(form.socialProfiles).filter(([, v]) => v?.trim());
  const totalTags     = Object.values(form.interests).flat().filter(Boolean).length;
  const score = Math.min(100, Math.round(
    [form.username, form.name, form.avatar, form.dob, form.location].filter(Boolean).length * 6 +
    Math.min(totalTags, 10) * 3 +
    Math.min(filledSocials.length, 5) * 4 +
    Math.min(form.links.length, 3) * 5 +
    (generatedBio || form.bio ? 5 : 0)
  ));

  /* ── Handlers — stable so React never remounts inputs ── */
  const setField    = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);
  const setInterest = useCallback((k, v) => setForm(p => ({ ...p, interests: { ...p.interests, [k]: v } })), []);
  const toggleTag   = useCallback((cat, val) =>
    setForm(p => { const c = p.interests[cat]; return { ...p, interests: { ...p.interests, [cat]: c.includes(val) ? c.filter(x=>x!==val) : [...c, val] } }; }), []);
  const setSocial   = useCallback((n, v) => setForm(p => ({ ...p, socialProfiles: { ...p.socialProfiles, [n]: v } })), []);

  const processImg = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const r = new FileReader();
    r.onload  = e => { setForm(p => ({ ...p, avatar: e.target.result })); setUploading(false); };
    r.onerror = () => setUploading(false);
    r.readAsDataURL(file);
  }, []);

  const handleFile = e => processImg(e.target.files[0]);
  const handleDrop = e => { e.preventDefault(); setDragOver(false); processImg(e.dataTransfer.files[0]); };

  const addLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    const url = /^https?:\/\//.test(newLink.url) ? newLink.url : `https://${newLink.url}`;
    setForm(p => ({ ...p, links: [...p.links, { ...newLink, url, id: Date.now() }] }));
    setNewLink({ title: "", url: "", icon: "fas fa-link" });
    setIconPick(false);
  };

  const removeLink  = id  => setForm(p => ({ ...p, links: p.links.filter(l => l.id !== id) }));
  const moveLink    = (i, dir) => setForm(p => {
    const ls = [...p.links]; const j = i + dir;
    if (j < 0 || j >= ls.length) return p;
    [ls[i], ls[j]] = [ls[j], ls[i]];
    return { ...p, links: ls };
  });

  const generateBio = async () => {
    setGenerating(true);
    try {
      const res  = await fetch("/api/generate-bio", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ interests: form.interests, name: form.name }) });
      const data = await res.json();
      setGenBio(data.bio); setBioEdited(false);
    } catch {
      const tags = [...form.interests.hobbies, ...form.interests.skills, ...form.interests.passions].slice(0,4);
      setGenBio(`${form.name || "Hey"} — ${form.interests.role || "creator"}${tags.length ? ` passionate about ${tags.join(", ")}` : ""}. Always building, always learning.`);
      setBioEdited(false);
    } finally { setGenerating(false); }
  };

  const handleSubmit = async () => {
    setSubmit(true);
    try {
      const res  = await fetch("/api/create", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ ...form, aboutme: generatedBio || form.bio }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Something went wrong");
    } catch { alert("Failed to create profile."); }
    finally { setSubmit(false); }
  };

  /* ── Small helpers ── */
  const Lbl = ({ children, req }) => (
    <div className="dp-label">{children}{req && <span style={{color:"#ef4444",marginLeft:3}}>*</span>}</div>
  );
  const Hint = ({ icon="fas fa-info-circle", children }) => (
    <div className="dp-hint"><i className={icon} style={{color:"#4F6EF7",fontSize:11}}/>{children}</div>
  );
  const SectionHead = ({ icon, title, sub }) => (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:9,background:"#eef2ff",color:"#4F6EF7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
          <i className={icon}/>
        </div>
        <div>
          <h2 style={{fontSize:19,fontWeight:800,color:"#111827",lineHeight:1.1}}>{title}</h2>
          {sub && <p style={{fontSize:12,color:"#6b7280",marginTop:3}}>{sub}</p>}
        </div>
      </div>
    </div>
  );
  const TagGrid = ({ items, cat }) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
      {items.map(item => {
        const on = form.interests[cat].includes(item);
        return (
          <button key={item} type="button" className={`dp-tag ${on?"on":""}`}
            onClick={() => toggleTag(cat, item)}>
            {on && <i className="fas fa-check" style={{fontSize:9}}/>}
            {item}
          </button>
        );
      })}
    </div>
  );
  const NavRow = ({ canGo = true }) => (
    <div style={{display:"flex",gap:10,marginTop:28}}>
      {step > 1 && (
        <button type="button" className="dp-btn dp-btn-secondary" style={{flex:1}} onClick={() => setStep(s=>s-1)}>
          <i className="fas fa-arrow-left" style={{fontSize:12}}/> Back
        </button>
      )}
      {step < 5 && (
        <button type="button" className="dp-btn dp-btn-primary" style={{flex:2}} onClick={() => setStep(s=>s+1)} disabled={!canGo}>
          Continue <i className="fas fa-arrow-right" style={{fontSize:12}}/>
        </button>
      )}
    </div>
  );

  /* ── Render ── */
  return (
    <div style={{minHeight:"100vh",background:"#f0f2f5",paddingBottom:40}}>

      {/* Top bar */}
      <div className="dp-topbar">
        <a href="https://mywebsam.site/" target="_blank" rel="noreferrer"
          style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
          <div style={{width:28,height:28,borderRadius:7,background:"#4F6EF7",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="fas fa-link" style={{color:"#fff",fontSize:12}}/>
          </div>
          <span style={{fontWeight:800,fontSize:15,color:"#111827",letterSpacing:"-0.01em"}}>mywebsam</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>Profile {score}%</span>
          <div style={{width:72,height:5,background:"#e5e7eb",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${score}%`,height:"100%",background:score>=80?"#10b981":"#4F6EF7",borderRadius:99,transition:"width 0.4s ease"}}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"24px 14px 12px"}}>

        {/* Step progress */}
        <div style={{display:"flex",alignItems:"center",marginBottom:24}}>
          {STEPS.map((label,i) => {
            const s = i+1;
            const state = step>s?"done":step===s?"active":"idle";
            return (
              <div key={s} style={{display:"flex",alignItems:"center",flex:s<5?1:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div className={`dp-step-dot ${state}`}>
                    {state==="done" ? <i className="fas fa-check" style={{fontSize:10}}/> : s}
                  </div>
                  <span className={`dp-step-lbl ${state}`}>{label}</span>
                </div>
                {s<5 && <div style={{flex:1,height:2,background:step>s?"#10b981":"#e5e7eb",margin:"0 4px",marginBottom:18,borderRadius:1,transition:"background 0.3s"}}/>}
              </div>
            );
          })}
        </div>

        {/* ═══════════════ STEP 1 — Basic Info ═══════════════ */}
        {step===1 && (
          <div className="fade-up">
            <div className="dp-card" style={{marginBottom:12}}>
              <SectionHead icon="fas fa-user" title="Basic Info" sub="Start with the essentials — who are you?" />

              <div style={{marginBottom:14}}>
                <Lbl req>Username</Lbl>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#adb5bd",fontSize:14,pointerEvents:"none",fontFamily:"JetBrains Mono,monospace"}}>@</span>
                  <input className="dp-input" style={{paddingLeft:28}}
                    placeholder="johndoe" value={form.username}
                    onChange={e => setField("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,""))}
                  />
                </div>
                {form.username && (
                  <Hint icon="fas fa-globe">
                    mywebsam.site/<strong style={{color:"#4F6EF7"}}>{form.username}</strong>
                  </Hint>
                )}
              </div>

              <div style={{marginBottom:14}}>
                <Lbl req>Full Name</Lbl>
                <input className="dp-input" placeholder="John Doe" value={form.name}
                  onChange={e => setField("name", e.target.value)}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <Lbl>Date of Birth</Lbl>
                  <input className="dp-input" type="date" value={form.dob}
                    onChange={e => setField("dob", e.target.value)}/>
                </div>
                <div>
                  <Lbl>Location</Lbl>
                  <input className="dp-input" placeholder="New York, USA" value={form.location}
                    onChange={e => setField("location", e.target.value)}/>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <Lbl>Personal Website</Lbl>
                <input className="dp-input" placeholder="https://yoursite.com" value={form.website}
                  onChange={e => setField("website", e.target.value)}/>
              </div>

              <div>
                <Lbl>Short Bio <span style={{color:"#adb5bd",fontWeight:400,textTransform:"none",fontSize:11}}>(or generate with AI in step 2)</span></Lbl>
                <textarea className="dp-input" rows={3}
                  placeholder="Write something short about yourself..."
                  value={form.bio}
                  onChange={e => setField("bio", e.target.value)}
                  style={{resize:"vertical",lineHeight:1.6}}
                />
                <div className={`dp-charcount ${form.bio.length>180?"over":form.bio.length>140?"warn":""}`}>{form.bio.length}/200</div>
              </div>
            </div>

            {/* Avatar */}
            <div className="dp-card">
              <Lbl>Profile Picture</Lbl>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{display:"flex",alignItems:"center",gap:16,padding:16,borderRadius:12,cursor:"pointer",border:`2px dashed ${dragOver?"#4F6EF7":form.avatar?"#4F6EF7":"#e5e7eb"}`,background:dragOver?"#f0f3ff":form.avatar?"#f8f9ff":"#fafafa",transition:"all .2s"}}
              >
                {form.avatar ? (
                  <>
                    <img src={form.avatar} alt="avatar"
                      style={{width:68,height:68,borderRadius:"50%",objectFit:"cover",border:"2.5px solid #4F6EF7",flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,marginBottom:2}}>Photo uploaded</div>
                      <div style={{fontSize:13,color:"#6b7280"}}>Click to change</div>
                    </div>
                    <button type="button" className="dp-btn dp-btn-danger"
                      onClick={e => { e.stopPropagation(); setField("avatar",""); }}>
                      <i className="fas fa-trash"/>
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{width:68,height:68,borderRadius:"50%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"#9ca3af",flexShrink:0}}>
                      {uploading ? <i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/> : <i className="fas fa-camera"/>}
                    </div>
                    <div>
                      <div style={{fontWeight:600,marginBottom:2}}>{uploading?"Processing...":"Upload Photo"}</div>
                      <div style={{fontSize:13,color:"#6b7280"}}>Click or drag & drop · PNG, JPG, GIF, WebP</div>
                      <div style={{fontSize:11,color:"#adb5bd",marginTop:2}}>Saved locally — no server needed</div>
                    </div>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
            </div>

            <NavRow canGo={!!form.username && !!form.name}/>
          </div>
        )}

        {/* ═══════════════ STEP 2 — Interests ═══════════════ */}
        {step===2 && (
          <div className="fade-up">
            <div className="dp-card" style={{marginBottom:12}}>
              <SectionHead icon="fas fa-brain" title="Interests" sub="Select what applies to you — the more, the better your AI bio."/>

              <div style={{marginBottom:18}}>
                <Lbl>I am a...</Lbl>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
                  {roles.map(r => {
                    const on = form.interests.role===r.v;
                    return (
                      <button key={r.v} type="button"
                        className={`dp-tag ${on?"on":""}`}
                        style={{borderRadius:10,justifyContent:"flex-start"}}
                        onClick={() => setInterest("role", on?"":r.v)}>
                        <i className={ROLE_ICONS[r.v]} style={{width:13,textAlign:"center"}}/>
                        {r.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {[
                {cat:"hobbies",  label:"Hobbies",        items:hobbies},
                {cat:"music",    label:"Music Genres",    items:music},
                {cat:"gaming",   label:"Favorite Games",  items:games},
                {cat:"passions", label:"Passions",        items:passions},
                {cat:"skills",   label:"Skills & Tools",  items:skills},
              ].map(s => (
                <div key={s.cat} style={{marginBottom:18}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Lbl>{s.label}</Lbl>
                    {form.interests[s.cat].length>0 && (
                      <span style={{fontSize:11,color:"#4F6EF7",fontWeight:600}}>
                        {form.interests[s.cat].length} selected
                      </span>
                    )}
                  </div>
                  <TagGrid items={s.items} cat={s.cat}/>
                </div>
              ))}
            </div>

            {/* AI Bio */}
            <div className="dp-card">
              <Lbl>AI Bio Generator</Lbl>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:12}}>
                Pick your role and interests above, then generate a professional bio. You can edit it after.
              </p>
              <button type="button" className="dp-btn dp-btn-teal" style={{width:"100%"}}
                onClick={generateBio} disabled={generating}>
                {generating
                  ? <><i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/> Generating...</>
                  : <><i className="fas fa-wand-magic-sparkles"/> Generate AI Bio</>}
              </button>

              {generatedBio && (
                <div style={{marginTop:14,borderTop:"1px solid #f3f4f6",paddingTop:14}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#10b981"}}>
                      <i className="fas fa-check-circle" style={{marginRight:5}}/>AI Generated
                    </span>
                    <button type="button"
                      style={{background:"none",border:"none",fontSize:12,color:"#4F6EF7",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:600,padding:0}}
                      onClick={generateBio} disabled={generating}>
                      <i className="fas fa-redo" style={{marginRight:4,fontSize:10}}/> Regenerate
                    </button>
                  </div>
                  <textarea className="dp-input" rows={3}
                    value={generatedBio}
                    onChange={e => { setGenBio(e.target.value); setBioEdited(true); }}
                    style={{resize:"vertical",lineHeight:1.6}}
                  />
                  {bioEdited && <Hint icon="fas fa-pencil">Edited — your version will be used.</Hint>}
                </div>
              )}
            </div>

            <NavRow/>
          </div>
        )}

        {/* ═══════════════ STEP 3 — Social ═══════════════ */}
        {step===3 && (
          <div className="fade-up">
            <div className="dp-card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <SectionHead icon="fas fa-share-nodes" title="Social Profiles"
                  sub="Only filled profiles will show on your page."/>
                {filledSocials.length>0 && (
                  <div className="dp-badge">
                    <i className="fas fa-check" style={{fontSize:9}}/>{filledSocials.length} connected
                  </div>
                )}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))",gap:8}}>
                {socials.map(p => {
                  const m = SOCIAL_META[p.n] || {icon:"fas fa-link",color:"#6b7280",bg:"#f9fafb"};
                  const val = form.socialProfiles[p.n] || "";
                  return (
                    <div key={p.n} className="dp-social-card">
                      <div style={{width:32,height:32,borderRadius:8,background:m.bg,color:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                        <i className={m.icon}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#adb5bd",letterSpacing:"0.05em",marginBottom:2}}>{p.l.toUpperCase()}</div>
                        <input placeholder={p.p} value={val} onChange={e => setSocial(p.n, e.target.value)}/>
                      </div>
                      {val && <i className="fas fa-circle-check" style={{color:"#10b981",fontSize:13}}/>}
                    </div>
                  );
                })}
              </div>
            </div>
            <NavRow/>
          </div>
        )}

        {/* ═══════════════ STEP 4 — Links ═══════════════ */}
        {step===4 && (
          <div className="fade-up">
            <div className="dp-card" style={{marginBottom:12}}>
              <SectionHead icon="fas fa-link" title="Custom Links" sub="Add portfolio, projects, blog — anything you want to share."/>

              {/* Add link */}
              <div style={{background:"#f9fafb",border:"1.5px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:18}}>
                <Lbl>New Link</Lbl>
                <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                  <input className="dp-input" style={{flex:"0 0 148px",minWidth:0}}
                    placeholder="Label" value={newLink.title}
                    onChange={e => setNewLink(p => ({...p, title:e.target.value}))}
                  />
                  <input className="dp-input" style={{flex:1,minWidth:140}}
                    placeholder="https://..." value={newLink.url}
                    onChange={e => setNewLink(p => ({...p, url:e.target.value}))}
                  />
                </div>

                {/* Icon picker */}
                <div style={{marginBottom:10}}>
                  <button type="button" className="dp-btn dp-btn-ghost" style={{fontSize:12,padding:"6px 12px"}}
                    onClick={() => setIconPick(v=>!v)}>
                    <i className={newLink.icon}/> Icon <i className={`fas fa-chevron-${showIconPicker?"up":"down"}`} style={{fontSize:10}}/>
                  </button>
                  {showIconPicker && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
                      {LINK_ICONS.map(ic => (
                        <button key={ic} type="button"
                          style={{width:34,height:34,borderRadius:8,border:`1.5px solid ${newLink.icon===ic?"#4F6EF7":"#e5e7eb"}`,background:newLink.icon===ic?"#eef2ff":"#fff",color:newLink.icon===ic?"#4F6EF7":"#6b7280",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}
                          onClick={() => { setNewLink(p=>({...p,icon:ic})); setIconPick(false); }}>
                          <i className={ic}/>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button type="button" className="dp-btn dp-btn-primary" style={{width:"100%"}} onClick={addLink}>
                  <i className="fas fa-plus"/> Add Link
                </button>
              </div>

              {form.links.length===0 ? (
                <div style={{textAlign:"center",padding:"28px 16px",color:"#adb5bd"}}>
                  <i className="fas fa-link" style={{fontSize:26,marginBottom:8,display:"block"}}/>
                  <div style={{fontSize:14}}>No links yet. Add one above.</div>
                </div>
              ) : (
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Lbl>Your Links ({form.links.length})</Lbl>
                    <span style={{fontSize:11,color:"#adb5bd"}}>Reorder with arrows</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {form.links.map((link,idx) => (
                      <div key={link.id} className="dp-link-row">
                        <div style={{display:"flex",flexDirection:"column",gap:1}}>
                          <button type="button" style={{background:"none",border:"none",cursor:idx===0?"default":"pointer",color:idx===0?"#e5e7eb":"#9ca3af",fontSize:10,padding:"2px 4px"}}
                            onClick={() => moveLink(idx,-1)}><i className="fas fa-chevron-up"/></button>
                          <button type="button" style={{background:"none",border:"none",cursor:idx===form.links.length-1?"default":"pointer",color:idx===form.links.length-1?"#e5e7eb":"#9ca3af",fontSize:10,padding:"2px 4px"}}
                            onClick={() => moveLink(idx,1)}><i className="fas fa-chevron-down"/></button>
                        </div>
                        <div style={{width:32,height:32,borderRadius:8,background:"#f0f3ff",color:"#4F6EF7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>
                          <i className={link.icon}/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14}}>{link.title}</div>
                          <div style={{fontSize:12,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link.url}</div>
                        </div>
                        <a href={link.url} target="_blank" rel="noreferrer"
                          style={{padding:"4px 8px",color:"#9ca3af",textDecoration:"none",fontSize:12}}
                          onClick={e=>e.stopPropagation()}>
                          <i className="fas fa-arrow-up-right-from-square"/>
                        </a>
                        <button type="button" className="dp-btn dp-btn-danger" onClick={() => removeLink(link.id)}>
                          <i className="fas fa-trash"/>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <NavRow/>
          </div>
        )}

        {/* ═══════════════ STEP 5 — Review ═══════════════ */}
        {step===5 && (
          <div className="fade-up">
            <div className="dp-card" style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
                <SectionHead icon="fas fa-eye" title="Review & Publish"/>
                <div style={{display:"flex",gap:6}}>
                  {["light","dark"].map(t => (
                    <button key={t} type="button"
                      style={{padding:"5px 12px",borderRadius:8,border:`1.5px solid ${previewTheme===t?"#4F6EF7":"#e5e7eb"}`,background:previewTheme===t?"#eef2ff":"#fff",color:previewTheme===t?"#4F6EF7":"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif"}}
                      onClick={() => setPrevTheme(t)}>
                      <i className={`fas fa-${t==="light"?"sun":"moon"}`} style={{marginRight:4,fontSize:10}}/>{t[0].toUpperCase()+t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live profile preview */}
              <div className={`dp-preview${previewTheme==="dark"?" dark-prev":""}`}>
                {form.avatar
                  ? <img src={form.avatar} alt="av" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:"2.5px solid #4F6EF7",marginBottom:12}}/>
                  : <div style={{width:80,height:80,borderRadius:"50%",background:previewTheme==="dark"?"#2d3050":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#9ca3af",margin:"0 auto 12px"}}>
                      <i className="fas fa-user"/>
                    </div>}
                <div style={{fontSize:20,fontWeight:800,color:previewTheme==="dark"?"#f1f5f9":"#111827",marginBottom:3}}>{form.name||"Your Name"}</div>
                <div style={{fontSize:12,color:"#4F6EF7",fontFamily:"JetBrains Mono,monospace",marginBottom:form.location?6:0}}>@{form.username||"username"}</div>
                {form.location && <div style={{fontSize:12,color:previewTheme==="dark"?"#94a3b8":"#6b7280",marginBottom:8}}><i className="fas fa-location-dot" style={{marginRight:4}}/>{form.location}</div>}
                {(generatedBio||form.bio) && <p style={{fontSize:13,color:previewTheme==="dark"?"#94a3b8":"#6b7280",lineHeight:1.7,maxWidth:360,margin:"0 auto 14px"}}>{generatedBio||form.bio}</p>}

                {filledSocials.length>0 && (
                  <div style={{display:"flex",justifyContent:"center",gap:9,marginBottom:16,flexWrap:"wrap"}}>
                    {filledSocials.map(([n]) => {
                      const m = SOCIAL_META[n]||{icon:"fas fa-link",color:"#6b7280",bg:"#f9fafb"};
                      return (
                        <div key={n} style={{width:34,height:34,borderRadius:8,background:previewTheme==="dark"?"rgba(255,255,255,0.07)":m.bg,color:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
                          <i className={m.icon}/>
                        </div>
                      );
                    })}
                  </div>
                )}

                {form.links.length>0 && (
                  <div style={{display:"flex",flexDirection:"column",gap:8,textAlign:"left"}}>
                    {form.links.map(link => (
                      <div key={link.id} className={`dp-prev-link${previewTheme==="dark"?" dark":""}`}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <i className={link.icon} style={{color:"#4F6EF7",fontSize:13}}/>
                          <span style={{fontWeight:500}}>{link.title}</span>
                        </div>
                        <i className="fas fa-arrow-right" style={{color:"#adb5bd",fontSize:11}}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
              {[
                {icon:"fas fa-share-nodes", label:"Socials",  val:filledSocials.length,      color:"#4F6EF7"},
                {icon:"fas fa-link",        label:"Links",    val:form.links.length,          color:"#0ea5e9"},
                {icon:"fas fa-tag",         label:"Interests",val:totalTags,                  color:"#8b5cf6"},
                {icon:"fas fa-chart-simple",label:"Score",    val:`${score}%`, color:score>=80?"#10b981":"#f59e0b"},
              ].map(s => (
                <div key={s.label} className="dp-card" style={{textAlign:"center",padding:"12px 8px"}}>
                  <i className={s.icon} style={{color:s.color,fontSize:17,marginBottom:5,display:"block"}}/>
                  <div style={{fontSize:19,fontWeight:800}}>{s.val}</div>
                  <div style={{fontSize:9,fontWeight:700,color:"#adb5bd",letterSpacing:"0.05em",textTransform:"uppercase"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div className="dp-card" style={{marginBottom:16}}>
              <Lbl>Profile Checklist</Lbl>
              <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:7}}>
                {[
                  {label:"Username set",                done:!!form.username},
                  {label:"Full name added",             done:!!form.name},
                  {label:"Profile photo uploaded",      done:!!form.avatar},
                  {label:"Location added",              done:!!form.location},
                  {label:"Role selected",               done:!!form.interests.role},
                  {label:"At least 3 interests",        done:totalTags>=3},
                  {label:"Social profile connected",    done:filledSocials.length>0},
                  {label:"Custom link added",           done:form.links.length>0},
                  {label:"Bio written or generated",    done:!!(generatedBio||form.bio)},
                ].map(item => (
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:9,fontSize:13,color:item.done?"#111827":"#9ca3af"}}>
                    <i className={item.done?"fas fa-circle-check":"far fa-circle"} style={{color:item.done?"#10b981":"#d1d5db",fontSize:14,flexShrink:0}}/>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:"flex",gap:10}}>
              <button type="button" className="dp-btn dp-btn-secondary" style={{flex:1}} onClick={() => setStep(4)}>
                <i className="fas fa-arrow-left" style={{fontSize:12}}/> Back
              </button>
              <button type="button" className="dp-btn dp-btn-primary" style={{flex:2}}
                onClick={handleSubmit} disabled={submitLoading || !form.username || !form.name}>
                {submitLoading
                  ? <><i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/> Publishing...</>
                  : <><i className="fas fa-rocket"/> Publish Profile</>}
              </button>
            </div>
            {(!form.username||!form.name) && (
              <div style={{marginTop:10,fontSize:13,color:"#ef4444",textAlign:"center"}}>
                <i className="fas fa-triangle-exclamation" style={{marginRight:5}}/>Username and name are required.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="dp-footer">
        Made with ❤️‍🔥 by{" "}
        <a href="https://mywebsam.site/" target="_blank" rel="noreferrer">Samartha GS</a>
        {" · "}
        <a href="https://mywebsam.site/" target="_blank" rel="noreferrer">mywebsam.site</a>
      </div>
    </div>
  );
}
