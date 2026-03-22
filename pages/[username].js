// pages/[username].js
import Head from "next/head";
import { useState } from "react";
import clientPromise from "../lib/mongodb";

const PLAT = {
  email:        { i:"fas fa-envelope",      c:"#EA4335", bg:"#2a1a1a", u:(v)=>`mailto:${v}`,                                    n:"Email" },
  whatsapp:     { i:"fab fa-whatsapp",       c:"#25D366", bg:"#1a2a1e", u:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,          n:"WhatsApp" },
  instagram:    { i:"fab fa-instagram",      c:"#E4405F", bg:"#2a1a20", u:(v)=>`https://instagram.com/${v.replace("@","")}`,    n:"Instagram" },
  facebook:     { i:"fab fa-facebook-f",     c:"#1877F2", bg:"#1a1e2a", u:(v)=>`https://facebook.com/${v}`,                     n:"Facebook" },
  github:       { i:"fab fa-github",         c:"#fff",    bg:"#1e1e1e", u:(v)=>`https://github.com/${v}`,                       n:"GitHub" },
  snapchat:     { i:"fab fa-snapchat",       c:"#FFE700", bg:"#2a2a14", u:(v)=>`https://snapchat.com/add/${v}`,                 n:"Snapchat" },
  youtube:      { i:"fab fa-youtube",        c:"#FF0000", bg:"#2a1a1a", u:(v)=>`https://youtube.com/${v}`,                      n:"YouTube" },
  twitter:      { i:"fab fa-x-twitter",      c:"#fff",    bg:"#1a1a1a", u:(v)=>`https://twitter.com/${v.replace("@","")}`,      n:"Twitter" },
  linkedin:     { i:"fab fa-linkedin-in",    c:"#0A66C2", bg:"#1a1e28", u:(v)=>`https://linkedin.com/in/${v}`,                  n:"LinkedIn" },
  tiktok:       { i:"fab fa-tiktok",         c:"#fff",    bg:"#1a1a1a", u:(v)=>`https://tiktok.com/@${v.replace("@","")}`,      n:"TikTok" },
  discord:      { i:"fab fa-discord",        c:"#5865F2", bg:"#1c1a2a", u:(v)=>`https://discord.com/users/${v}`,                n:"Discord" },
  telegram:     { i:"fab fa-telegram",       c:"#26A5E4", bg:"#1a2228", u:(v)=>`https://t.me/${v.replace("@","")}`,             n:"Telegram" },
  twitch:       { i:"fab fa-twitch",         c:"#9146FF", bg:"#1e1a2a", u:(v)=>`https://twitch.tv/${v}`,                        n:"Twitch" },
  spotify:      { i:"fab fa-spotify",        c:"#1DB954", bg:"#1a2a1e", u:(v)=>`https://open.spotify.com/user/${v}`,            n:"Spotify" },
  pinterest:    { i:"fab fa-pinterest",      c:"#E60023", bg:"#2a1a1a", u:(v)=>`https://pinterest.com/${v}`,                    n:"Pinterest" },
  reddit:       { i:"fab fa-reddit-alien",   c:"#FF4500", bg:"#2a1e1a", u:(v)=>`https://reddit.com/user/${v}`,                  n:"Reddit" },
  medium:       { i:"fab fa-medium",         c:"#fff",    bg:"#1e1e1e", u:(v)=>`https://medium.com/${v.replace("@","")}`,       n:"Medium" },
  devto:        { i:"fab fa-dev",            c:"#fff",    bg:"#1e1e1e", u:(v)=>`https://dev.to/${v}`,                           n:"DEV.to" },
  behance:      { i:"fab fa-behance",        c:"#1769FF", bg:"#1a1e2a", u:(v)=>`https://behance.net/${v}`,                      n:"Behance" },
  dribbble:     { i:"fab fa-dribbble",       c:"#ea4c89", bg:"#2a1a22", u:(v)=>`https://dribbble.com/${v}`,                     n:"Dribbble" },
  threads:      { i:"fab fa-threads",        c:"#fff",    bg:"#1a1a1a", u:(v)=>`https://threads.net/${v.replace("@","")}`,      n:"Threads" },
  bluesky:      { i:"fas fa-cloud",          c:"#1185FE", bg:"#1a1e2a", u:(v)=>`https://bsky.app/profile/${v.replace("@","")}`, n:"Bluesky" },
  npm:          { i:"fab fa-npm",            c:"#CC3534", bg:"#2a1a1a", u:(v)=>`https://npmjs.com/~${v.replace("~","")}`,       n:"npm" },
  codepen:      { i:"fab fa-codepen",        c:"#fff",    bg:"#1a1a1a", u:(v)=>`https://codepen.io/${v}`,                       n:"CodePen" },
  stackoverflow:{ i:"fab fa-stack-overflow", c:"#F58025", bg:"#2a1e1a", u:(v)=>`https://stackoverflow.com/users/${v}`,          n:"Stack Overflow" },
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
    { l:"Copy Link", ic:"fas fa-copy",        bg:"#1e1e2e",fg:"#a78bfa", fn:doCopy },
    { l:"WhatsApp",  ic:"fab fa-whatsapp",    bg:"#1a2a1e",fg:"#25D366", fn:()=>window.open(`https://wa.me/?text=${enc(name+" "+url)}`) },
    { l:"Telegram",  ic:"fab fa-telegram",    bg:"#1a2228",fg:"#26A5E4", fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(name)}`) },
    { l:"Twitter",   ic:"fab fa-x-twitter",   bg:"#1a1a1a",fg:"#fff",    fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc(name+" "+url)}`) },
    { l:"Facebook",  ic:"fab fa-facebook-f",  bg:"#1a1e2a",fg:"#1877F2", fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`) },
    { l:"LinkedIn",  ic:"fab fa-linkedin-in", bg:"#1a1e28",fg:"#0A66C2", fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}`) },
    { l:"Reddit",    ic:"fab fa-reddit-alien",bg:"#2a1e1a",fg:"#FF4500", fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}`) },
    { l:"Email",     ic:"fas fa-envelope",    bg:"#2a1a1a",fg:"#EA4335", fn:()=>window.open(`mailto:?subject=${enc(name)}&body=${enc(url)}`) },
    { l:"SMS",       ic:"fas fa-comment-sms", bg:"#1a2a1e",fg:"#1DB954", fn:()=>window.open(`sms:?body=${enc(url)}`) },
  ];
  return (
    <div onClick={onClose}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:1000,
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:"#111",border:"1px solid #222",
                borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,
                paddingBottom:44,animation:"sUp .26s cubic-bezier(.34,1.4,.64,1) both"}}>
        <style>{`@keyframes sUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
        <div style={{display:"flex",justifyContent:"center",padding:"14px 0 8px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#333"}}/>
        </div>
        <div style={{padding:"8px 20px 16px",borderBottom:"1px solid #222",
                     display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#fff"}}>Share Profile</div>
            <div style={{fontSize:11,color:"#555",marginTop:2,maxWidth:260,
                         overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
          </div>
          <button onClick={onClose}
            style={{width:34,height:34,borderRadius:"50%",background:"#222",border:"none",
                    fontSize:17,color:"#666",cursor:"pointer",display:"flex",
                    alignItems:"center",justifyContent:"center",
                    outline:"none",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>
        <div style={{padding:"16px 10px 0",display:"flex",flexWrap:"wrap",
                     gap:8,justifyContent:"center"}}>
          {opts.map(o=>(
            <button key={o.l} onClick={o.fn}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                      width:72,padding:"10px 4px",border:"none",background:"transparent",
                      cursor:"pointer",borderRadius:14,outline:"none",
                      WebkitTapHighlightColor:"transparent",transition:"background .12s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#1a1a1a"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:52,height:52,borderRadius:14,background:o.bg,color:o.fg,
                           display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                {o.l==="Copy Link"&&copied
                  ?<i className="fas fa-check" style={{color:"#1DB954"}}/>
                  :<i className={o.ic}/>}
              </div>
              <span style={{fontSize:10.5,fontWeight:600,color:"#888",
                            textAlign:"center",lineHeight:1.2}}>
                {o.l==="Copy Link"&&copied?"Copied!":o.l}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({ user, pageUrl, avatarUrl }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [spOpen,    setSpOpen]    = useState(false);

  if (!user) {
    return (
      <>
        <Head>
          <title>Not Found | mywebsam</title>
          <meta name="robots" content="noindex"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#0a0a0a;color:#fff;}`}</style>
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",
                     alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#1a1a1a",
                       border:"2px solid #333",display:"flex",alignItems:"center",
                       justifyContent:"center",marginBottom:20,fontSize:32,color:"#555"}}>
            <i className="fas fa-user-slash"/>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,marginBottom:8,color:"#fff"}}>Profile Not Found</h1>
          <p style={{color:"#666",marginBottom:28,lineHeight:1.6}}>This username doesn't exist yet.</p>
          <a href="/" style={{background:"#fff",color:"#000",padding:"12px 28px",borderRadius:999,
                              fontWeight:800,fontSize:14,display:"inline-flex",alignItems:"center",
                              gap:8,textDecoration:"none",outline:"none",
                              WebkitTapHighlightColor:"transparent"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const userAge   = calcAge(user.dob);
  const socials   = Object.entries(user.socialProfiles||{}).filter(([,v])=>v?.trim()).filter(([k])=>PLAT[k]);
  const interests = Object.values(user.interests||{}).flat().filter(v=>v&&typeof v==="string").slice(0,14);
  const bio       = user.aboutme||user.bio||"";
  const title     = `${user.name} | mywebsam`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description"         content={bio||`${user.name}'s profile on mywebsam`}/>
        <meta name="viewport"            content="width=device-width,initial-scale=1"/>
        <meta name="theme-color"         content="#0a0a0a"/>
        {/* OG — avatarUrl is real https:// URL via /api/avatar/[username] — works on WhatsApp/Instagram */}
        <meta property="og:type"         content="profile"/>
        <meta property="og:title"        content={title}/>
        <meta property="og:description"  content={bio||`${user.name}'s links on mywebsam`}/>
        <meta property="og:url"          content={pageUrl}/>
        <meta property="og:site_name"    content="mywebsam"/>
        <meta property="og:image"        content={avatarUrl}/>
        <meta property="og:image:width"  content="400"/>
        <meta property="og:image:height" content="400"/>
        <meta property="og:image:type"   content="image/jpeg"/>
        {/* Twitter */}
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

          /* ── Pure black background ── */
          body{
            background:#0a0a0a;
            color:#fff;
            font-family:'Plus Jakarta Sans',sans-serif;
            min-height:100vh;
          }

          /* ── Animations ── */
          @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
          @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
          @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.6;}}
          .a0{animation:fadeIn .6s ease both;}
          .a1{animation:fadeUp .5s .05s ease both;}
          .a2{animation:fadeUp .5s .12s ease both;}
          .a3{animation:fadeUp .5s .19s ease both;}
          .a4{animation:fadeUp .5s .26s ease both;}
          .a5{animation:fadeUp .5s .33s ease both;}
          .a6{animation:fadeUp .5s .40s ease both;}

          /* ── HERO — half screen photo ── */
          .hero{
            position:relative;
            width:100%;
            height:55vh;
            min-height:280px;
            max-height:480px;
            overflow:hidden;
            flex-shrink:0;
          }
          .hero-img{
            width:100%;height:100%;
            object-fit:cover;
            object-position:center 15%;
            display:block;
          }
          /* 3-stop gradient: transparent → partial → full black */
          .hero-gradient{
            position:absolute;
            inset:0;
            background:linear-gradient(
              to bottom,
              rgba(10,10,10,0)    0%,
              rgba(10,10,10,0)    35%,
              rgba(10,10,10,0.4)  60%,
              rgba(10,10,10,0.82) 80%,
              rgba(10,10,10,1)    100%
            );
            pointer-events:none;
          }
          /* Name sits at the bottom of hero, ON the photo */
          .hero-name{
            position:absolute;
            bottom:0;left:0;right:0;
            padding:0 20px 20px;
            text-align:center;
            z-index:2;
          }
          .pname{
            font-size:clamp(34px,9vw,52px);
            font-weight:800;
            color:#fff;
            letter-spacing:-0.03em;
            line-height:1.0;
            text-shadow:0 2px 20px rgba(0,0,0,.5);
          }
          .page-sub{
            display:flex;align-items:center;justify-content:center;
            gap:10px;margin-top:7px;flex-wrap:wrap;
          }
          .phandle{font-size:13px;color:rgba(255,255,255,0.55);font-weight:500;}
          .page{
            font-size:13px;color:rgba(255,255,255,0.6);font-weight:500;
            display:flex;align-items:center;gap:4px;
          }
          .dot{width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.3);}

          /* No photo placeholder */
          .hero-ph{
            width:100%;height:55vh;min-height:280px;max-height:480px;
            background:#111;
            display:flex;align-items:center;justify-content:center;
            flex-direction:column;gap:12px;position:relative;
          }
          .av-ph{
            width:96px;height:96px;border-radius:50%;
            background:#222;border:2px solid #333;
            display:flex;align-items:center;justify-content:center;
            font-size:38px;font-weight:800;color:#fff;
          }

          /* ── Content below hero ── */
          .content{
            max-width:480px;
            margin:0 auto;
            padding:20px 18px 80px;
          }

          /* Bio */
          .bio-block{
            text-align:center;
            margin-bottom:24px;
          }
          .bio-text{
            font-size:14px;color:rgba(255,255,255,0.55);
            line-height:1.75;max-width:320px;margin:0 auto;
          }

          /* ── Social icons — horizontal row ── */
          .soc-row{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:8px;
            margin-bottom:28px;
          }
          .soc-btn{
            width:46px;height:46px;
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
            border:1px solid #222;
            background:#111;
            transition:transform .13s,background .13s,border-color .13s;
          }
          .soc-btn:hover{transform:scale(1.12);border-color:#333;}
          .soc-btn:active{transform:scale(.92);}

          /* ── Link buttons — white pill on black ── */
          .links{
            display:flex;flex-direction:column;
            gap:10px;margin-bottom:28px;
          }
          .lbtn{
            display:flex;align-items:center;
            width:100%;min-height:56px;
            background:#fff;
            border-radius:999px;
            cursor:pointer;
            transition:transform .14s,background .14s,box-shadow .14s;
            overflow:hidden;
            position:relative;
          }
          .lbtn:hover{transform:scale(1.015);box-shadow:0 8px 28px rgba(255,255,255,.12);background:#f5f5f5;}
          .lbtn:active{transform:scale(.98);}
          .lbtn-ic{
            width:56px;height:56px;
            display:flex;align-items:center;justify-content:center;
            font-size:16px;color:#666;flex-shrink:0;
            border-right:1px solid rgba(0,0,0,0.08);
          }
          .lbtn-t{
            flex:1;text-align:center;
            font-size:15px;font-weight:700;
            color:#111;padding:0 14px;
            letter-spacing:-0.01em;
          }
          .lbtn-a{
            width:44px;height:56px;
            display:flex;align-items:center;justify-content:center;
            font-size:12px;color:#ccc;flex-shrink:0;
          }

          /* ── Spotify — embedded player ── */
          .sp-block{margin-bottom:28px;}
          .sp-header{
            display:flex;align-items:center;justify-content:space-between;
            margin-bottom:12px;cursor:pointer;
            padding:14px 16px;
            background:#111;
            border:1px solid #222;
            border-radius:16px;
            transition:background .14s,border-color .14s;
          }
          .sp-header:hover{background:#161616;border-color:#2a2a2a;}
          .sp-header.open{
            border-radius:16px 16px 0 0;
            border-bottom:none;
            background:#111;
          }
          .sp-left{display:flex;align-items:center;gap:12px;}
          .sp-ico{
            width:40px;height:40px;border-radius:10px;
            background:#1a2a1e;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;color:#1DB954;flex-shrink:0;
          }
          .sp-info{display:flex;flex-direction:column;}
          .sp-label{font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#555;margin-bottom:2px;}
          .sp-name{font-size:14px;font-weight:700;color:#fff;line-height:1.2;}
          .sp-chevron{
            font-size:13px;color:#555;
            transition:transform .2s;flex-shrink:0;
          }
          .sp-chevron.open{transform:rotate(180deg);}
          .sp-embed{
            border-radius:0 0 16px 16px;
            overflow:hidden;
            border:1px solid #222;
            border-top:none;
          }

          /* ── Interests ── */
          .int-block{margin-bottom:28px;}
          .sec-label{
            font-size:10px;font-weight:700;
            letter-spacing:.1em;text-transform:uppercase;
            color:#444;margin-bottom:12px;text-align:center;
          }
          .int-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;}
          .itag{
            padding:7px 14px;border-radius:999px;
            font-size:12px;font-weight:600;color:#fff;
            background:#111;border:1px solid #222;
            transition:background .12s,border-color .12s;
          }
          .itag:hover{background:#1a1a1a;border-color:#333;}

          /* ── Footer ── */
          .foot{text-align:center;padding:4px 0;}
          .foot-logo{display:inline-flex;align-items:center;gap:5px;margin-bottom:3px;}
          .foot a{font-size:12px;color:#444;font-weight:700;}
          .foot a:hover{color:#888;}
          .foot-sub{font-size:11px;color:#333;}

          /* ── Share FAB ── */
          .sfab{
            position:fixed;top:16px;right:16px;
            width:44px;height:44px;border-radius:50%;
            background:rgba(255,255,255,0.1);
            border:1px solid rgba(255,255,255,0.15);
            backdrop-filter:blur(10px);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;color:#fff;cursor:pointer;z-index:80;
            transition:background .14s,transform .12s;
          }
          .sfab:hover{background:rgba(255,255,255,0.18);transform:scale(1.07);}
          .sfab:active{transform:scale(.93);}

          @media(max-width:440px){
            .hero{height:52vh;}
            .pname{font-size:32px;}
            .lbtn-t{font-size:14px;}
            .content{padding:18px 14px 64px;}
          }
        `}</style>
      </Head>

      {/* Share FAB */}
      <button className="sfab" onClick={()=>setShareOpen(true)} aria-label="Share">
        <i className="fas fa-share-nodes"/>
      </button>

      {/* ── HERO — half screen ── */}
      {user.avatar?(
        <div className="hero a0">
          <img src={user.avatar} alt={user.name} className="hero-img"/>
          <div className="hero-gradient"/>
          {/* Name + handle ON the photo at bottom */}
          <div className="hero-name">
            <div className="pname a1">{user.name}</div>
            <div className="page-sub a2">
              <span className="phandle">@{user.username}</span>
              {userAge&&<><div className="dot"/><span className="page">{userAge}</span></>}
            </div>
          </div>
        </div>
      ):(
        <div className="hero-ph a0">
          <div className="av-ph">{user.name?.charAt(0)?.toUpperCase()||"?"}</div>
          <div className="hero-name" style={{position:"relative",bottom:"auto",padding:"12px 20px 0"}}>
            <div className="pname">{user.name}</div>
            <div className="page-sub">
              <span className="phandle">@{user.username}</span>
              {userAge&&<><div className="dot"/><span className="page">{userAge}</span></>}
            </div>
          </div>
        </div>
      )}

      {/* ── Below hero ── */}
      <div className="content">

        {/* Bio */}
        {bio&&(
          <div className="bio-block a2">
            <p className="bio-text">{bio}</p>
          </div>
        )}

        {/* Social icons */}
        {socials.length>0&&(
          <div className="soc-row a3">
            {socials.map(([pl,val])=>{
              const m=PLAT[pl];
              return(
                <a key={pl} href={m.u(val)} target="_blank" rel="noopener noreferrer"
                  className="soc-btn" title={m.n} style={{color:m.c,background:m.bg}}>
                  <i className={m.i}/>
                </a>
              );
            })}
          </div>
        )}

        {/* Link buttons — white on black */}
        {(user.links||[]).length>0&&(
          <div className="links a4">
            {user.links.map((lnk,i)=>(
              <a key={lnk.id||i} href={lnk.url} target="_blank" rel="noopener noreferrer" className="lbtn">
                <div className="lbtn-ic"><i className={lnk.icon||"fas fa-link"}/></div>
                <div className="lbtn-t">{lnk.title}</div>
                <div className="lbtn-a"><i className="fas fa-chevron-right"/></div>
              </a>
            ))}
          </div>
        )}

        {/* Spotify — tap header to expand/collapse embed */}
        {user.favSongTrackId&&(
          <div className="sp-block a5">
            <div className={`sp-header${spOpen?" open":""}`} onClick={()=>setSpOpen(v=>!v)}>
              <div className="sp-left">
                <div className="sp-ico"><i className="fab fa-spotify"/></div>
                <div className="sp-info">
                  <span className="sp-label">Currently Vibing To</span>
                  <span className="sp-name">{user.favSong||"My Favourite Song"}</span>
                </div>
              </div>
              <i className={`fas fa-chevron-down sp-chevron${spOpen?" open":""}`}/>
            </div>
            {spOpen&&(
              <div className="sp-embed">
                <iframe
                  src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0`}
                  width="100%" height="152" frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy" style={{display:"block"}}
                />
              </div>
            )}
          </div>
        )}

        {/* Interests */}
        {interests.length>0&&(
          <div className="int-block a5">
            <div className="sec-label">Interests</div>
            <div className="int-tags">
              {interests.map((t,i)=><span key={i} className="itag">{t}</span>)}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="foot a6">
          <div className="foot-logo">
            <img src="/icon.png" alt="mywebsam" style={{width:16,height:16,borderRadius:4,verticalAlign:"middle",opacity:.5}}/>
            <a href="/"><strong>mywebsam</strong></a>
          </div>
          <div className="foot-sub">Your link in bio — <a href="/">Create yours free</a></div>
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
    const avatarUrl = `${base}/api/avatar/${params.username.toLowerCase()}`;
    if (!user) return { props: { user:null, pageUrl, avatarUrl } };
    return {
      props: {
        pageUrl, avatarUrl,
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
    console.error("[username page]",e);
    const host  = req?.headers?.host||"mywebsammu.vercel.app";
    const proto = host.startsWith("localhost")?"http":"https";
    const base  = `${proto}://${host}`;
    return { props:{user:null,pageUrl:`${base}/${params.username}`,avatarUrl:`${base}/api/avatar/${params.username}`} };
  }
}
