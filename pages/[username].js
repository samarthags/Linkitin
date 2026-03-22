// pages/[username].js
import Head from "next/head";
import { useState } from "react";
import clientPromise from "../lib/mongodb";

/* ── Platform map ── */
const PLAT = {
  email:        { i:"fas fa-envelope",      c:"#EA4335", bg:"#fef2f2", u:(v)=>`mailto:${v}`,                                    n:"Email" },
  whatsapp:     { i:"fab fa-whatsapp",       c:"#25D366", bg:"#edfaf3", u:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,          n:"WhatsApp" },
  instagram:    { i:"fab fa-instagram",      c:"#E4405F", bg:"#fdf2f4", u:(v)=>`https://instagram.com/${v.replace("@","")}`,    n:"Instagram" },
  facebook:     { i:"fab fa-facebook-f",     c:"#1877F2", bg:"#eef4ff", u:(v)=>`https://facebook.com/${v}`,                     n:"Facebook" },
  github:       { i:"fab fa-github",         c:"#24292e", bg:"#f6f8fa", u:(v)=>`https://github.com/${v}`,                       n:"GitHub" },
  snapchat:     { i:"fab fa-snapchat",       c:"#b8a000", bg:"#fffce8", u:(v)=>`https://snapchat.com/add/${v}`,                 n:"Snapchat" },
  youtube:      { i:"fab fa-youtube",        c:"#FF0000", bg:"#fff2f2", u:(v)=>`https://youtube.com/${v}`,                      n:"YouTube" },
  twitter:      { i:"fab fa-x-twitter",      c:"#000",    bg:"#f5f5f5", u:(v)=>`https://twitter.com/${v.replace("@","")}`,      n:"Twitter" },
  linkedin:     { i:"fab fa-linkedin-in",    c:"#0A66C2", bg:"#e8f3fc", u:(v)=>`https://linkedin.com/in/${v}`,                  n:"LinkedIn" },
  tiktok:       { i:"fab fa-tiktok",         c:"#010101", bg:"#f5f5f5", u:(v)=>`https://tiktok.com/@${v.replace("@","")}`,      n:"TikTok" },
  discord:      { i:"fab fa-discord",        c:"#5865F2", bg:"#eef0ff", u:(v)=>`https://discord.com/users/${v}`,                n:"Discord" },
  telegram:     { i:"fab fa-telegram",       c:"#26A5E4", bg:"#edf7fd", u:(v)=>`https://t.me/${v.replace("@","")}`,             n:"Telegram" },
  twitch:       { i:"fab fa-twitch",         c:"#9146FF", bg:"#f3eeff", u:(v)=>`https://twitch.tv/${v}`,                        n:"Twitch" },
  spotify:      { i:"fab fa-spotify",        c:"#1DB954", bg:"#edfaf3", u:(v)=>`https://open.spotify.com/user/${v}`,            n:"Spotify" },
  pinterest:    { i:"fab fa-pinterest",      c:"#E60023", bg:"#fff0f1", u:(v)=>`https://pinterest.com/${v}`,                    n:"Pinterest" },
  reddit:       { i:"fab fa-reddit-alien",   c:"#FF4500", bg:"#fff2ed", u:(v)=>`https://reddit.com/user/${v}`,                  n:"Reddit" },
  medium:       { i:"fab fa-medium",         c:"#000",    bg:"#f5f5f5", u:(v)=>`https://medium.com/${v.replace("@","")}`,       n:"Medium" },
  devto:        { i:"fab fa-dev",            c:"#0a0a0a", bg:"#f5f5f5", u:(v)=>`https://dev.to/${v}`,                           n:"DEV.to" },
  behance:      { i:"fab fa-behance",        c:"#1769FF", bg:"#eef2ff", u:(v)=>`https://behance.net/${v}`,                      n:"Behance" },
  dribbble:     { i:"fab fa-dribbble",       c:"#ea4c89", bg:"#fdf0f5", u:(v)=>`https://dribbble.com/${v}`,                     n:"Dribbble" },
  threads:      { i:"fab fa-threads",        c:"#000",    bg:"#f5f5f5", u:(v)=>`https://threads.net/${v.replace("@","")}`,      n:"Threads" },
  bluesky:      { i:"fas fa-cloud",          c:"#1185FE", bg:"#eef6ff", u:(v)=>`https://bsky.app/profile/${v.replace("@","")}`, n:"Bluesky" },
  npm:          { i:"fab fa-npm",            c:"#CC3534", bg:"#fff0f0", u:(v)=>`https://npmjs.com/~${v.replace("~","")}`,       n:"npm" },
  codepen:      { i:"fab fa-codepen",        c:"#111",    bg:"#f5f5f5", u:(v)=>`https://codepen.io/${v}`,                       n:"CodePen" },
  stackoverflow:{ i:"fab fa-stack-overflow", c:"#F58025", bg:"#fff4ed", u:(v)=>`https://stackoverflow.com/users/${v}`,          n:"Stack Overflow" },
};

