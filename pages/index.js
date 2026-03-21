import { useState, useRef, useEffect } from "react";

/* ── Font Awesome via CDN is injected once ── */
const FA_CDN = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
const INTER_CDN = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap";

function injectLink(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.href = href;
  document.head.appendChild(l);
}

/* ── Design tokens ── */
const T = {
  bg: "#0d0f14",
  surface: "#13161e",
  surfaceHover: "#1a1e2a",
  border: "#232738",
  borderAccent: "#2e3450",
  accent: "#6c63ff",
  accentGlow: "rgba(108,99,255,0.25)",
  accentHover: "#8077ff",
  green: "#22d3a0",
  greenGlow: "rgba(34,211,160,0.2)",
  red: "#f85149",
  text: "#e8eaf2",
  textMuted: "#6b7280",
  textDim: "#4b5563",
  radius: "10px",
  radiusLg: "16px",
};

/* ── Global CSS injected once ── */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { color-scheme: dark; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'Syne', sans-serif; }
  
  /* Kill ALL browser focus rings and blue outlines */
  *:focus { outline: none !important; box-shadow: none !important; }
  *:focus-visible { outline: 2px solid ${T.accent} !important; outline-offset: 2px !important; }
  input:focus, textarea:focus, select:focus {
    border-color: ${T.accent} !important;
    box-shadow: 0 0 0 3px ${T.accentGlow} !important;
  }
  button:focus { outline: none !important; }
  button::-moz-focus-inner { border: 0; }
  
  /* Smooth scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  
  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .fade-up { animation: fadeUp 0.35s cubic-bezier(.22,.68,0,1.2) both; }
  
  /* Tag / pill buttons */
  .tag-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 999px;
    color: ${T.textMuted};
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .tag-btn:hover { background: ${T.surfaceHover}; border-color: ${T.accent}; color: ${T.text}; }
  .tag-btn.active { background: ${T.accentGlow}; border-color: ${T.accent}; color: #fff; }
  .tag-btn:active { transform: scale(0.95); }
  
  /* Primary button */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 24px;
    background: ${T.accent};
    border: none; border-radius: ${T.radius};
    color: #fff; font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer;
    transition: background 0.18s ease, transform 0.12s ease, box-shadow 0.18s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { background: ${T.accentHover}; box-shadow: 0 4px 20px ${T.accentGlow}; transform: translateY(-1px); }
  .btn-primary:active { transform: scale(0.97) translateY(0); box-shadow: none; background: ${T.accent}; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  
  /* Secondary button */
  .btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 24px;
    background: transparent;
    border: 1px solid ${T.border}; border-radius: ${T.radius};
    color: ${T.textMuted}; font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    letter-spacing: 0.02em;
  }
  .btn-secondary:hover { background: ${T.surfaceHover}; border-color: ${T.borderAccent}; color: ${T.text}; transform: translateY(-1px); }
  .btn-secondary:active { transform: scale(0.97) translateY(0); background: ${T.surface}; }
  
  /* Green button */
  .btn-green {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 24px;
    background: transparent;
    border: 1px solid ${T.green}; border-radius: ${T.radius};
    color: ${T.green}; font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .btn-green:hover { background: ${T.greenGlow}; box-shadow: 0 4px 20px ${T.greenGlow}; transform: translateY(-1px); }
  .btn-green:active { transform: scale(0.97); box-shadow: none; }
  .btn-green:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  
  /* Danger button */
  .btn-danger {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 7px 14px;
    background: transparent;
    border: 1px solid rgba(248,81,73,0.3); border-radius: 8px;
    color: ${T.red}; font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .btn-danger:hover { background: rgba(248,81,73,0.12); border-color: ${T.red}; }
  .btn-danger:active { transform: scale(0.95); }
  
  /* Form input */
  .field-input {
    width: 100%;
    padding: 12px 16px;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: ${T.radius};
    color: ${T.text};
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }
  .field-input::placeholder { color: ${T.textDim}; }
  .field-input:hover { border-color: ${T.borderAccent}; }
  
  /* Avatar upload zone */
  .avatar-zone {
    display: flex; align-items: center; gap: 20px;
    padding: 20px;
    background: ${T.surface};
    border: 2px dashed ${T.border};
    border-radius: ${T.radiusLg};
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .avatar-zone:hover { border-color: ${T.accent}; background: ${T.surfaceHover}; }
  .avatar-zone.has-image { border-style: solid; border-color: ${T.accent}; }
  
  /* Social card */
  .social-card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: ${T.radius};
    padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    transition: border-color 0.18s ease;
  }
  .social-card:focus-within { border-color: ${T.accent}; }
  .social-card .si {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .social-card input {
    flex: 1; background: transparent; border: none;
    color: ${T.text}; font-family: 'Syne', sans-serif; font-size: 14px;
  }
  .social-card input::placeholder { color: ${T.textDim}; }
  
  /* Link item */
  .link-item {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: ${T.radius};
    transition: border-color 0.18s ease;
  }
  .link-item:hover { border-color: ${T.borderAccent}; }
  
  /* Review card */
  .review-card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: ${T.radiusLg};
    padding: 20px 24px;
    margin-bottom: 16px;
  }
  .review-card h4 {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: ${T.textMuted};
    margin-bottom: 14px;
  }
  
  /* Step indicator */
  .step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700;
    transition: all 0.25s ease;
    border: 2px solid ${T.border};
    color: ${T.textDim};
    background: ${T.surface};
    font-family: 'JetBrains Mono', monospace;
  }
  .step-dot.done { background: ${T.green}; border-color: ${T.green}; color: #000; }
  .step-dot.active { background: ${T.accent}; border-color: ${T.accent}; color: #fff; box-shadow: 0 0 0 4px ${T.accentGlow}; }
  
  /* Shimmer loading */
  .shimmer {
    background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.04) 50%, transparent 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
`;

/* ── Icon map for social platforms ── */
const SOCIAL_ICONS = {
  email:     { icon: "fas fa-envelope",      color: "#EA4335", bg: "rgba(234,67,53,0.15)" },
  whatsapp:  { icon: "fab fa-whatsapp",      color: "#25D366", bg: "rgba(37,211,102,0.15)" },
  instagram: { icon: "fab fa-instagram",     color: "#E4405F", bg: "rgba(228,64,95,0.15)" },
  facebook:  { icon: "fab fa-facebook-f",    color: "#1877F2", bg: "rgba(24,119,242,0.15)" },
  github:    { icon: "fab fa-github",        color: "#e8eaf2", bg: "rgba(232,234,242,0.1)" },
  snapchat:  { icon: "fab fa-snapchat",      color: "#FFFC00", bg: "rgba(255,252,0,0.1)" },
  youtube:   { icon: "fab fa-youtube",       color: "#FF0000", bg: "rgba(255,0,0,0.15)" },
  twitter:   { icon: "fab fa-x-twitter",     color: "#e8eaf2", bg: "rgba(232,234,242,0.1)" },
  linkedin:  { icon: "fab fa-linkedin-in",   color: "#0A66C2", bg: "rgba(10,102,194,0.15)" },
  tiktok:    { icon: "fab fa-tiktok",        color: "#e8eaf2", bg: "rgba(232,234,242,0.1)" },
  discord:   { icon: "fab fa-discord",       color: "#5865F2", bg: "rgba(88,101,242,0.15)" },
  telegram:  { icon: "fab fa-telegram",      color: "#26A5E4", bg: "rgba(38,165,228,0.15)" },
  twitch:    { icon: "fab fa-twitch",        color: "#9146FF", bg: "rgba(145,70,255,0.15)" },
  spotify:   { icon: "fab fa-spotify",       color: "#1DB954", bg: "rgba(29,185,84,0.15)" },
  medium:    { icon: "fab fa-medium",        color: "#e8eaf2", bg: "rgba(232,234,242,0.1)" },
  reddit:    { icon: "fab fa-reddit-alien",  color: "#FF4500", bg: "rgba(255,69,0,0.15)" },
  codepen:   { icon: "fab fa-codepen",       color: "#e8eaf2", bg: "rgba(232,234,242,0.1)" },
  stackoverflow: { icon: "fab fa-stack-overflow", color: "#F58025", bg: "rgba(245,128,37,0.15)" },
  devto:     { icon: "fab fa-dev",           color: "#e8eaf2", bg: "rgba(232,234,242,0.1)" },
  npm:       { icon: "fab fa-npm",           color: "#CC3534", bg: "rgba(204,53,52,0.15)" },
};

const ROLE_ICONS = {
  student:      "fas fa-graduation-cap",
  developer:    "fas fa-terminal",
  designer:     "fas fa-pen-nib",
  creator:      "fas fa-camera",
  gamer:        "fas fa-gamepad",
  traveler:     "fas fa-plane",
  athlete:      "fas fa-running",
  artist:       "fas fa-palette",
  musician:     "fas fa-music",
  entrepreneur: "fas fa-briefcase",
  writer:       "fas fa-feather-alt",
  other:        "fas fa-star",
};

const STEP_LABELS = ["Basic Info", "Interests", "Social", "Links", "Review"];

export default function DevProfileCreator() {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    username: "", name: "", dob: "", location: "",
    avatar: "",
    socialProfiles: {},
    links: [],
    interests: { role: "", hobbies: [], music: [], gaming: [], passions: [], skills: [] }
  });

  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [generating, setGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    injectLink(FA_CDN);
    injectLink(INTER_CDN);
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  /* ── Data ── */
  const roles = [
    { value: "student", label: "Student" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "creator", label: "Content Creator" },
    { value: "gamer", label: "Gamer" },
    { value: "traveler", label: "Traveler" },
    { value: "athlete", label: "Athlete" },
    { value: "artist", label: "Artist" },
    { value: "musician", label: "Musician" },
    { value: "entrepreneur", label: "Entrepreneur" },
    { value: "writer", label: "Writer" },
    { value: "other", label: "Other" },
  ];

  const hobbiesOptions = ["Reading","Gaming","Coding","Drawing","Photography","Traveling","Cooking","Sports","Music","Dancing","Writing","Hiking","Swimming","Yoga","Meditation","Gardening","Fishing","Camping"];
  const musicGenres = ["Pop","Rock","Hip Hop","Electronic","Jazz","Classical","R&B","Country","Metal","Indie","Latin","K-Pop","Folk","Ambient","Lo-fi"];
  const games = ["Minecraft","Fortnite","Valorant","League of Legends","GTA V","Call of Duty","Apex Legends","Among Us","Roblox","Mario","Zelda","Pokemon","Elden Ring","Skyrim","The Witcher"];
  const passions = ["Technology","Art","Music","Education","Environment","Social Justice","Health & Wellness","Fitness","Animals","Space","Science","History","Philosophy","Open Source"];
  const skills = ["JavaScript","TypeScript","Python","React","Next.js","Node.js","Rust","Go","UI/UX Design","Graphic Design","Video Editing","Photography","Writing","Public Speaking","Data Science","DevOps","Blockchain"];

  const socialPlatforms = [
    { name: "email",         label: "Email",          placeholder: "your@email.com" },
    { name: "github",        label: "GitHub",          placeholder: "username" },
    { name: "twitter",       label: "Twitter / X",     placeholder: "@username" },
    { name: "linkedin",      label: "LinkedIn",        placeholder: "username" },
    { name: "instagram",     label: "Instagram",       placeholder: "@username" },
    { name: "discord",       label: "Discord",         placeholder: "username" },
    { name: "youtube",       label: "YouTube",         placeholder: "@channel" },
    { name: "tiktok",        label: "TikTok",          placeholder: "@username" },
    { name: "twitch",        label: "Twitch",          placeholder: "username" },
    { name: "spotify",       label: "Spotify",         placeholder: "username" },
    { name: "telegram",      label: "Telegram",        placeholder: "@username" },
    { name: "whatsapp",      label: "WhatsApp",        placeholder: "+1234567890" },
    { name: "reddit",        label: "Reddit",          placeholder: "u/username" },
    { name: "facebook",      label: "Facebook",        placeholder: "username" },
    { name: "snapchat",      label: "Snapchat",        placeholder: "username" },
    { name: "medium",        label: "Medium",          placeholder: "@username" },
    { name: "devto",         label: "DEV.to",          placeholder: "username" },
    { name: "codepen",       label: "CodePen",         placeholder: "username" },
    { name: "stackoverflow", label: "Stack Overflow",  placeholder: "user ID" },
    { name: "npm",           label: "npm",             placeholder: "~username" },
  ];

  /* ── Handlers ── */
  const handleArraySelect = (cat, val) => {
    const cur = form.interests[cat];
    setForm({ ...form, interests: { ...form.interests, [cat]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] } });
  };

  const handleSocialChange = (name, val) =>
    setForm({ ...form, socialProfiles: { ...form.socialProfiles, [name]: val } });

  /* Real base64 image upload — works without any server */
  const processImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm(prev => ({ ...prev, avatar: e.target.result }));
      setUploading(false);
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => processImage(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    processImage(e.dataTransfer.files[0]);
  };

  const addLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    const url = newLink.url.startsWith("http") ? newLink.url : `https://${newLink.url}`;
    setForm({ ...form, links: [...form.links, { ...newLink, url, id: Date.now() }] });
    setNewLink({ title: "", url: "" });
  };

  const removeLink = (id) => setForm({ ...form, links: form.links.filter(l => l.id !== id) });

  const generateBio = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: form.interests, name: form.name }),
      });
      const data = await response.json();
      setGeneratedBio(data.bio);
    } catch {
      /* fallback demo bio */
      setGeneratedBio(`${form.name || "Hey"} — ${form.interests.role || "creator"} crafting cool stuff. Passionate about ${[...form.interests.hobbies, ...form.interests.passions].slice(0, 3).join(", ") || "everything"}. Always building, always learning.`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, aboutme: generatedBio }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Something went wrong");
    } catch {
      alert("Failed to create profile. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const filledSocials = Object.entries(form.socialProfiles).filter(([, v]) => v);

  /* ── Render helpers ── */
  const Label = ({ children }) => (
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, marginBottom: 8 }}>
      {children}
    </div>
  );

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 20 }}>
      <Label>{label}</Label>
      {children}
    </div>
  );

  const SectionTitle = ({ icon, title, sub }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ color: T.accent, fontSize: 18 }}><i className={icon} /></span>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text }}>{title}</h2>
      </div>
      {sub && <p style={{ color: T.textMuted, fontSize: 14, paddingLeft: 28 }}>{sub}</p>}
    </div>
  );

  const TagGrid = ({ items, category }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map(item => (
        <button key={item} type="button"
          className={`tag-btn ${form.interests[category].includes(item) ? "active" : ""}`}
          onClick={() => handleArraySelect(category, item)}>
          {form.interests[category].includes(item) && <i className="fas fa-check" style={{ fontSize: 10 }} />}
          {item}
        </button>
      ))}
    </div>
  );

  const NavRow = ({ showBack = true }) => (
    <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
      {showBack && (
        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>
          <i className="fas fa-arrow-left" style={{ fontSize: 13 }} /> Back
        </button>
      )}
      {step < 5 && (
        <button type="button" className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(s => s + 1)}>
          Continue <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />
        </button>
      )}
    </div>
  );

  /* ── Main render ── */
  return (
    <div style={{ minHeight: "100vh", background: T.bg, padding: "32px 16px 80px", fontFamily: "'Syne', sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: "6px 14px", marginBottom: 20, fontSize: 12, color: T.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="fas fa-circle" style={{ color: T.green, fontSize: 8 }} /> dev.profile / create
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Build Your Dev Profile
          </h1>
          <p style={{ color: T.textMuted, fontSize: 15 }}>Your link-in-bio, crafted for developers.</p>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          {STEP_LABELS.map((label, i) => {
            const s = i + 1;
            const state = step > s ? "done" : step === s ? "active" : "idle";
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: s < 5 ? 1 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div className={`step-dot ${state}`}>
                    {state === "done" ? <i className="fas fa-check" style={{ fontSize: 11 }} /> : s}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", color: state === "active" ? T.text : T.textDim, whiteSpace: "nowrap" }}>
                    {label.toUpperCase()}
                  </span>
                </div>
                {s < 5 && (
                  <div style={{ flex: 1, height: 2, background: step > s ? T.accent : T.border, margin: "0 8px", marginBottom: 18, transition: "background 0.3s ease", borderRadius: 1 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ───── STEP 1: Basic Info ───── */}
        {step === 1 && (
          <div className="fade-up">
            <SectionTitle icon="fas fa-user-astronaut" title="Basic Info" sub="Start with the fundamentals — who are you?" />

            <Field label="Username *">
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>@</span>
                <input className="field-input" style={{ paddingLeft: 28 }}
                  placeholder="johndoe"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
                />
              </div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                yourprofile.app/<span style={{ color: T.accent }}>{form.username || "username"}</span>
              </div>
            </Field>

            <Field label="Full Name *">
              <input className="field-input" placeholder="John Doe" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Date of Birth">
                <input className="field-input" type="date" value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })} />
              </Field>
              <Field label="Location">
                <input className="field-input" placeholder="New York, USA" value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })} />
              </Field>
            </div>

            <Field label="Profile Picture">
              <div
                className={`avatar-zone ${form.avatar ? "has-image" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{ borderColor: dragOver ? T.accent : undefined, background: dragOver ? T.surfaceHover : undefined }}
              >
                {form.avatar ? (
                  <>
                    <img src={form.avatar} alt="avatar"
                      style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.accent}` }} />
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Profile picture set</div>
                      <div style={{ fontSize: 13, color: T.textMuted }}>Click to change</div>
                    </div>
                    <button type="button" className="btn-danger" style={{ marginLeft: "auto" }}
                      onClick={e => { e.stopPropagation(); setForm({ ...form, avatar: "" }); }}>
                      <i className="fas fa-times" /> Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.surfaceHover, border: `2px dashed ${T.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: T.textDim }}>
                      {uploading ? <i className="fas fa-spinner" style={{ animation: "spin 0.8s linear infinite" }} /> : <i className="fas fa-camera" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{uploading ? "Processing..." : "Upload Photo"}</div>
                      <div style={{ fontSize: 13, color: T.textMuted }}>Click or drag & drop — PNG, JPG, GIF</div>
                    </div>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
            </Field>

            <NavRow showBack={false} />
          </div>
        )}

        {/* ───── STEP 2: Interests & Bio ───── */}
        {step === 2 && (
          <div className="fade-up">
            <SectionTitle icon="fas fa-brain" title="Your Interests" sub="Tell us what you're about — we'll generate a bio from it." />

            <Field label="I am a...">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {roles.map(r => (
                  <button key={r.value} type="button"
                    className={`tag-btn ${form.interests.role === r.value ? "active" : ""}`}
                    style={{ justifyContent: "flex-start", borderRadius: 10 }}
                    onClick={() => setForm({ ...form, interests: { ...form.interests, role: r.value } })}>
                    <i className={ROLE_ICONS[r.value] || "fas fa-star"} style={{ width: 14 }} />
                    {r.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Hobbies"><TagGrid items={hobbiesOptions} category="hobbies" /></Field>
            <Field label="Music Genres"><TagGrid items={musicGenres} category="music" /></Field>
            <Field label="Favorite Games"><TagGrid items={games} category="gaming" /></Field>
            <Field label="Passions"><TagGrid items={passions} category="passions" /></Field>
            <Field label="Tech Skills"><TagGrid items={skills} category="skills" /></Field>

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 24, marginTop: 8 }}>
              <Label>AI Bio Generator</Label>
              <button type="button" className="btn-green" style={{ width: "100%" }}
                onClick={generateBio} disabled={generating}>
                {generating
                  ? <><i className="fas fa-spinner" style={{ animation: "spin 0.8s linear infinite" }} /> Generating...</>
                  : <><i className="fas fa-wand-magic-sparkles" /> Generate Bio with AI</>}
              </button>
              {generatedBio && (
                <div style={{ marginTop: 16, padding: "16px 20px", background: T.surface, borderRadius: T.radius, borderLeft: `3px solid ${T.green}`, fontSize: 14, lineHeight: 1.7, color: T.text }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: T.green, marginBottom: 8 }}>AI GENERATED BIO</div>
                  {generatedBio}
                  <button type="button" style={{ display: "block", marginTop: 12, background: "none", border: "none", color: T.accent, fontSize: 13, cursor: "pointer", fontFamily: "'Syne', sans-serif", padding: 0 }}
                    onClick={() => setGeneratedBio("")}>
                    <i className="fas fa-redo" style={{ marginRight: 6 }} />Regenerate
                  </button>
                </div>
              )}
            </div>

            <NavRow />
          </div>
        )}

        {/* ───── STEP 3: Social Profiles ───── */}
        {step === 3 && (
          <div className="fade-up">
            <SectionTitle icon="fas fa-share-nodes" title="Social Profiles" sub="Connect your online presence. Only filled ones will show." />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {socialPlatforms.map(p => {
                const ic = SOCIAL_ICONS[p.name] || { icon: "fas fa-link", color: T.textMuted, bg: T.surface };
                return (
                  <div key={p.name} className="social-card">
                    <div className="si" style={{ background: ic.bg, color: ic.color }}>
                      <i className={ic.icon} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.textDim, marginBottom: 3, letterSpacing: "0.05em" }}>{p.label.toUpperCase()}</div>
                      <input
                        placeholder={p.placeholder}
                        value={form.socialProfiles[p.name] || ""}
                        onChange={e => handleSocialChange(p.name, e.target.value)}
                      />
                    </div>
                    {form.socialProfiles[p.name] && (
                      <i className="fas fa-check-circle" style={{ color: T.green, fontSize: 14 }} />
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, padding: "10px 14px", background: T.surface, borderRadius: T.radius, fontSize: 13, color: T.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-circle-info" style={{ color: T.accent }} />
              {filledSocials.length === 0 ? "No socials added yet." : `${filledSocials.length} social profile${filledSocials.length > 1 ? "s" : ""} added.`}
            </div>

            <NavRow />
          </div>
        )}

        {/* ───── STEP 4: Custom Links ───── */}
        {step === 4 && (
          <div className="fade-up">
            <SectionTitle icon="fas fa-link" title="Custom Links" sub="Add anything — portfolio, blog, merch, GitHub project..." />

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: 20, marginBottom: 20 }}>
              <Label>Add a Link</Label>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <input className="field-input" style={{ flex: "0 0 180px" }}
                  placeholder="Label (e.g. Portfolio)"
                  value={newLink.title}
                  onChange={e => setNewLink({ ...newLink, title: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && addLink()}
                />
                <input className="field-input"
                  placeholder="https://yoursite.com"
                  value={newLink.url}
                  onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && addLink()}
                />
              </div>
              <button type="button" className="btn-primary" onClick={addLink} style={{ width: "100%" }}>
                <i className="fas fa-plus" /> Add Link
              </button>
            </div>

            {form.links.length > 0 && (
              <>
                <Label>Your Links ({form.links.length})</Label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {form.links.map((link, idx) => (
                    <div key={link.id} className="link-item">
                      <div style={{ width: 32, height: 32, background: T.surfaceHover, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{link.title}</div>
                        <div style={{ fontSize: 12, color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.url}</div>
                      </div>
                      <a href={link.url} target="_blank" rel="noreferrer"
                        style={{ color: T.textMuted, textDecoration: "none", padding: "4px 8px", fontSize: 13 }}>
                        <i className="fas fa-arrow-up-right-from-square" />
                      </a>
                      <button type="button" className="btn-danger" onClick={() => removeLink(link.id)}>
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {form.links.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: T.textDim }}>
                <i className="fas fa-link" style={{ fontSize: 32, marginBottom: 12, display: "block" }} />
                <div style={{ fontSize: 14 }}>No links yet. Add your first one above.</div>
              </div>
            )}

            <NavRow />
          </div>
        )}

        {/* ───── STEP 5: Review ───── */}
        {step === 5 && (
          <div className="fade-up">
            <SectionTitle icon="fas fa-eye" title="Review Profile" sub="Everything look good? Hit publish when ready." />

            {/* Preview card */}
            <div style={{ background: `linear-gradient(135deg, ${T.surface} 0%, ${T.surfaceHover} 100%)`, border: `1px solid ${T.borderAccent}`, borderRadius: T.radiusLg, padding: 28, marginBottom: 20, textAlign: "center" }}>
              {form.avatar ? (
                <img src={form.avatar} alt="avatar" style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: `3px solid ${T.accent}`, marginBottom: 16 }} />
              ) : (
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: T.surfaceHover, border: `3px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: T.textDim, margin: "0 auto 16px" }}>
                  <i className="fas fa-user" />
                </div>
              )}
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{form.name || "Your Name"}</div>
              <div style={{ fontSize: 14, color: T.accent, fontFamily: "'JetBrains Mono', monospace", marginBottom: form.location ? 8 : 0 }}>@{form.username || "username"}</div>
              {form.location && <div style={{ fontSize: 13, color: T.textMuted }}><i className="fas fa-location-dot" style={{ marginRight: 6 }} />{form.location}</div>}
              {generatedBio && <p style={{ fontSize: 14, color: T.textMuted, marginTop: 14, lineHeight: 1.7, maxWidth: 400, margin: "14px auto 0" }}>{generatedBio}</p>}

              {filledSocials.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                  {filledSocials.map(([name]) => {
                    const ic = SOCIAL_ICONS[name] || { icon: "fas fa-link", color: T.textMuted, bg: T.surfaceHover };
                    return (
                      <div key={name} style={{ width: 36, height: 36, borderRadius: 9, background: ic.bg, color: ic.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                        <i className={ic.icon} />
                      </div>
                    );
                  })}
                </div>
              )}

              {form.links.length > 0 && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
                  {form.links.map(link => (
                    <div key={link.id} style={{ padding: "10px 16px", background: T.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, fontWeight: 600 }}>
                      {link.title}
                      <i className="fas fa-arrow-right" style={{ color: T.textDim, fontSize: 12 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { icon: "fas fa-share-nodes", label: "Socials", val: filledSocials.length },
                { icon: "fas fa-link",        label: "Links",   val: form.links.length },
                { icon: "fas fa-tag",         label: "Tags",    val: Object.values(form.interests).flat().filter(Boolean).length },
              ].map(s => (
                <div key={s.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 16px", textAlign: "center" }}>
                  <i className={s.icon} style={{ color: T.accent, marginBottom: 6, display: "block", fontSize: 18 }} />
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(4)}>
                <i className="fas fa-arrow-left" style={{ fontSize: 13 }} /> Back
              </button>
              <button type="button" className="btn-primary" style={{ flex: 2 }}
                onClick={handleSubmit} disabled={submitLoading || !form.username || !form.name}>
                {submitLoading
                  ? <><i className="fas fa-spinner" style={{ animation: "spin 0.8s linear infinite" }} /> Publishing...</>
                  : <><i className="fas fa-rocket" /> Publish Profile</>}
              </button>
            </div>
            {(!form.username || !form.name) && (
              <div style={{ marginTop: 10, fontSize: 13, color: T.red, textAlign: "center" }}>
                <i className="fas fa-triangle-exclamation" style={{ marginRight: 6 }} />
                Username and name are required
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
