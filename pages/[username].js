// pages/[username].js
import Head from "next/head";
import { useState } from "react";
import clientPromise from "../lib/mongodb";

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

function ShareSheet({ url, name, onClose }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  async function doCopy() {
    try { await navigator.clipboard.writeText(url); }
    catch (_) {
      const el = document.createElement("textarea");
      el.value = url; el.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  }

  const opts = [
    { label:"Copy Link", icon:"fas fa-copy",         bg:"#f0edff",fg:"#6C63FF", fn: doCopy },
    { label:"WhatsApp",  icon:"fab fa-whatsapp",      bg:"#edfaf3",fg:"#25D366", fn:()=>window.open(`https://wa.me/?text=${enc(name+" – "+url)}`) },
    { label:"Telegram",  icon:"fab fa-telegram",      bg:"#edf7fd",fg:"#26A5E4", fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(name)}`) },
    { label:"Twitter",   icon:"fab fa-x-twitter",     bg:"#f5f5f5",fg:"#000",    fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc("Check "+name+"'s profile! "+url)}`) },
    { label:"Facebook",  icon:"fab fa-facebook-f",    bg:"#eef4ff",fg:"#1877F2", fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`) },
    { label:"LinkedIn",  icon:"fab fa-linkedin-in",   bg:"#e8f3fc",fg:"#0A66C2", fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}`) },
    { label:"Reddit",    icon:"fab fa-reddit-alien",  bg:"#fff2ed",fg:"#FF4500", fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}&title=${enc(name)}`) },
    { label:"Email",     icon:"fas fa-envelope",      bg:"#fef2f2",fg:"#EA4335", fn:()=>window.open(`mailto:?subject=${enc(name)}&body=${enc(url)}`) },
    { label:"SMS",       icon:"fas fa-comment-sms",   bg:"#f0fdf4",fg:"#10b981", fn:()=>window.open(`sms:?body=${enc(url)}`) },
  ];

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.48)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(3px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,paddingBottom:44,animation:"sUp .26s cubic-bezier(.34,1.4,.64,1) both"}}>
        <style>{`@keyframes sUp{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}`}</style>
        <div style={{display:"flex",justifyContent:"center",padding:"14px 0 6px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#e5e7eb"}}/>
        </div>
        <div style={{padding:"10px 20px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#111827"}}>Share Profile</div>
            <div style={{fontSize:11.5,color:"#9ca3af",marginTop:2,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",background:"#f3f4f6",border:"none",fontSize:17,color:"#6b7280",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>
        <div style={{padding:"16px 10px 0",display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
          {opts.map(o=>(
            <button key={o.label} onClick={o.fn} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,width:72,padding:"10px 4px",border:"none",background:"transparent",cursor:"pointer",borderRadius:14,outline:"none",WebkitTapHighlightColor:"transparent",transition:"background .12s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:52,height:52,borderRadius:15,background:o.bg,color:o.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                {o.label==="Copy Link"&&copied?<i className="fas fa-check" style={{color:"#10b981"}}/>:<i className={o.icon}/>}
              </div>
              <span style={{fontSize:11,fontWeight:600,color:"#374151",textAlign:"center",lineHeight:1.2}}>{o.label==="Copy Link"&&copied?"Copied!":o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({ user, pageUrl, avatarUrl }) {
  const [shareOpen, setShareOpen] = useState(false);

  if (!user) {
    return (
      <>
        <Head>
          <title>Not Found | mywebsam</title>
          <meta name="robots" content="noindex"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#fafafa;}`}</style>
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#fef2f2",border:"2px solid #fca5a5",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:32,color:"#ef4444"}}>
            <i className="fas fa-user-slash"/>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,marginBottom:8,color:"#111827"}}>Profile Not Found</h1>
          <p style={{color:"#6b7280",marginBottom:28,lineHeight:1.6}}>This username doesn't exist yet.</p>
          <a href="/" style={{background:"#6C63FF",color:"#fff",padding:"12px 28px",borderRadius:999,fontWeight:700,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(108,99,255,.3)",textDecoration:"none",outline:"none",WebkitTapHighlightColor:"transparent"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const userAge   = calcAge(user.dob);
  const socials   = Object.entries(user.socialProfiles||{}).filter(([,v])=>v?.trim()).filter(([k])=>PLAT[k]);
  const interests = Object.values(user.interests||{}).flat().filter(v=>v&&typeof v==="string").slice(0,16);
  const bio       = user.aboutme||user.bio||"";
  const title     = `${user.name} | mywebsam`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description"     content={bio||`${user.name}'s profile on mywebsam`}/>
        <meta name="viewport"        content="width=device-width,initial-scale=1"/>

        {/* Open Graph — avatarUrl is a REAL https:// URL, not base64 */}
        <meta property="og:type"        content="profile"/>
        <meta property="og:title"       content={title}/>
        <meta property="og:description" content={bio||`${user.name}'s links on mywebsam`}/>
        <meta property="og:url"         content={pageUrl}/>
        <meta property="og:site_name"   content="mywebsam"/>
        <meta property="og:image"       content={avatarUrl}/>
        <meta property="og:image:width" content="400"/>
        <meta property="og:image:height"content="400"/>
        <meta property="og:image:type"  content="image/jpeg"/>

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image"/>
        <meta name="twitter:title"       content={title}/>
        <meta name="twitter:description" content={bio||`${user.name}'s links on mywebsam`}/>
        <meta name="twitter:image"       content={avatarUrl}/>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{
            font-family:'Plus Jakarta Sans',sans-serif;
            min-height:100vh;
            /* Advanced warm gradient background */
            background:
              radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,183,77,0.25) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 90%, rgba(240,98,146,0.2) 0%, transparent 55%),
              radial-gradient(ellipse 70% 70% at 50% 50%, rgba(126,87,194,0.15) 0%, transparent 70%),
              #faf8ff;
            background-attachment:fixed;
          }

          @keyframes cardIn{from{opacity:0;transform:translateY(32px)scale(.96);}to{opacity:1;transform:translateY(0)scale(1);}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}

          /* ── Outer page ── */
          .outer{
            min-height:100vh;
            display:flex;
            flex-direction:column;
            align-items:center;
            padding:28px 16px 64px;
          }

          /* ── CARD ── */
          .card{
            width:100%;max-width:420px;
            border-radius:32px;
            overflow:hidden;
            background:rgba(255,255,255,0.82);
            border:1px solid rgba(255,255,255,0.9);
            box-shadow:
              0 0 0 1px rgba(0,0,0,0.03),
              0 4px 8px rgba(0,0,0,0.04),
              0 16px 40px rgba(0,0,0,0.1),
              0 40px 80px rgba(0,0,0,0.06);
            backdrop-filter:blur(20px);
            -webkit-backdrop-filter:blur(20px);
            animation:cardIn .5s cubic-bezier(.22,.68,0,1.15) both;
          }

          /* ── Photo top ── */
          .photo-top{
            width:100%;
            aspect-ratio:1/1;
            position:relative;
            overflow:hidden;
            background:linear-gradient(135deg,#fde68a,#fca5a5,#c4b5fd);
          }
          .photo-top img{
            width:100%;height:100%;
            object-fit:cover;
            object-position:center 10%;
            display:block;
          }
          .photo-fade{
            position:absolute;bottom:0;left:0;right:0;height:45%;
            background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.6));
            pointer-events:none;
          }
          .no-photo{
            width:100%;height:200px;
            background:linear-gradient(135deg,#fde68a 0%,#fca5a5 50%,#c4b5fd 100%);
            display:flex;align-items:center;justify-content:center;
          }
          .av-ph{
            width:90px;height:90px;border-radius:50%;
            border:4px solid rgba(255,255,255,0.8);
            background:linear-gradient(135deg,#6C63FF,#a78bfa);
            display:flex;align-items:center;justify-content:center;
            font-size:36px;font-weight:800;color:#fff;
            box-shadow:0 8px 24px rgba(108,99,255,.3);
          }

          /* ── Card body ── */
          .body{padding:22px 22px 26px;}

          /* Identity */
          .pname{
            font-size:clamp(24px,6vw,30px);
            font-weight:800;color:#111827;
            letter-spacing:-0.025em;line-height:1.1;
            text-align:center;margin-bottom:4px;
            animation:fadeUp .4s .08s ease both;
          }
          .phandle{
            font-size:13px;color:#9ca3af;font-weight:500;
            text-align:center;margin-bottom:12px;
            animation:fadeUp .4s .1s ease both;
          }
          .chips{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:7px;margin-bottom:12px;
            animation:fadeUp .4s .12s ease both;
          }
          .chip{
            display:inline-flex;align-items:center;gap:5px;
            font-size:12px;color:#6b7280;
            background:rgba(0,0,0,0.04);
            border:1px solid rgba(0,0,0,0.07);
            padding:5px 12px;border-radius:999px;font-weight:500;
          }
          .bio{
            font-size:13.5px;color:#6b7280;line-height:1.75;
            text-align:center;max-width:320px;
            margin:0 auto 18px;
            animation:fadeUp .4s .14s ease both;
          }
          .sep{height:1px;background:rgba(0,0,0,0.07);margin:0 0 18px;}

          /* Social icons */
          .soc-row{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:10px;margin-bottom:18px;
            animation:fadeUp .4s .17s ease both;
          }
          .soc-ic{
            width:44px;height:44px;border-radius:13px;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
            transition:transform .13s,box-shadow .13s;
          }
          .soc-ic:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 8px 20px rgba(0,0,0,.14);}
          .soc-ic:active{transform:scale(.93);}

          /* Links */
          .links{
            display:flex;flex-direction:column;
            gap:10px;margin-bottom:18px;
            animation:fadeUp .4s .2s ease both;
          }
          .lbtn{
            display:flex;align-items:center;
            width:100%;min-height:56px;
            background:rgba(0,0,0,0.03);
            border:1.5px solid rgba(0,0,0,0.07);
            border-radius:16px;cursor:pointer;
            transition:background .14s,transform .13s,box-shadow .14s,border-color .13s;
            overflow:hidden;position:relative;
          }
          .lbtn:hover{
            background:rgba(108,99,255,0.06);
            border-color:rgba(108,99,255,0.3);
            transform:translateY(-2px);
            box-shadow:0 8px 24px rgba(108,99,255,.12);
          }
          .lbtn:active{transform:scale(.98);}
          .lbtn-i{
            width:56px;min-height:56px;
            display:flex;align-items:center;justify-content:center;
            font-size:16px;color:#6C63FF;flex-shrink:0;
            border-right:1.5px solid rgba(0,0,0,0.05);
          }
          .lbtn-t{
            flex:1;text-align:center;
            font-size:14.5px;font-weight:700;color:#111827;
            padding:0 12px;letter-spacing:-0.01em;
          }
          .lbtn-a{
            width:44px;min-height:56px;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;color:#d1d5db;flex-shrink:0;
          }

          /* Spotify */
          .sp-wrap{margin-bottom:18px;animation:fadeUp .4s .25s ease both;}
          .sec-lbl{
            display:flex;align-items:center;justify-content:center;
            gap:6px;margin-bottom:10px;
            font-size:10.5px;font-weight:700;
            letter-spacing:.08em;text-transform:uppercase;
            color:#9ca3af;
          }
          .sp-frame{border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);}

          /* Interests */
          .int-wrap{margin-bottom:18px;animation:fadeUp .4s .28s ease both;}
          .int-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;}
          .itag{
            padding:6px 13px;border-radius:999px;
            font-size:12px;font-weight:600;color:#6b7280;
            background:rgba(0,0,0,0.04);
            border:1px solid rgba(0,0,0,0.08);
            transition:background .12s,color .12s,border-color .12s;
          }
          .itag:hover{background:rgba(108,99,255,.08);color:#6C63FF;border-color:rgba(108,99,255,.25);}

          /* Footer */
          .foot{
            text-align:center;padding:6px 0 0;
            animation:fadeUp .4s .32s ease both;
          }
          .foot-logo{display:inline-flex;align-items:center;gap:5px;margin-bottom:3px;}
          .foot a{font-size:12px;color:#a78bfa;font-weight:700;}
          .foot a:hover{color:#6C63FF;}
          .foot-sub{font-size:11px;color:#c4b5c8;}

          /* Share FAB */
          .sfab{
            position:fixed;top:16px;right:16px;
            width:44px;height:44px;border-radius:50%;
            background:rgba(255,255,255,0.88);
            border:1px solid rgba(0,0,0,0.09);
            box-shadow:0 2px 16px rgba(0,0,0,.12);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;color:#374151;
            cursor:pointer;z-index:80;
            transition:background .14s,transform .12s,box-shadow .14s;
            backdrop-filter:blur(10px);
          }
          .sfab:hover{background:#fff;transform:scale(1.07);box-shadow:0 4px 20px rgba(0,0,0,.16);}
          .sfab:active{transform:scale(.93);}

          @media(max-width:460px){
            .outer{padding:16px 12px 52px;}
            .card{border-radius:26px;}
            .body{padding:18px 18px 22px;}
            .pname{font-size:23px;}
            .lbtn-t{font-size:14px;}
            .soc-ic{width:40px;height:40px;font-size:16px;border-radius:11px;}
          }
        `}</style>
      </Head>

      {/* Share FAB */}
      <button className="sfab" onClick={()=>setShareOpen(true)} aria-label="Share">
        <i className="fas fa-share-nodes"/>
      </button>

      <div className="outer">
        <div className="card">

          {/* Photo */}
          {user.avatar?(
            <div className="photo-top">
              <img src={user.avatar} alt={user.name}/>
              <div className="photo-fade"/>
            </div>
          ):(
            <div className="no-photo">
              <div className="av-ph">{user.name?.charAt(0)?.toUpperCase()||"?"}</div>
            </div>
          )}

          <div className="body">
            {/* Name */}
            <div className="pname">{user.name}</div>
            <div className="phandle">@{user.username}</div>

            {(user.location||userAge)&&(
              <div className="chips">
                {user.location&&<span className="chip"><i className="fas fa-location-dot" style={{fontSize:10,color:"#6C63FF"}}/>{user.location}</span>}
                {userAge&&<span className="chip"><i className="fas fa-cake-candles" style={{fontSize:10,color:"#f59e0b"}}/>{userAge} years old</span>}
              </div>
            )}

            {bio&&<p className="bio">{bio}</p>}
            <div className="sep"/>

            {/* Socials */}
            {socials.length>0&&(
              <div className="soc-row">
                {socials.map(([pl,val])=>{
                  const m=PLAT[pl];
                  return(
                    <a key={pl} href={m.u(val)} target="_blank" rel="noopener noreferrer"
                      className="soc-ic" title={m.n} style={{background:m.bg,color:m.c}}>
                      <i className={m.i}/>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Links */}
            {(user.links||[]).length>0&&(
              <div className="links">
                {user.links.map((lnk,i)=>(
                  <a key={lnk.id||i} href={lnk.url} target="_blank" rel="noopener noreferrer" className="lbtn">
                    <div className="lbtn-i"><i className={lnk.icon||"fas fa-link"}/></div>
                    <div className="lbtn-t">{lnk.title}</div>
                    <div className="lbtn-a"><i className="fas fa-chevron-right"/></div>
                  </a>
                ))}
              </div>
            )}

            {/* Spotify */}
            {user.favSongTrackId&&(
              <div className="sp-wrap">
                <div className="sec-lbl"><i className="fab fa-spotify" style={{color:"#1DB954",fontSize:13}}/>Currently Vibing To</div>
                <div className="sp-frame">
                  <iframe src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0`}
                    width="100%" height="152" frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy" style={{display:"block"}}/>
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length>0&&(
              <div className="int-wrap">
                <div className="sec-lbl"><i className="fas fa-sparkles" style={{color:"#fbbf24",fontSize:11}}/>Interests</div>
                <div className="int-tags">
                  {interests.map((t,i)=><span key={i} className="itag">{t}</span>)}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="foot">
              <div className="foot-logo">
                <img src="/icon.png" alt="mywebsam" style={{width:16,height:16,borderRadius:4,verticalAlign:"middle",opacity:.65}}/>
                <a href="/"><strong>mywebsam</strong></a>
              </div>
              <div className="foot-sub">Your link in bio — <a href="/">Create yours free</a></div>
            </div>
          </div>
        </div>
      </div>

      {shareOpen&&<ShareSheet url={pageUrl} name={user.name} onClose={()=>setShareOpen(false)}/>}
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
    const base    = `${proto}://${host}`;
    const pageUrl = `${base}/${params.username.toLowerCase()}`;

    // avatarUrl: real https:// URL for OG image meta (base64 won't work in WhatsApp/Instagram)
    // /api/avatar/[username] converts base64 → real image response
    const avatarUrl = `${base}/api/avatar/${params.username.toLowerCase()}`;

    if (!user) return { props: { user: null, pageUrl, avatarUrl } };
    return {
      props: {
        pageUrl,
        avatarUrl,
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
  } catch(e) {
    console.error("[username page]", e);
    const host  = req?.headers?.host || "mywebsammu.vercel.app";
    const proto = host.startsWith("localhost") ? "http" : "https";
    const base  = `${proto}://${host}`;
    return { props: { user:null, pageUrl:`${base}/${params.username}`, avatarUrl:`${base}/api/avatar/${params.username}` } };
  }
}