function calcAge(dob) {
  if (!dob) return null;
  const t = new Date(), b = new Date(dob);
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a > 0 ? a : null;
}

/* ── Share Sheet — custom bottom sheet, NO navigator.share ── */
function ShareSheet({ url, name, onClose }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  async function copyUrl() {
    try { await navigator.clipboard.writeText(url); }
    catch (_) {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.position = "fixed"; el.style.opacity = "0";
      document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const opts = [
    { label:"Copy Link",  icon:"fas fa-copy",          bg:"#f0edff",fg:"#6C63FF", fn: copyUrl },
    { label:"WhatsApp",   icon:"fab fa-whatsapp",       bg:"#edfaf3",fg:"#25D366", fn:()=>window.open(`https://wa.me/?text=${enc(name+" — "+url)}`) },
    { label:"Telegram",   icon:"fab fa-telegram",       bg:"#edf7fd",fg:"#26A5E4", fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(name)}`) },
    { label:"Twitter",    icon:"fab fa-x-twitter",      bg:"#f5f5f5",fg:"#000",    fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc("Check out "+name+"'s profile! "+url)}`) },
    { label:"Facebook",   icon:"fab fa-facebook-f",     bg:"#eef4ff",fg:"#1877F2", fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`) },
    { label:"LinkedIn",   icon:"fab fa-linkedin-in",    bg:"#e8f3fc",fg:"#0A66C2", fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}`) },
    { label:"Reddit",     icon:"fab fa-reddit-alien",   bg:"#fff2ed",fg:"#FF4500", fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}&title=${enc(name)}`) },
    { label:"Email",      icon:"fas fa-envelope",       bg:"#fef2f2",fg:"#EA4335", fn:()=>window.open(`mailto:?subject=${enc(name+"'s profile")}&body=${enc(url)}`) },
    { label:"SMS",        icon:"fas fa-comment-sms",    bg:"#f0fdf4",fg:"#10b981", fn:()=>window.open(`sms:?body=${enc(name+"'s profile: "+url)}`) },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed",inset:0,
        background:"rgba(0,0,0,0.5)",
        zIndex:1000,
        display:"flex",alignItems:"flex-end",justifyContent:"center",
        backdropFilter:"blur(2px)",
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"#fff",
          borderRadius:"24px 24px 0 0",
          width:"100%",maxWidth:520,
          paddingBottom:40,
          animation:"slideUp .28s cubic-bezier(.34,1.4,.64,1) both",
        }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}`}</style>

        {/* Drag handle */}
        <div style={{display:"flex",justifyContent:"center",padding:"14px 0 4px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#e5e7eb"}}/>
        </div>

        {/* Header */}
        <div style={{padding:"12px 20px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #f3f4f6"}}>
          <div>
            <div style={{fontWeight:800,fontSize:17,color:"#111827"}}>Share Profile</div>
            <div style={{fontSize:12,color:"#9ca3af",marginTop:2,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {url}
            </div>
          </div>
          <button onClick={onClose} style={{
            width:34,height:34,borderRadius:"50%",
            background:"#f3f4f6",border:"none",
            fontSize:18,color:"#6b7280",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            outline:"none",WebkitTapHighlightColor:"transparent",
          }}>×</button>
        </div>

        {/* Options grid */}
        <div style={{padding:"16px 12px 0",display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
          {opts.map(o => (
            <button key={o.label} onClick={o.fn} style={{
              display:"flex",flexDirection:"column",alignItems:"center",gap:6,
              width:74,padding:"10px 6px",
              border:"none",background:"transparent",
              cursor:"pointer",borderRadius:14,
              outline:"none",WebkitTapHighlightColor:"transparent",
              transition:"background .12s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{
                width:52,height:52,borderRadius:16,
                background:o.bg,color:o.fg,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:22,
              }}>
                {o.label==="Copy Link" && copied
                  ? <i className="fas fa-check" style={{color:"#10b981"}}/>
                  : <i className={o.icon}/>}
              </div>
              <span style={{fontSize:11,fontWeight:600,color:"#374151",textAlign:"center",lineHeight:1.2}}>
                {o.label==="Copy Link" && copied ? "Copied!" : o.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function ProfilePage({ user, pageUrl }) {
  const [shareOpen, setShareOpen] = useState(false);

  /* 404 page */
  if (!user) {
    return (
      <>
        <Head>
          <title>Not Found | mywebsam</title>
          <meta name="robots" content="noindex"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#f4f5f9;}`}</style>
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#fef2f2",border:"2px solid #fca5a5",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:32,color:"#ef4444"}}>
            <i className="fas fa-user-slash"/>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,marginBottom:8,color:"#111827"}}>Profile Not Found</h1>
          <p style={{color:"#6b7280",marginBottom:28,fontSize:14,lineHeight:1.6}}>This username doesn't exist yet.</p>
          <a href="/" style={{background:"#6C63FF",color:"#fff",padding:"12px 28px",borderRadius:999,fontWeight:700,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(108,99,255,.3)",textDecoration:"none",outline:"none",WebkitTapHighlightColor:"transparent"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const userAge      = calcAge(user.dob);
  const socials      = Object.entries(user.socialProfiles || {}).filter(([,v]) => v?.trim()).filter(([k]) => PLAT[k]);
  const interestTags = Object.values(user.interests || {}).flat().filter(v => v && typeof v === "string").slice(0, 16);
  const bioText      = user.aboutme || user.bio || "";
  const pageTitle    = `${user.name} | mywebsam`;
  const ogImage      = user.avatar || "";

  return (
    <>
      <Head>
        {/* ── Primary meta ── */}
        <title>{pageTitle}</title>
        <meta name="description" content={bioText || `${user.name}'s link in bio — mywebsam`}/>
        <meta name="viewport"    content="width=device-width,initial-scale=1"/>
        <meta name="theme-color" content="#f4f5f9"/>

        {/* ── Open Graph ── */}
        <meta property="og:type"        content="profile"/>
        <meta property="og:title"       content={pageTitle}/>
        <meta property="og:description" content={bioText || `${user.name}'s links on mywebsam`}/>
        <meta property="og:url"         content={pageUrl}/>
        <meta property="og:site_name"   content="mywebsam"/>
        {ogImage && <meta property="og:image"       content={ogImage}/>}
        {ogImage && <meta property="og:image:width"  content="400"/>}
        {ogImage && <meta property="og:image:height" content="400"/>}

        {/* ── Twitter Card ── */}
        <meta name="twitter:card"        content={ogImage ? "summary_large_image" : "summary"}/>
        <meta name="twitter:title"       content={pageTitle}/>
        <meta name="twitter:description" content={bioText || `${user.name}'s links on mywebsam`}/>
        {ogImage && <meta name="twitter:image" content={ogImage}/>}

        {/* ── Fonts & Icons ── */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

        <style>{`
          /* ── Reset ── */
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{
            font-family:'Plus Jakarta Sans',sans-serif;
            background:#eeeef0;
            min-height:100vh;
          }

          /* ── Keyframes ── */
          @keyframes cardIn{from{opacity:0;transform:translateY(28px)scale(.97);}to{opacity:1;transform:translateY(0)scale(1);}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
          @keyframes slideUp{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}

          /* ── Page layout ── */
          .page-wrap{
            min-height:100vh;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:flex-start;
            padding:24px 16px 60px;
          }

          /* ── THE CARD — this is the Linktree card ── */
          .profile-card{
            width:100%;
            max-width:420px;
            background:#fff;
            border-radius:28px;
            overflow:hidden;
            box-shadow:
              0 2px 4px rgba(0,0,0,.04),
              0 8px 24px rgba(0,0,0,.08),
              0 24px 48px rgba(0,0,0,.06);
            animation:cardIn .45s cubic-bezier(.22,.68,0,1.15) both;
          }

          /* ── Photo fills top of card ── */
          .card-photo{
            width:100%;
            aspect-ratio:4/3;
            position:relative;
            overflow:hidden;
            background:linear-gradient(135deg,#e0e7ff,#f5d0fe);
          }
          .card-photo img{
            width:100%;height:100%;
            object-fit:cover;
            object-position:center 15%;
            display:block;
          }
          /* subtle gradient at bottom of photo to blend into white card */
          .card-photo::after{
            content:"";
            position:absolute;bottom:0;left:0;right:0;
            height:40%;
            background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.15));
            pointer-events:none;
          }
          /* placeholder when no photo */
          .card-photo-ph{
            width:100%;height:180px;
            background:linear-gradient(135deg,#e0e7ff 0%,#fce7f3 100%);
            display:flex;align-items:center;justify-content:center;
          }
          .av-ph-large{
            width:88px;height:88px;border-radius:50%;
            background:linear-gradient(135deg,#6C63FF,#a78bfa);
            display:flex;align-items:center;justify-content:center;
            font-size:36px;font-weight:800;color:#fff;
            border:4px solid #fff;
            box-shadow:0 4px 16px rgba(108,99,255,.3);
          }

          /* ── Card body ── */
          .card-body{padding:20px 20px 24px;}

          /* ── Name, handle, bio ── */
          .c-name{
            font-size:clamp(22px,5.5vw,28px);
            font-weight:800;
            color:#111827;
            letter-spacing:-0.025em;
            line-height:1.1;
            text-align:center;
            margin-bottom:4px;
            animation:fadeUp .4s .1s ease both;
          }
          .c-handle{
            font-size:13px;color:#9ca3af;
            font-weight:500;text-align:center;
            margin-bottom:10px;
            animation:fadeUp .4s .13s ease both;
          }
          .c-meta{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:7px;
            margin-bottom:12px;
            animation:fadeUp .4s .15s ease both;
          }
          .c-chip{
            display:inline-flex;align-items:center;gap:5px;
            font-size:11.5px;color:#6b7280;
            background:#f4f5f9;
            padding:4px 11px;border-radius:999px;
            font-weight:500;
          }
          .c-bio{
            font-size:13.5px;color:#6b7280;
            line-height:1.7;text-align:center;
            max-width:320px;margin:0 auto 16px;
            animation:fadeUp .4s .17s ease both;
          }

          /* ── Divider ── */
          .c-divider{height:1px;background:#f3f4f6;margin:0 0 16px;}

          /* ── Social icons — colored circles ── */
          .c-socials{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:10px;
            margin-bottom:18px;
            animation:fadeUp .4s .2s ease both;
          }
          .c-soc{
            width:44px;height:44px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
            transition:transform .14s,box-shadow .14s;
            flex-shrink:0;
          }
          .c-soc:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 6px 16px rgba(0,0,0,.15);}
          .c-soc:active{transform:scale(.94);}

          /* ── Link buttons — full width, rounded, subtle ── */
          .c-links{
            display:flex;flex-direction:column;
            gap:10px;
            animation:fadeUp .4s .23s ease both;
          }
          .c-lbtn{
            display:flex;align-items:center;
            width:100%;min-height:54px;
            padding:0;
            background:#f7f8fa;
            border:1.5px solid #f0f0f5;
            border-radius:14px;
            cursor:pointer;
            transition:background .14s,transform .13s,box-shadow .14s,border-color .14s;
            overflow:hidden;
            position:relative;
          }
          .c-lbtn:hover{
            background:#f0edff;
            border-color:#c4b5fd;
            transform:translateY(-2px);
            box-shadow:0 6px 20px rgba(108,99,255,.14);
          }
          .c-lbtn:active{transform:scale(.98);}
          .c-lbtn-ico{
            width:54px;min-height:54px;
            display:flex;align-items:center;justify-content:center;
            font-size:16px;color:#6C63FF;
            flex-shrink:0;
          }
          .c-lbtn-txt{
            flex:1;text-align:center;
            font-size:14.5px;font-weight:700;
            color:#111827;padding:0 12px;
          }
          .c-lbtn-arr{
            width:42px;min-height:54px;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;color:#d1d5db;flex-shrink:0;
          }

          /* ── Spotify ── */
          .c-spotify{
            margin-top:16px;
            animation:fadeUp .4s .28s ease both;
          }
          .c-sec-lbl{
            display:flex;align-items:center;justify-content:center;
            gap:6px;margin-bottom:10px;
            font-size:10.5px;font-weight:700;
            letter-spacing:.08em;text-transform:uppercase;
            color:#9ca3af;
          }
          .c-sp-frame{border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);}

          /* ── Interests ── */
          .c-interests{
            margin-top:16px;
            animation:fadeUp .4s .31s ease both;
          }
          .c-int-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;}
          .c-itag{
            padding:6px 13px;border-radius:999px;
            font-size:12px;font-weight:600;
            color:#6b7280;
            background:#f4f5f9;
            border:1px solid #e9eaf0;
            transition:background .12s,border-color .12s;
          }
          .c-itag:hover{background:#f0edff;border-color:#c4b5fd;color:#6C63FF;}

          /* ── Footer inside card ── */
          .c-footer{
            text-align:center;padding:20px 0 0;
            font-size:12px;color:#c4b5c8;
            animation:fadeUp .4s .35s ease both;
          }
          .c-footer a{color:#a78bfa;font-weight:700;}
          .c-footer a:hover{color:#6C63FF;}
          .c-footer-logo{display:inline-flex;align-items:center;gap:5px;margin-bottom:3px;}

          /* ── Share FAB — floats top right ── */
          .share-fab{
            position:fixed;top:16px;right:16px;
            width:44px;height:44px;border-radius:50%;
            background:rgba(255,255,255,.92);
            border:1.5px solid rgba(0,0,0,.08);
            box-shadow:0 2px 12px rgba(0,0,0,.12);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;color:#374151;
            cursor:pointer;z-index:80;
            transition:background .14s,transform .12s,box-shadow .14s;
            backdrop-filter:blur(8px);
          }
          .share-fab:hover{background:#fff;transform:scale(1.06);box-shadow:0 4px 18px rgba(0,0,0,.15);}
          .share-fab:active{transform:scale(.94);}

          /* ── Responsive ── */
          @media(max-width:460px){
            .page-wrap{padding:16px 12px 48px;}
            .profile-card{border-radius:22px;}
            .card-body{padding:16px 16px 20px;}
            .c-name{font-size:22px;}
            .c-lbtn-txt{font-size:14px;}
            .c-soc{width:40px;height:40px;font-size:16px;}
          }
        `}</style>
      </Head>

      {/* Share FAB */}
      <button className="share-fab" onClick={() => setShareOpen(true)} aria-label="Share profile">
        <i className="fas fa-share-nodes"/>
      </button>

      <div className="page-wrap">
        <div className="profile-card">

          {/* ── Photo fills top of card ── */}
          {user.avatar ? (
            <div className="card-photo">
              <img src={user.avatar} alt={user.name}/>
            </div>
          ) : (
            <div className="card-photo-ph">
              <div className="av-ph-large">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            </div>
          )}

          {/* ── Card body ── */}
          <div className="card-body">

            {/* Name */}
            <div className="c-name">{user.name}</div>
            <div className="c-handle">@{user.username}</div>

            {/* Meta chips */}
            {(user.location || userAge) && (
              <div className="c-meta">
                {user.location && (
                  <span className="c-chip">
                    <i className="fas fa-location-dot" style={{fontSize:10,color:"#6C63FF"}}/>
                    {user.location}
                  </span>
                )}
                {userAge && (
                  <span className="c-chip">
                    <i className="fas fa-cake-candles" style={{fontSize:10,color:"#f59e0b"}}/>
                    {userAge} years old
                  </span>
                )}
              </div>
            )}

            {/* Bio */}
            {bioText && <p className="c-bio">{bioText}</p>}

            <div className="c-divider"/>

            {/* Social icons — colored filled circles */}
            {socials.length > 0 && (
              <div className="c-socials">
                {socials.map(([pl, val]) => {
                  const m = PLAT[pl];
                  return (
                    <a key={pl} href={m.u(val)} target="_blank"
                      rel="noopener noreferrer" className="c-soc"
                      title={m.n}
                      style={{background: m.bg, color: m.c}}>
                      <i className={m.i}/>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Link buttons */}
            {(user.links || []).length > 0 && (
              <div className="c-links">
                {user.links.map((lnk, i) => (
                  <a key={lnk.id || i} href={lnk.url} target="_blank"
                    rel="noopener noreferrer" className="c-lbtn">
                    <div className="c-lbtn-ico">
                      <i className={lnk.icon || "fas fa-link"}/>
                    </div>
                    <div className="c-lbtn-txt">{lnk.title}</div>
                    <div className="c-lbtn-arr">
                      <i className="fas fa-chevron-right"/>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Spotify embed */}
            {user.favSongTrackId && (
              <div className="c-spotify">
                <div className="c-sec-lbl">
                  <i className="fab fa-spotify" style={{color:"#1DB954",fontSize:13}}/>
                  Currently Vibing To
                </div>
                <div className="c-sp-frame">
                  <iframe
                    src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0`}
                    width="100%" height="152" frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy" style={{display:"block"}}
                  />
                </div>
              </div>
            )}

            {/* Interests */}
            {interestTags.length > 0 && (
              <div className="c-interests">
                <div className="c-sec-lbl">
                  <i className="fas fa-heart" style={{color:"#f87171",fontSize:11}}/>
                  Interests
                </div>
                <div className="c-int-tags">
                  {interestTags.map((t, i) => (
                    <span key={i} className="c-itag">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="c-footer">
              <div className="c-footer-logo">
                <img src="/icon.png" alt="mywebsam"
                  style={{width:16,height:16,borderRadius:4,verticalAlign:"middle",opacity:.7}}/>
                <a href="/"><strong>mywebsam</strong></a>
              </div>
              <div>Your link in bio — <a href="/">Create yours free</a></div>
            </div>

          </div>
        </div>
      </div>

      {/* Share sheet */}
      {shareOpen && (
        <ShareSheet
          url={pageUrl}
          name={user.name}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  try {
    const client  = await clientPromise;
    const db      = client.db(process.env.DB_NAME);
    const user    = await db.collection("users").findOne(
      { username: params.username.toLowerCase() },
      { projection: { _id: 0 } }
    );
    const host    = req.headers.host || "mywebsammu.vercel.app";
    const proto   = host.startsWith("localhost") ? "http" : "https";
    const pageUrl = `${proto}://${host}/${params.username.toLowerCase()}`;
    if (!user) return { props: { user: null, pageUrl } };
    return {
      props: {
        pageUrl,
        user: JSON.parse(JSON.stringify({
          username:       user.username       || "",
          name:           user.name           || "",
          dob:            user.dob            || null,
          location:       user.location       || "",
          bio:            user.bio            || "",
          aboutme:        user.aboutme        || "",
          avatar:         user.avatar         || "",
          banner:         user.banner         || "",
          socialProfiles: user.socialProfiles || {},
          links:          user.links          || [],
          interests:      user.interests      || {},
          favSong:        user.favSong        || "",
          favArtist:      user.favArtist      || "",
          favSongUrl:     user.favSongUrl     || "",
          favSongTrackId: user.favSongTrackId || "",
        }))
      }
    };
  } catch (e) {
    console.error("[username page]", e);
    const host  = req?.headers?.host || "mywebsammu.vercel.app";
    const proto = host.startsWith("localhost") ? "http" : "https";
    return { props: { user: null, pageUrl: `${proto}://${host}/${params.username}` } };
  }
}