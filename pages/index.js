import { useState, useRef, useCallback, useEffect, useMemo } from "react";

/* ─── SSR-safe style injection ─── */
let _stylesLoaded = false;
function loadStyles() {
  if (typeof window === "undefined" || _stylesLoaded) return;
  _stylesLoaded = true;
  [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
  ].forEach(href => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href;
    document.head.appendChild(l);
  });
  if (document.getElementById("mws-css")) return;
  const s = document.createElement("style"); s.id = "mws-css";
  s.textContent = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#f4f5f9;color:#111827;-webkit-font-smoothing:antialiased;}
*{-webkit-tap-highlight-color:transparent;}
*:focus{outline:none!important;}
button::-moz-focus-inner{border:0;}
input:focus,textarea:focus{border-color:#6C63FF!important;box-shadow:0 0 0 3px rgba(108,99,255,0.15)!important;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px;}
@keyframes mFadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes mSpin{to{transform:rotate(360deg);}}
@keyframes mPop{0%{opacity:0;transform:scale(.84);}100%{opacity:1;transform:scale(1);}}
@keyframes mFall{0%{transform:translateY(-10px) rotate(0);opacity:1;}100%{transform:translateY(100px) rotate(400deg);opacity:0;}}
.fu{animation:mFadeUp .3s cubic-bezier(.22,.68,0,1.15) both;}
.pop{animation:mPop .38s cubic-bezier(.22,.68,0,1.2) both;}
.spin{animation:mSpin .8s linear infinite;}
.confetti{position:absolute;width:9px;height:9px;border-radius:2px;animation:mFall 1.5s ease-out forwards;}
.inp{width:100%;padding:11px 14px;background:#fff;border:1.5px solid #e5e7eb;border-radius:10px;color:#111827;font-family:inherit;font-size:14px;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none;}
.inp::placeholder{color:#adb5c0;}
.inp:hover:not(:focus){border-color:#c5c8f6;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 20px;border-radius:10px;border:none;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .14s,transform .1s,box-shadow .14s;user-select:none;white-space:nowrap;line-height:1;-webkit-appearance:none;}
.btn:active{transform:scale(.96)!important;box-shadow:none!important;}
.btn:disabled{opacity:.36;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
.btn-p{background:#6C63FF;color:#fff;}.btn-p:hover{background:#5a52e8;box-shadow:0 4px 18px rgba(108,99,255,.3);transform:translateY(-1px);}
.btn-s{background:#fff;color:#374151;border:1.5px solid #e5e7eb;}.btn-s:hover{background:#f9fafb;transform:translateY(-1px);}
.btn-g{background:#10b981;color:#fff;}.btn-g:hover{background:#059669;box-shadow:0 4px 18px rgba(16,185,129,.3);transform:translateY(-1px);}
.btn-gh{background:transparent;color:#6b7280;border:1.5px solid #e5e7eb;}.btn-gh:hover{background:#f9fafb;color:#374151;}
.btn-d{background:transparent;color:#ef4444;border:1.5px solid #fca5a5;padding:7px 12px;font-size:13px;}.btn-d:hover{background:#fef2f2;border-color:#ef4444;}
.tag{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:999px;border:1.5px solid #e5e7eb;background:#fff;color:#6b7280;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .14s ease;user-select:none;}
.tag:hover{border-color:#6C63FF;color:#6C63FF;background:#f2f0ff;}.tag:active{transform:scale(.95);}
.tag.on{background:#6C63FF;border-color:#6C63FF;color:#fff;}
.card{background:#fff;border:1.5px solid #e9eaf0;border-radius:16px;padding:20px;}
.sdot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid #e5e7eb;background:#fff;color:#9ca3af;transition:all .2s ease;flex-shrink:0;}
.sdot.done{background:#10b981;border-color:#10b981;color:#fff;}
.sdot.active{background:#6C63FF;border-color:#6C63FF;color:#fff;box-shadow:0 0 0 4px rgba(108,99,255,.16);}
.slbl{font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#b0b7c3;white-space:nowrap;margin-top:4px;}
.slbl.active{color:#6C63FF;}.slbl.done{color:#10b981;}
.sc{display:flex;align-items:center;gap:10px;padding:11px 13px;background:#fff;border:1.5px solid #e9eaf0;border-radius:10px;transition:border-color .15s,box-shadow .15s;}
.sc:focus-within{border-color:#6C63FF;box-shadow:0 0 0 3px rgba(108,99,255,.1);}
.sc-inp{flex:1;border:none;background:transparent;font-family:inherit;font-size:13.5px;color:#111827;min-width:0;}
.sc-inp::placeholder{color:#adb5c0;}
.lr{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1.5px solid #e9eaf0;border-radius:10px;transition:border-color .15s,box-shadow .15s;}
.lr:hover{border-color:#c7c3f9;box-shadow:0 2px 8px rgba(108,99,255,.07);}
.sring{width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#10b981);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 8px 32px rgba(108,99,255,.28);}
.lbl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9ca3af;margin-bottom:8px;}
.hint{font-size:12px;color:#6b7280;margin-top:5px;display:flex;align-items:center;gap:5px;}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;background:#d1fae5;color:#065f46;font-size:11px;font-weight:600;}
.aibadge{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;background:linear-gradient(135deg,#f0edff,#e0fdf4);border:1px solid #c4b5fd;font-size:11px;font-weight:700;color:#5b21b6;}
.cc{font-size:11px;color:#adb5c0;text-align:right;margin-top:4px;}
.cc.w{color:#f59e0b;}.cc.o{color:#ef4444;}
.topbar{background:#fff;border-bottom:1px solid #e9eaf0;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
.footer{text-align:center;padding:24px 16px 20px;font-size:13px;color:#9ca3af;}
.divider{height:1px;background:#f0f0f5;margin:18px 0;}
.urlbox{display:flex;align-items:center;gap:10px;background:#f8f7ff;border:1.5px solid #ede9ff;border-radius:12px;padding:12px 16px;}
/* search input inside tag sections */
.tag-search{width:100%;padding:8px 12px;background:#f8f7ff;border:1.5px solid #ede9ff;border-radius:8px;font-family:inherit;font-size:13px;color:#111827;margin-bottom:10px;}
.tag-search::placeholder{color:#adb5c0;}
.tag-search:focus{border-color:#6C63FF;box-shadow:0 0 0 2px rgba(108,99,255,.12);}
/* share overlay */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.52);z-index:1000;display:flex;align-items:flex-end;justify-content:center;}
.sheet{background:#fff;border-radius:20px 20px 0 0;padding:20px 16px 40px;width:100%;max-width:520px;animation:mFadeUp .22s ease;}
.share-item{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;user-select:none;width:68px;padding:6px;border-radius:12px;transition:background .14s;}
.share-item:hover{background:#f5f5f5;}
.share-item:active{transform:scale(.9);}
.share-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;}
.share-label{font-size:11px;font-weight:600;color:#374151;text-align:center;line-height:1.2;}
@media(max-width:520px){
  .card{padding:14px;}
  .btn{padding:10px 14px;font-size:13px;}
  .sdot{width:26px;height:26px;font-size:10px;}
  .slbl{display:none;}
  .g2{grid-template-columns:1fr!important;}
  .sg{grid-template-columns:1fr!important;}
  .share-item{width:60px;}
  .share-icon{width:46px;height:46px;font-size:20px;}
}
  `;
  document.head.appendChild(s);
}

/* ─── Helpers ─── */
function stripAI(t) {
  if (!t) return "";
  return t.replace(/<think>[\s\S]*?<\/think>/gi,"").replace(/^[\s\n\r]+/,"").trim();
}

/* ─── Constants ─── */
const LS_KEY   = "mws_v6";
const AC       = "#6C63FF";
const GROQ_KEY = "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";

const SM = {
  email:{i:"fas fa-envelope",c:"#EA4335",b:"#fef2f2"},instagram:{i:"fab fa-instagram",c:"#E4405F",b:"#fdf2f4"},
  whatsapp:{i:"fab fa-whatsapp",c:"#25D366",b:"#edfaf3"},facebook:{i:"fab fa-facebook-f",c:"#1877F2",b:"#eef4ff"},
  youtube:{i:"fab fa-youtube",c:"#FF0000",b:"#fff2f2"},twitter:{i:"fab fa-x-twitter",c:"#111",b:"#f5f5f5"},
  tiktok:{i:"fab fa-tiktok",c:"#010101",b:"#f5f5f5"},snapchat:{i:"fab fa-snapchat",c:"#c9a800",b:"#fffce8"},
  pinterest:{i:"fab fa-pinterest",c:"#E60023",b:"#fff0f1"},telegram:{i:"fab fa-telegram",c:"#26A5E4",b:"#edf7fd"},
  discord:{i:"fab fa-discord",c:"#5865F2",b:"#eef0ff"},linkedin:{i:"fab fa-linkedin-in",c:"#0A66C2",b:"#e8f3fc"},
  github:{i:"fab fa-github",c:"#24292e",b:"#f6f8fa"},twitch:{i:"fab fa-twitch",c:"#9146FF",b:"#f3eeff"},
  spotify:{i:"fab fa-spotify",c:"#1DB954",b:"#edfaf3"},reddit:{i:"fab fa-reddit-alien",c:"#FF4500",b:"#fff2ed"},
  medium:{i:"fab fa-medium",c:"#333",b:"#f5f5f5"},devto:{i:"fab fa-dev",c:"#0a0a0a",b:"#f5f5f5"},
  codepen:{i:"fab fa-codepen",c:"#111",b:"#f5f5f5"},stackoverflow:{i:"fab fa-stack-overflow",c:"#F58025",b:"#fff4ed"},
  behance:{i:"fab fa-behance",c:"#1769FF",b:"#eef2ff"},dribbble:{i:"fab fa-dribbble",c:"#ea4c89",b:"#fdf0f5"},
  npm:{i:"fab fa-npm",c:"#CC3534",b:"#fff0f0"},
};

const RI = {
  student:"fas fa-graduation-cap",professional:"fas fa-briefcase",creator:"fas fa-camera",
  artist:"fas fa-palette",musician:"fas fa-music",athlete:"fas fa-person-running",
  traveler:"fas fa-plane",foodie:"fas fa-utensils",gamer:"fas fa-gamepad",
  writer:"fas fa-pen-nib",entrepreneur:"fas fa-rocket",parent:"fas fa-heart",
  coder:"fas fa-code",trader:"fas fa-chart-line",investor:"fas fa-coins",
  designer:"fas fa-pen-ruler",teacher:"fas fa-chalkboard-teacher",doctor:"fas fa-user-doctor",
  chef:"fas fa-hat-chef",architect:"fas fa-drafting-compass",photographer:"fas fa-aperture",
  influencer:"fas fa-star",volunteer:"fas fa-hand-holding-heart",researcher:"fas fa-microscope",
  lawyer:"fas fa-scale-balanced",engineer:"fas fa-screwdriver-wrench",nurse:"fas fa-user-nurse",
  scientist:"fas fa-flask",filmmaker:"fas fa-film",model:"fas fa-person",other:"fas fa-star",
};

const LI = [
  "fas fa-link","fas fa-globe","fas fa-briefcase","fas fa-folder-open","fas fa-star","fas fa-heart",
  "fas fa-rocket","fas fa-bolt","fas fa-book-open","fas fa-video","fas fa-microphone","fas fa-store",
  "fas fa-graduation-cap","fas fa-code","fas fa-pen-nib","fas fa-camera","fas fa-music","fas fa-gamepad",
  "fas fa-trophy","fas fa-film","fas fa-images","fas fa-newspaper","fas fa-podcast","fas fa-headphones",
  "fas fa-paintbrush","fas fa-leaf","fas fa-paw","fas fa-dumbbell","fas fa-plane","fas fa-utensils",
  "fas fa-flask","fas fa-laptop","fas fa-gift","fas fa-handshake","fas fa-chart-bar","fas fa-fire",
  "fas fa-crown","fas fa-gem","fas fa-sun","fas fa-moon","fas fa-futbol","fas fa-basketball",
  "fas fa-baseball","fas fa-tree","fas fa-shopping-bag","fas fa-map-marker-alt","fas fa-coffee",
  "fas fa-chart-line","fas fa-coins","fas fa-pen-ruler","fas fa-microscope","fas fa-screwdriver-wrench",
];

const SL = [
  {n:"email",l:"Email",p:"your@email.com"},{n:"instagram",l:"Instagram",p:"@username"},
  {n:"whatsapp",l:"WhatsApp",p:"+1234567890"},{n:"facebook",l:"Facebook",p:"username"},
  {n:"youtube",l:"YouTube",p:"@channel"},{n:"twitter",l:"Twitter / X",p:"@username"},
  {n:"tiktok",l:"TikTok",p:"@username"},{n:"snapchat",l:"Snapchat",p:"username"},
  {n:"pinterest",l:"Pinterest",p:"username"},{n:"telegram",l:"Telegram",p:"@username"},
  {n:"discord",l:"Discord",p:"username"},{n:"linkedin",l:"LinkedIn",p:"username"},
  {n:"github",l:"GitHub",p:"username"},{n:"twitch",l:"Twitch",p:"username"},
  {n:"spotify",l:"Spotify",p:"username"},{n:"reddit",l:"Reddit",p:"u/username"},
  {n:"medium",l:"Medium",p:"@username"},{n:"devto",l:"DEV.to",p:"username"},
  {n:"codepen",l:"CodePen",p:"username"},{n:"stackoverflow",l:"Stack Overflow",p:"user ID"},
  {n:"behance",l:"Behance",p:"username"},{n:"dribbble",l:"Dribbble",p:"username"},
  {n:"npm",l:"npm",p:"~username"},
];

const STEPS = ["Basic","Vibe","Social","Links","Publish"];

const ROLES = [
  {v:"student",l:"Student"},{v:"coder",l:"Coder / Dev"},{v:"trader",l:"Trader"},
  {v:"investor",l:"Investor"},{v:"designer",l:"Designer"},{v:"creator",l:"Creator"},
  {v:"entrepreneur",l:"Entrepreneur"},{v:"professional",l:"Professional"},
  {v:"teacher",l:"Teacher"},{v:"doctor",l:"Doctor"},{v:"nurse",l:"Nurse"},
  {v:"engineer",l:"Engineer"},{v:"architect",l:"Architect"},{v:"researcher",l:"Researcher"},
  {v:"scientist",l:"Scientist"},{v:"lawyer",l:"Lawyer"},{v:"chef",l:"Chef"},
  {v:"photographer",l:"Photographer"},{v:"filmmaker",l:"Filmmaker"},
  {v:"artist",l:"Artist"},{v:"musician",l:"Musician"},{v:"writer",l:"Writer"},
  {v:"influencer",l:"Influencer"},{v:"athlete",l:"Athlete"},{v:"traveler",l:"Traveler"},
  {v:"foodie",l:"Foodie"},{v:"gamer",l:"Gamer"},{v:"parent",l:"Parent"},
  {v:"volunteer",l:"Volunteer"},{v:"model",l:"Model"},{v:"other",l:"Other"},
];

/* ─── Massive interest data ─── */
const ALL_SPORTS = [
  "Cricket","Football","Basketball","Volleyball","Tennis","Badminton","Table Tennis",
  "Baseball","Rugby","Hockey","Swimming","Athletics","Cycling","Boxing","Wrestling",
  "Kabaddi","Kho-Kho","Archery","Gymnastics","Skating","Skiing","Surfing","Golf",
  "Squash","Handball","Rowing","Sailing","Judo","Karate","Taekwondo","Fencing",
  "Shooting","Weightlifting","Powerlifting","CrossFit","Yoga","Pilates","Rock Climbing",
  "Skateboarding","Parkour","Motorsports","Formula 1","MMA","Chess","Esports","Snooker",
  "Bowling","Netball","Polo","Lacrosse","Volleyball","Triathlon","Marathon","Cycling",
  "Ice Hockey","Figure Skating","Biathlon","Bobsled","Curling","Diving","Water Polo",
];

const ALL_HOBBIES = [
  "Reading","Gaming","Cooking","Baking","Traveling","Photography","Art & Crafts",
  "Painting","Sketching","Dancing","Singing","Hiking","Camping","Gardening","Fishing",
  "Knitting","Woodworking","Pottery","Candle Making","Journaling","Blogging","Vlogging",
  "Podcasting","Streaming","Stand-up Comedy","Astronomy","Birdwatching","Collecting",
  "Origami","Calligraphy","Digital Art","3D Printing","DIY Projects","Home Decor",
  "Thrifting","Board Games","Card Games","Puzzles","Meditation","Running","Walking",
  "Cycling","Volunteering","Dog Walking","Cat Fostering","Cosplay","Anime","Manga",
  "Comics","Legos","Model Building","Radio-controlled Vehicles","Drones","Archery",
  "Fencing","Martial Arts","Rock Climbing","Surfing","Skateboarding","Snowboarding",
  "Paragliding","Scuba Diving","Kayaking","Canoeing","Horse Riding","Falconry",
];

const ALL_MUSIC = [
  "Pop","Rock","Hip Hop","R&B","Electronic","Jazz","Classical","Country","Metal",
  "Indie","Latin","K-Pop","J-Pop","Folk","Reggae","Lo-fi","Ambient","Blues","Soul",
  "Gospel","Devotional","Bollywood","Tollywood","Carnatic","Hindustani","EDM","House",
  "Techno","Drum & Bass","Trap","Afrobeats","Bhangra","Punjabi","Qawwali","Sufi",
  "Phonk","Drill","Emo","Pop Punk","Ska","Grunge","Alternative","Shoegaze","Post-Rock",
];

const ALL_VIBES = [
  "Chill","Adventurous","Creative","Ambitious","Funny","Romantic","Spiritual",
  "Minimalist","Social butterfly","Introverted","Outdoorsy","Bookworm","Night owl",
  "Early bird","Tech-savvy","Eco-conscious","Animal lover","Family-oriented","Hustler",
  "Dreamer","Free spirit","Homebody","Globetrotter","Empath","Old soul","Optimist",
  "Realist","Perfectionist","Laid-back","Energetic","Philosophical","Artistic",
  "Analytical","Spontaneous","Organised","Deep thinker","Storyteller",
];

const ALL_PASSIONS = [
  "Family","Friendship","Health & Wellness","Nature","Animals","Travel","Food",
  "Fashion","Beauty","Fitness","Continuous Learning","Community","Creativity",
  "Mindfulness","Sustainability","Diversity & Inclusion","Mental Health",
  "Child Education","Women Empowerment","Social Work","Technology","Space",
  "Science","History","Philosophy","Spirituality","Entrepreneurship","Politics",
  "Economics","Climate Change","Human Rights","Art Preservation","Ocean Conservation",
  "Zero Waste","Veganism","Digital Privacy","Open Source","Financial Freedom",
  "Passive Income","Stock Market","Crypto","Real Estate","Personal Finance",
];

const ALL_SKILLS = [
  /* Tech */
  "JavaScript","TypeScript","Python","Java","C++","C","Rust","Go","Swift","Kotlin",
  "PHP","Ruby","Scala","Dart","R","MATLAB","React","Next.js","Vue","Angular","Svelte",
  "Node.js","Express","Django","FastAPI","Laravel","Spring Boot","Flutter","React Native",
  "GraphQL","REST APIs","Docker","Kubernetes","AWS","GCP","Azure","Firebase","MongoDB",
  "PostgreSQL","MySQL","Redis","Git","Linux","DevOps","CI/CD","Cybersecurity","Blockchain",
  "Web3","Machine Learning","Deep Learning","NLP","Data Science","Data Analysis","Tableau",
  /* Design */
  "UI/UX Design","Figma","Adobe XD","Photoshop","Illustrator","After Effects","Premiere Pro",
  "Blender","3D Modeling","Motion Graphics","Video Editing","Photography Editing",
  /* Finance */
  "Stock Trading","Forex Trading","Crypto Trading","Options Trading","Fundamental Analysis",
  "Technical Analysis","Financial Modeling","Accounting","Bookkeeping","Tax Planning",
  /* Other */
  "Public Speaking","Leadership","Project Management","Content Writing","Copywriting",
  "SEO","Social Media Marketing","Email Marketing","Sales","Customer Service",
  "Graphic Design","Brand Design","Logo Design","Interior Design","Fashion Design",
];

const EMPTY = {
  username:"",name:"",dob:"",location:"",bio:"",avatar:"",
  socialProfiles:{},links:[],
  interests:{role:"",hobbies:[],sports:[],vibes:[],music:[],passions:[],skills:[]},
};

/* ─── Share options factory ─── */
function buildShareOptions(url, onClose, onCopy) {
  const enc = encodeURIComponent;
  return [
    {label:"Copy Link",  icon:"fas fa-link",         bg:"#f0edff",fg:AC,        act:()=>{onCopy();onClose();}},
    {label:"WhatsApp",   icon:"fab fa-whatsapp",     bg:"#edfaf3",fg:"#25D366", act:()=>{window.open(`https://wa.me/?text=${enc("Check my profile! "+url)}`);onClose();}},
    {label:"Telegram",   icon:"fab fa-telegram",     bg:"#edf7fd",fg:"#26A5E4", act:()=>{window.open(`https://t.me/share/url?url=${enc(url)}&text=My+profile`);onClose();}},
    {label:"Instagram",  icon:"fab fa-instagram",    bg:"#fdf2f4",fg:"#E4405F", act:()=>{onCopy();alert("Link copied! Paste it in your Instagram story or bio.");onClose();}},
    {label:"Snapchat",   icon:"fab fa-snapchat",     bg:"#fffce8",fg:"#c9a800", act:()=>{window.open(`https://www.snapchat.com/scan?attachmentUrl=${enc(url)}`);onClose();}},
    {label:"Twitter",    icon:"fab fa-x-twitter",    bg:"#f5f5f5",fg:"#111",    act:()=>{window.open(`https://twitter.com/intent/tweet?text=${enc("Check my profile! "+url)}`);onClose();}},
    {label:"Facebook",   icon:"fab fa-facebook-f",   bg:"#eef4ff",fg:"#1877F2", act:()=>{window.open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`);onClose();}},
    {label:"LinkedIn",   icon:"fab fa-linkedin-in",  bg:"#e8f3fc",fg:"#0A66C2", act:()=>{window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`);onClose();}},
    {label:"Reddit",     icon:"fab fa-reddit-alien", bg:"#fff2ed",fg:"#FF4500", act:()=>{window.open(`https://reddit.com/submit?url=${enc(url)}&title=My+Profile`);onClose();}},
    {label:"Pinterest",  icon:"fab fa-pinterest",    bg:"#fff0f1",fg:"#E60023", act:()=>{window.open(`https://pinterest.com/pin/create/button/?url=${enc(url)}`);onClose();}},
    {label:"Email",      icon:"fas fa-envelope",     bg:"#fef2f2",fg:"#EA4335", act:()=>{window.open(`mailto:?subject=My Profile&body=${enc(url)}`);onClose();}},
    {label:"SMS",        icon:"fas fa-comment-sms",  bg:"#f0fdf4",fg:"#10b981", act:()=>{window.open(`sms:?body=${enc("My profile: "+url)}`);onClose();}},
  ];
}

/* ─── Shared sub-components (defined outside main — stable) ─── */
function ShareSheet({url, onClose, onCopy}) {
  const opts = buildShareOptions(url, onClose, onCopy);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{fontWeight:800,fontSize:17}}>Share Profile</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:300}}>{url}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:24,color:"#9ca3af",cursor:"pointer",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8}}>×</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {opts.map(o=>(
            <div key={o.label} className="share-item" onClick={o.act}>
              <div className="share-icon" style={{background:o.bg,color:o.fg}}><i className={o.icon}/></div>
              <span className="share-label">{o.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Topbar({right}) {
  return (
    <div className="topbar">
      <a href="https://mywebsam.site/" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
        <div style={{width:28,height:28,borderRadius:8,background:AC,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <i className="fas fa-link" style={{color:"#fff",fontSize:12}}/>
        </div>
        <span style={{fontWeight:800,fontSize:15,color:"#111827",letterSpacing:"-0.01em"}}>mywebsam</span>
      </a>
      {right}
    </div>
  );
}
const Footer = () => <div className="footer">Made with ❤️‍🔥 by <strong style={{color:"#374151"}}>Samartha GS</strong></div>;

/* ─── Searchable tag section ─── */
function SearchableTags({label, items, selected, onToggle}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(()=>items.filter(i=>i.toLowerCase().includes(q.toLowerCase())),[items,q]);
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div className="lbl">{label}</div>
        {selected.length>0&&<span style={{fontSize:11,color:AC,fontWeight:600}}>{selected.length} selected</span>}
      </div>
      <input className="tag-search" placeholder={`Search ${label.toLowerCase()}...`}
        value={q} onChange={e=>setQ(e.target.value)} />
      <div style={{display:"flex",flexWrap:"wrap",gap:6,maxHeight:200,overflowY:"auto",paddingBottom:4}}>
        {filtered.slice(0,60).map(item=>{
          const on=selected.includes(item);
          return (
            <button key={item} type="button" className={`tag${on?" on":""}`} onClick={()=>onToggle(item)}>
              {on&&<i className="fas fa-check" style={{fontSize:9}}/>}{item}
            </button>
          );
        })}
        {filtered.length===0&&<div style={{fontSize:13,color:"#adb5c0",padding:"8px 0"}}>No results for "{q}"</div>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function ProfileCreator() {
  useEffect(()=>{loadStyles();},[]);

  const [view,      setView]     = useState("loading");
  const [step,      setStep]     = useState(1);
  const [form,      setForm]     = useState(EMPTY);
  const [saved,     setSaved]    = useState(null);
  const [genBio,    setGenBio]   = useState("");
  const [bioEdited, setBioEdited]= useState(false);
  const [newLink,   setNewLink]  = useState({title:"",url:"",icon:"fas fa-link"});
  const [showIconP, setShowIconP]= useState(false);
  const [uploading, setUploading]= useState(false);
  const [dragOver,  setDragOver] = useState(false);
  const [aiLoad,    setAiLoad]   = useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [pubUrl,    setPubUrl]   = useState("");
  const [pubUser,   setPubUser]  = useState("");
  const [copied,    setCopied]   = useState(false);
  const [showShare, setShowShare]= useState(false);
  const [showDelete,setShowDelete]=useState(false);
  const [deleting,  setDeleting]  =useState(false);
  const fileRef = useRef(null);

  /* ── Mount: read localStorage ── */
  useEffect(()=>{
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.username) { setSaved(p); setView("dashboard"); return; }
      }
    } catch(_){}
    setView("form");
  },[]);

  /* ── Persist ── */
  const persist = useCallback((p)=>{
    try{localStorage.setItem(LS_KEY,JSON.stringify(p));}catch(_){}
    setSaved(p);
  },[]);

  /* ── Load into edit form ── */
  const startEdit = useCallback((p)=>{
    setForm({
      username:p.username||"",name:p.name||"",dob:p.dob||"",
      location:p.location||"",bio:p.bio||"",avatar:p.avatar||"",
      socialProfiles:p.socialProfiles||{},links:p.links||[],
      interests:p.interests||EMPTY.interests,
    });
    setGenBio(p.aboutme||"");
    setBioEdited(false);
    setStep(1);
    setView("form");
  },[]);

  /* ── Computed ── */
  const filledSocials = useMemo(()=>Object.entries(form.socialProfiles).filter(([,v])=>v?.trim()),[form.socialProfiles]);
  const totalTags = useMemo(()=>Object.values(form.interests).flat().filter(Boolean).length,[form.interests]);
  const score = useMemo(()=>Math.min(100,Math.round(
    [form.username,form.name,form.avatar,form.dob,form.location].filter(Boolean).length*6+
    Math.min(totalTags,12)*2.5+Math.min(filledSocials.length,5)*4+
    Math.min(form.links.length,3)*5+(genBio||form.bio?5:0)
  )),[form,totalTags,filledSocials,genBio]);

  const checklist = [
    {t:"Username set",d:!!form.username},
    {t:"Full name added",d:!!form.name},
    {t:"Profile photo",d:!!form.avatar},
    {t:"Location added",d:!!form.location},
    {t:"Role or vibe selected",d:!!form.interests.role||form.interests.vibes.length>0},
    {t:"At least 3 interests",d:totalTags>=3},
    {t:"Social profile linked",d:filledSocials.length>0},
    {t:"Bio written/generated",d:!!(genBio||form.bio)},
  ];

  /* ── Stable handlers ── */
  const setField  = useCallback((k,v)=>setForm(p=>({...p,[k]:v})),[]);
  const setSocial = useCallback((n,v)=>setForm(p=>({...p,socialProfiles:{...p.socialProfiles,[n]:v}})),[]);
  const toggleTag = useCallback((cat,val)=>setForm(p=>{
    const c=p.interests[cat];
    return{...p,interests:{...p.interests,[cat]:c.includes(val)?c.filter(x=>x!==val):[...c,val]}};
  }),[]);
  const setRole = useCallback((v)=>setForm(p=>({...p,interests:{...p.interests,role:p.interests.role===v?"":v}})),[]);

  const processImg = useCallback((file)=>{
    if(!file||!file.type.startsWith("image/"))return;
    setUploading(true);
    const r=new FileReader();
    r.onload=e=>{setForm(p=>({...p,avatar:e.target.result}));setUploading(false);};
    r.onerror=()=>setUploading(false);
    r.readAsDataURL(file);
  },[]);

  const addLink=()=>{
    if(!newLink.title.trim()||!newLink.url.trim())return;
    const url=/^https?:\/\//.test(newLink.url)?newLink.url:`https://${newLink.url}`;
    setForm(p=>({...p,links:[...p.links,{...newLink,url,id:Date.now()}]}));
    setNewLink({title:"",url:"",icon:"fas fa-link"});setShowIconP(false);
  };
  const rmLink=id=>setForm(p=>({...p,links:p.links.filter(l=>l.id!==id)}));
  const mvLink=(i,d)=>setForm(p=>{
    const ls=[...p.links],j=i+d;
    if(j<0||j>=ls.length)return p;
    [ls[i],ls[j]]=[ls[j],ls[i]];return{...p,links:ls};
  });

  /* ── Groq AI ── */
  const generateBio=async()=>{
    setAiLoad(true);
    const rl=ROLES.find(r=>r.v===form.interests.role)?.l||"person";
    const sp=form.interests.sports.slice(0,3).join(", ");
    const hb=form.interests.hobbies.slice(0,3).join(", ");
    const vb=form.interests.vibes.slice(0,3).join(", ");
    const ms=form.interests.music.slice(0,3).join(", ");
    const nm=form.name||"someone";
    const lc=form.location||"";
    try{
      const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${GROQ_KEY}`},
        body:JSON.stringify({
          model:"llama-3.1-8b-instant",
          messages:[
            {role:"system",content:"You write short bios for personal profile pages. Output ONLY the final bio text — 2-3 warm casual first-person sentences. No thinking, no labels, no quotes, no explanations."},
            {role:"user",content:`Bio for ${nm}${lc?`, from ${lc}`:""}, a ${rl}.${vb?` Vibe: ${vb}.`:""}${sp?` Sports: ${sp}.`:""}${hb?` Hobbies: ${hb}.`:""}${ms?` Music: ${ms}.`:""} Casual, warm, first person, no hashtags, no emojis.`},
          ],
          max_tokens:130,temperature:0.72,
        }),
      });
      if(!res.ok)throw new Error(`${res.status}`);
      const data=await res.json();
      const txt=stripAI(data?.choices?.[0]?.message?.content||"");
      if(txt.length>10){setGenBio(txt);setBioEdited(false);}
      else throw new Error("empty");
    }catch(e){
      const ex=[sp&&`love ${sp.split(",")[0].trim()}`,hb&&`enjoy ${hb.split(",")[0].trim()}`].filter(Boolean).join(" and ");
      setGenBio(`I'm ${nm}${lc?`, based in ${lc}`:""} — a ${rl}. I ${ex||"love exploring new things"} and always chasing new experiences. Life's better when you're doing what you love!`);
      setBioEdited(false);
    }finally{setAiLoad(false);}
  };

  const [pubError,setPubError]=useState("");

  /* ── Publish ──
     _isEditing:true  = updating own profile  → API skips username-taken check, does update
     _isEditing:false = new profile creation  → API blocks if username already exists
  */
  const handlePublish=async()=>{
    setSubmitting(true);
    setPubError("");
    const aboutme = genBio||form.bio;
    const origin  = typeof window!=="undefined" ? window.location.origin : "https://mywebsammu.vercel.app";
    const pUrl    = `${origin}/${form.username}`;
    const pObj    = {...form, aboutme, savedAt:new Date().toISOString(), publishedUrl:pUrl};
    // If a saved profile exists with the SAME username → this is an edit, not a new creation
    const isEditing = !!(saved && saved.username === form.username);
    try{
      const res = await fetch("/api/create",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...form, aboutme, _isEditing: isEditing}),
      });
      let data={};
      try{data=await res.json();}catch(_){}
      if(!res.ok){
        setPubError(data?.error||`Error (${res.status})`);
        setSubmitting(false);
        return;
      }
      const finalUrl=data.url||pUrl;
      persist({...pObj,publishedUrl:finalUrl});
      setPubUrl(finalUrl);
      setPubUser(form.username);
      setView("success");
    }catch(e){
      setPubError("Network error — please try again.");
      setSubmitting(false);
    }finally{
      setSubmitting(false);
    }
  };

  /* ── Share / copy ── */
  const getUrl=()=>pubUrl||saved?.publishedUrl||`${typeof window!=="undefined"?window.location.origin:"https://mywebsammu.vercel.app"}/${saved?.username||""}`;

  const copyLink=useCallback(()=>{
    const url=getUrl();
    // Try clipboard API first, fallback to execCommand
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).catch(()=>{
        try{const el=document.createElement("textarea");el.value=url;document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(_){}
      });
    }else{
      try{const el=document.createElement("textarea");el.value=url;document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(_){}
    }
    setCopied(true);setTimeout(()=>setCopied(false),2200);
  },[pubUrl,saved]);

  // Always open our custom share sheet — never the browser/OS native share
  const openShare=()=>{ setShowShare(true); };

  /* ── Delete profile ── */
  const handleDelete=async()=>{
    setDeleting(true);
    try{
      await fetch("/api/delete",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:saved?.username}),
      });
    }catch(_){}
    // Always clear local regardless of server response
    try{localStorage.removeItem("mws_v6");}catch(_){}
    setSaved(null);
    setForm(EMPTY);
    setGenBio("");
    setShowDelete(false);
    setDeleting(false);
    setView("form");
  };

  /* ── Small helpers ── */
  const Lbl=({children,req})=><div className="lbl">{children}{req&&<span style={{color:"#ef4444",marginLeft:3}}>*</span>}</div>;
  const Hint=({icon="fas fa-info-circle",children})=><div className="hint"><i className={icon} style={{color:AC,fontSize:11}}/>{children}</div>;
  const SH=({icon,title,sub})=>(
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
      <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:AC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}><i className={icon}/></div>
      <div><div style={{fontSize:18,fontWeight:800,color:"#111827"}}>{title}</div>{sub&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{sub}</div>}</div>
    </div>
  );
  const NR=({ok=true})=>(
    <div style={{display:"flex",gap:10,marginTop:22}}>
      {step>1&&<button type="button" className="btn btn-s" style={{flex:1}} onClick={()=>setStep(s=>s-1)}><i className="fas fa-arrow-left" style={{fontSize:12}}/> Back</button>}
      {step<5&&<button type="button" className="btn btn-p" style={{flex:2}} onClick={()=>setStep(s=>s+1)} disabled={!ok}>Continue <i className="fas fa-arrow-right" style={{fontSize:12}}/></button>}
    </div>
  );

  /* ════ LOADING ════ */
  if(view==="loading") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f4f5f9"}}>
      <i className="fas fa-spinner spin" style={{fontSize:32,color:AC}}/>
    </div>
  );

  /* ════ DASHBOARD ════ */
  if(view==="dashboard"&&saved){
    const url=saved.publishedUrl||`${typeof window!=="undefined"?window.location.origin:"https://mywebsammu.vercel.app"}/${saved.username}`;
    const date=new Date(saved.savedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
    return(
      <div style={{minHeight:"100vh",background:"#f4f5f9",paddingBottom:48}}>
        {showShare&&<ShareSheet url={url} onClose={()=>setShowShare(false)} onCopy={()=>{navigator.clipboard?.writeText(url).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2200);}}/>}
        <Topbar right={
          <button className="btn btn-s" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>startEdit(saved)}>
            <i className="fas fa-pen" style={{fontSize:11}}/> Edit
          </button>
        }/>
        <div style={{maxWidth:440,margin:"0 auto",padding:"28px 14px 0"}}>
          <div className="card pop" style={{marginBottom:12}}>
            {/* Avatar + name */}
            <div style={{textAlign:"center",paddingBottom:18,marginBottom:18,borderBottom:"1.5px solid #f0f0f5"}}>
              {saved.avatar&&<img src={saved.avatar} alt="av" style={{width:76,height:76,borderRadius:"50%",objectFit:"cover",border:`3px solid ${AC}`,marginBottom:12,display:"block",margin:"0 auto 12px"}}/>}
              <div style={{fontSize:22,fontWeight:800,marginBottom:3}}>{saved.name}</div>
              <div style={{fontSize:13,color:AC,fontWeight:600,marginBottom:saved.location?4:0}}>@{saved.username}</div>
              {saved.location&&<div style={{fontSize:12,color:"#9ca3af"}}><i className="fas fa-location-dot" style={{marginRight:4}}/>{saved.location}</div>}
              <div style={{fontSize:11,color:"#b0b7c3",marginTop:6}}><i className="fas fa-clock" style={{marginRight:4}}/>Updated {date}</div>
            </div>

            {/* URL */}
            <div className="urlbox" style={{marginBottom:16}}>
              <i className="fas fa-globe" style={{color:AC,fontSize:15,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:10,fontWeight:700,color:"#b0b7c3",letterSpacing:"0.06em",marginBottom:2}}>YOUR PROFILE LINK</div>
                <div style={{fontSize:13,fontWeight:600,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <button className="btn btn-p" style={{width:"100%"}} onClick={()=>window.open(url,"_blank")}><i className="fas fa-arrow-up-right-from-square"/> View</button>
              <button className="btn btn-g" style={{width:"100%"}} onClick={openShare}><i className="fas fa-share-nodes"/> Share</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <button className="btn btn-s" style={{width:"100%"}} onClick={()=>{navigator.clipboard?.writeText(url).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2200);}}>
                <i className={`fas fa-${copied?"check":"copy"}`} style={{color:copied?"#10b981":undefined}}/> {copied?"Copied!":"Copy Link"}
              </button>
              <button className="btn btn-s" style={{width:"100%"}} onClick={()=>startEdit(saved)}><i className="fas fa-pen"/> Edit Profile</button>
            </div>
            {/* Delete */}
            {!showDelete?(
              <button className="btn" style={{width:"100%",background:"transparent",color:"#ef4444",border:"1.5px solid #fca5a5",fontSize:13,padding:"9px 16px"}}
                onClick={()=>setShowDelete(true)}>
                <i className="fas fa-trash"/> Delete Profile
              </button>
            ):(
              <div style={{background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:12,padding:"16px",textAlign:"center"}}>
                <div style={{fontWeight:700,color:"#b91c1c",marginBottom:6}}>Delete this profile?</div>
                <div style={{fontSize:13,color:"#6b7280",marginBottom:14}}>This will permanently remove your profile. This cannot be undone.</div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-s" style={{flex:1,fontSize:13}} onClick={()=>setShowDelete(false)}>Cancel</button>
                  <button className="btn" style={{flex:1,fontSize:13,background:"#ef4444",color:"#fff"}}
                    onClick={handleDelete} disabled={deleting}>
                    {deleting?<><i className="fas fa-spinner spin"/> Deleting...</>:<><i className="fas fa-trash"/> Yes, Delete</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  /* ════ SUCCESS ════ */
  if(view==="success"){
    const url=getUrl();
    return(
      <div style={{minHeight:"100vh",background:"#f4f5f9",display:"flex",flexDirection:"column"}}>
        {showShare&&<ShareSheet url={url} onClose={()=>setShowShare(false)} onCopy={copyLink}/>}
        <Topbar/>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
          <div style={{maxWidth:420,width:"100%"}}>
            <div style={{position:"relative",height:40,overflow:"hidden"}}>
              {["#6C63FF","#10b981","#f59e0b","#ef4444","#0ea5e9","#ec4899","#f97316"].map((c,i)=>(
                <div key={i} className="confetti" style={{background:c,left:`${8+i*13}%`,top:0,animationDelay:`${i*.1}s`}}/>
              ))}
            </div>
            <div className="card pop" style={{textAlign:"center",padding:"36px 24px"}}>
              <div className="sring"><i className="fas fa-check" style={{color:"#fff",fontSize:36}}/></div>
              <h2 style={{fontSize:24,fontWeight:800,marginBottom:8}}>{saved?.savedAt?"Profile Updated!":"Profile Created!"}</h2>
              <p style={{color:"#6b7280",fontSize:14,lineHeight:1.7,marginBottom:20}}>
                Live at <strong style={{color:AC}}>mywebsam.site/{pubUser}</strong>
              </p>
              <div className="urlbox" style={{marginBottom:16}}>
                <i className="fas fa-globe" style={{color:AC,fontSize:13,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{url}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <button className="btn btn-p" style={{width:"100%"}} onClick={()=>window.open(url,"_blank")}><i className="fas fa-arrow-up-right-from-square"/> View</button>
                <button className="btn btn-g" style={{width:"100%"}} onClick={openShare}><i className="fas fa-share-nodes"/> Share</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <button className="btn btn-s" style={{width:"100%"}} onClick={copyLink}>
                  <i className={`fas fa-${copied?"check":"copy"}`} style={{color:copied?"#10b981":undefined}}/> {copied?"Copied!":"Copy Link"}
                </button>
                <button className="btn btn-s" style={{width:"100%"}} onClick={()=>setView("dashboard")}><i className="fas fa-home"/> Dashboard</button>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  /* ════ FORM ════ */
  return(
    <div style={{minHeight:"100vh",background:"#f4f5f9",paddingBottom:48}}>
      {showShare&&<ShareSheet url={getUrl()} onClose={()=>setShowShare(false)} onCopy={copyLink}/>}
      <Topbar right={
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {saved&&<button className="btn btn-gh" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setView("dashboard")}><i className="fas fa-arrow-left" style={{fontSize:11}}/> Dashboard</button>}
          <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>{score}%</span>
          <div style={{width:52,height:5,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${score}%`,height:"100%",background:score>=80?"#10b981":AC,borderRadius:99,transition:"width .4s"}}/>
          </div>
        </div>
      }/>

      <div style={{maxWidth:600,margin:"0 auto",padding:"22px 14px 12px"}}>
        {/* Step dots */}
        <div style={{display:"flex",alignItems:"flex-start",gap:4,marginBottom:22}}>
          {STEPS.map((lbl,i)=>{
            const s=i+1,st=step>s?"done":step===s?"active":"idle";
            return(
              <div key={s} style={{display:"flex",alignItems:"center",flex:s<5?1:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div className={`sdot ${st}`}>{st==="done"?<i className="fas fa-check" style={{fontSize:10}}/>:s}</div>
                  <span className={`slbl ${st}`}>{lbl}</span>
                </div>
                {s<5&&<div style={{flex:1,height:2,margin:"0 3px",marginBottom:18,borderRadius:1,background:step>s?"#10b981":"#e9eaf0",transition:"background .3s"}}/>}
              </div>
            );
          })}
        </div>

        {/* ─── STEP 1 ─── */}
        {step===1&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SH icon="fas fa-user-circle" title="About You" sub="Let's start with the basics."/>
              <div style={{marginBottom:14}}>
                <Lbl req>Username</Lbl>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#adb5c0",fontSize:14,pointerEvents:"none"}}>@</span>
                  <input className="inp" style={{paddingLeft:27}} placeholder="yourname" value={form.username} onChange={e=>setField("username",e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,""))}/>
                </div>
                {form.username&&<Hint>mywebsam.site/<strong style={{color:AC}}>{form.username}</strong></Hint>}
                {saved?.username&&form.username!==saved.username&&<Hint icon="fas fa-triangle-exclamation">Changing username will update your profile link.</Hint>}
              </div>
              <div style={{marginBottom:14}}>
                <Lbl req>Full Name</Lbl>
                <input className="inp" placeholder="Your full name" value={form.name} onChange={e=>setField("name",e.target.value)}/>
              </div>
              <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div><Lbl>Date of Birth</Lbl><input className="inp" type="date" value={form.dob} onChange={e=>setField("dob",e.target.value)}/></div>
                <div><Lbl>Location</Lbl><input className="inp" placeholder="City, Country" value={form.location} onChange={e=>setField("location",e.target.value)}/></div>
              </div>
              <div>
                <Lbl>Short Bio <span style={{color:"#adb5c0",fontWeight:400,textTransform:"none",fontSize:11}}>(or generate with AI in step 2)</span></Lbl>
                <textarea className="inp" rows={3} placeholder="Say something about yourself..." value={form.bio} onChange={e=>setField("bio",e.target.value)} style={{resize:"vertical",lineHeight:1.6}}/>
                <div className={`cc${form.bio.length>180?" o":form.bio.length>140?" w":""}`}>{form.bio.length}/200</div>
              </div>
            </div>
            <div className="card">
              <Lbl>Profile Photo</Lbl>
              <div style={{display:"flex",alignItems:"center",gap:14,padding:14,borderRadius:12,cursor:"pointer",border:`2px dashed ${dragOver?"#6C63FF":form.avatar?"#6C63FF":"#e5e7eb"}`,background:dragOver?"#f2f0ff":form.avatar?"#f8f7ff":"#fafafa",transition:"all .2s"}}
                onClick={()=>fileRef.current?.click()} onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);processImg(e.dataTransfer.files[0]);}}>
                {form.avatar?(
                  <>
                    <img src={form.avatar} alt="av" style={{width:62,height:62,borderRadius:"50%",objectFit:"cover",border:`2.5px solid ${AC}`,flexShrink:0}}/>
                    <div style={{flex:1}}><div style={{fontWeight:600,marginBottom:2}}>Looking great!</div><div style={{fontSize:13,color:"#6b7280"}}>Click to change</div></div>
                    <button type="button" className="btn btn-d" onClick={e=>{e.stopPropagation();setField("avatar","");}}><i className="fas fa-trash"/></button>
                  </>
                ):(
                  <>
                    <div style={{width:62,height:62,borderRadius:"50%",background:"#ede9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:AC,flexShrink:0}}>
                      {uploading?<i className="fas fa-spinner spin"/>:<i className="fas fa-camera"/>}
                    </div>
                    <div><div style={{fontWeight:600,marginBottom:2}}>{uploading?"Uploading...":"Add a Photo"}</div><div style={{fontSize:13,color:"#6b7280"}}>Click or drag & drop</div><div style={{fontSize:11,color:"#adb5c0",marginTop:2}}>PNG, JPG, GIF · Saved locally</div></div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>processImg(e.target.files[0])}/>
            </div>
            <NR ok={!!form.username&&!!form.name}/>
          </div>
        )}

        {/* ─── STEP 2 ─── */}
        {step===2&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SH icon="fas fa-face-smile" title="Your Vibe & Interests" sub="Search and pick — sports, hobbies, skills, passions and more."/>

              {/* Roles */}
              <div style={{marginBottom:16}}>
                <Lbl>I am a...</Lbl>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {ROLES.map(r=>{
                    const on=form.interests.role===r.v;
                    return(
                      <button key={r.v} type="button" className={`tag${on?" on":""}`} style={{borderRadius:10}} onClick={()=>setRole(r.v)}>
                        <i className={RI[r.v]||"fas fa-star"} style={{width:13,textAlign:"center"}}/>{r.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Searchable sections */}
              {[
                {cat:"vibes",   label:"My Vibe",              items:ALL_VIBES},
                {cat:"sports",  label:"Sports I Love",         items:ALL_SPORTS},
                {cat:"hobbies", label:"Hobbies",               items:ALL_HOBBIES},
                {cat:"music",   label:"Music I Love",          items:ALL_MUSIC},
                {cat:"passions",label:"Things I Care About",   items:ALL_PASSIONS},
                {cat:"skills",  label:"Skills & Tools",        items:ALL_SKILLS},
              ].map((sec,idx)=>(
                <div key={sec.cat}>
                  <div className="divider"/>
                  <SearchableTags
                    label={sec.label}
                    items={sec.items}
                    selected={form.interests[sec.cat]}
                    onToggle={(val)=>toggleTag(sec.cat,val)}
                  />
                </div>
              ))}
            </div>

            {/* AI bio */}
            <div className="card">
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <Lbl>AI Bio Generator</Lbl>
                <div className="aibadge"><i className="fas fa-bolt"/> expo.1 · Groq AI</div>
              </div>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:12}}>Select your interests above, then generate a personalised bio.</p>
              <button type="button" className="btn btn-g" style={{width:"100%"}} onClick={generateBio} disabled={aiLoad}>
                {aiLoad?<><i className="fas fa-spinner spin"/> Generating...</>:<><i className="fas fa-wand-magic-sparkles"/> Generate My Bio</>}
              </button>
              {genBio&&(
                <div style={{marginTop:14,borderTop:"1px solid #f0edff",paddingTop:14}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
                    <div className="aibadge"><i className="fas fa-robot"/> expo.1 Generated</div>
                    <button type="button" style={{background:"none",border:"none",fontSize:12,color:AC,cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0}} onClick={generateBio} disabled={aiLoad}>
                      <i className="fas fa-redo" style={{marginRight:4,fontSize:10}}/>Regenerate
                    </button>
                  </div>
                  <textarea className="inp" rows={3} value={genBio} onChange={e=>{setGenBio(e.target.value);setBioEdited(true);}} style={{resize:"vertical",lineHeight:1.6}}/>
                  {bioEdited&&<Hint icon="fas fa-pencil">Edited — your version will be saved.</Hint>}
                </div>
              )}
            </div>
            <NR/>
          </div>
        )}

        {/* ─── STEP 3 ─── */}
        {step===3&&(
          <div className="fu">
            <div className="card">
              <SH icon="fas fa-share-nodes" title="Social Profiles" sub="Only filled ones appear on your page."/>
              <div className="sg" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8}}>
                {SL.map(p=>{
                  const m=SM[p.n]||{i:"fas fa-link",c:"#6b7280",b:"#f9fafb"};
                  const val=form.socialProfiles[p.n]||"";
                  return(
                    <div key={p.n} className="sc">
                      <div style={{width:32,height:32,borderRadius:8,background:m.b,color:m.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}><i className={m.i}/></div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#adb5c0",letterSpacing:".05em",marginBottom:2}}>{p.l.toUpperCase()}</div>
                        <input className="sc-inp" placeholder={p.p} value={val} onChange={e=>setSocial(p.n,e.target.value)}/>
                      </div>
                      {val&&<i className="fas fa-circle-check" style={{color:"#10b981",fontSize:13}}/>}
                    </div>
                  );
                })}
              </div>
            </div>
            <NR/>
          </div>
        )}

        {/* ─── STEP 4 ─── */}
        {step===4&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SH icon="fas fa-link" title="Your Links" sub="Portfolio, shop, blog, project — anything."/>
              <div style={{background:"#f8f7ff",border:"1.5px solid #ede9ff",borderRadius:12,padding:14,marginBottom:16}}>
                <Lbl>Add a Link</Lbl>
                <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                  <input className="inp" style={{flex:"0 0 138px",minWidth:0}} placeholder="Label" value={newLink.title} onChange={e=>setNewLink(p=>({...p,title:e.target.value}))}/>
                  <input className="inp" style={{flex:1,minWidth:130}} placeholder="https://..." value={newLink.url} onChange={e=>setNewLink(p=>({...p,url:e.target.value}))}/>
                </div>
                <div style={{marginBottom:10}}>
                  <button type="button" className="btn btn-gh" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setShowIconP(v=>!v)}>
                    <i className={newLink.icon}/> Icon <i className={`fas fa-chevron-${showIconP?"up":"down"}`} style={{fontSize:10}}/>
                  </button>
                  {showIconP&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8,maxHeight:160,overflowY:"auto",padding:2}}>
                      {LI.map(ic=>(
                        <button key={ic} type="button"
                          style={{width:36,height:36,borderRadius:8,border:`1.5px solid ${newLink.icon===ic?"#6C63FF":"#e5e7eb"}`,background:newLink.icon===ic?"#f0edff":"#fff",color:newLink.icon===ic?"#6C63FF":"#6b7280",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                          onClick={()=>{setNewLink(p=>({...p,icon:ic}));setShowIconP(false);}}>
                          <i className={ic}/>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" className="btn btn-p" style={{width:"100%"}} onClick={addLink}><i className="fas fa-plus"/> Add Link</button>
              </div>
              {form.links.length===0?(
                <div style={{textAlign:"center",padding:"24px",color:"#adb5c0"}}><i className="fas fa-link" style={{fontSize:24,marginBottom:8,display:"block"}}/><div style={{fontSize:14}}>No links yet.</div></div>
              ):(
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Lbl>Your Links ({form.links.length})</Lbl>
                    <span style={{fontSize:11,color:"#adb5c0"}}>↑↓ to reorder</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {form.links.map((lnk,idx)=>(
                      <div key={lnk.id} className="lr">
                        <div style={{display:"flex",flexDirection:"column",gap:1}}>
                          <button type="button" style={{background:"none",border:"none",fontSize:10,padding:"2px 4px",color:idx===0?"#e5e7eb":"#9ca3af",cursor:idx===0?"default":"pointer"}} onClick={()=>mvLink(idx,-1)}><i className="fas fa-chevron-up"/></button>
                          <button type="button" style={{background:"none",border:"none",fontSize:10,padding:"2px 4px",color:idx===form.links.length-1?"#e5e7eb":"#9ca3af",cursor:idx===form.links.length-1?"default":"pointer"}} onClick={()=>mvLink(idx,1)}><i className="fas fa-chevron-down"/></button>
                        </div>
                        <div style={{width:32,height:32,borderRadius:8,background:"#f0edff",color:AC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}><i className={lnk.icon}/></div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14}}>{lnk.title}</div>
                          <div style={{fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lnk.url}</div>
                        </div>
                        <a href={lnk.url} target="_blank" rel="noreferrer" style={{padding:"4px 8px",color:"#9ca3af",textDecoration:"none",fontSize:12}} onClick={e=>e.stopPropagation()}><i className="fas fa-arrow-up-right-from-square"/></a>
                        <button type="button" className="btn btn-d" onClick={()=>rmLink(lnk.id)}><i className="fas fa-trash"/></button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <NR/>
          </div>
        )}

        {/* ─── STEP 5 ─── */}
        {step===5&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SH icon="fas fa-rocket" title={saved?"Update Profile":"Ready to Publish?"} sub="Check your checklist and go live."/>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {checklist.map(item=>(
                  <div key={item.t} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:item.d?"#f0fdf4":"#fafafa",border:`1.5px solid ${item.d?"#bbf7d0":"#e9eaf0"}`,borderRadius:10}}>
                    <i className={item.d?"fas fa-circle-check":"far fa-circle"} style={{color:item.d?"#10b981":"#d1d5db",fontSize:16,flexShrink:0}}/>
                    <span style={{fontSize:14,fontWeight:item.d?600:400,color:item.d?"#065f46":"#9ca3af",flex:1}}>{item.t}</span>
                    {item.d&&<i className="fas fa-check" style={{color:"#10b981",fontSize:11}}/>}
                  </div>
                ))}
              </div>
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>Completeness</span>
                  <span style={{fontSize:12,fontWeight:700,color:score>=80?"#10b981":AC}}>{score}%</span>
                </div>
                <div style={{height:8,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
                  <div style={{width:`${score}%`,height:"100%",background:score>=80?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#6C63FF,#818cf8)",borderRadius:99,transition:"width .5s"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button type="button" className="btn btn-s" style={{flex:1}} onClick={()=>setStep(4)}><i className="fas fa-arrow-left" style={{fontSize:12}}/> Back</button>
                <button type="button" className="btn btn-p" style={{flex:2}} onClick={handlePublish} disabled={submitting||!form.username||!form.name}>
                  {submitting?<><i className="fas fa-spinner spin"/> {saved?"Updating...":"Publishing..."}</>:<><i className="fas fa-rocket"/> {saved?"Update Profile":"Publish Profile"}</>}
                </button>
              </div>
              {(!form.username||!form.name)&&<div style={{marginTop:10,fontSize:13,color:"#ef4444",textAlign:"center"}}><i className="fas fa-triangle-exclamation" style={{marginRight:5}}/>Username and name are required.</div>}
              {pubError&&(
                <div style={{marginTop:12,padding:"12px 14px",background:"#fef2f2",border:"1.5px solid #fca5a5",borderRadius:10,fontSize:13,color:"#dc2626"}}>
                  <i className="fas fa-circle-xmark" style={{marginRight:7}}/><strong>Error:</strong> {pubError}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
