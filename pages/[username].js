// pages/[username].js
import Head from "next/head";
import { useState } from "react";
import clientPromise from "../lib/mongodb";

const P = {
  email:        { i:"fas fa-envelope",      c:"#EA4335", u:(v)=>`mailto:${v}`,                                    n:"Email" },
  whatsapp:     { i:"fab fa-whatsapp",       c:"#25D366", u:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,          n:"WhatsApp" },
  instagram:    { i:"fab fa-instagram",      c:"#E4405F", u:(v)=>`https://instagram.com/${v.replace("@","")}`,    n:"Instagram" },
  facebook:     { i:"fab fa-facebook-f",     c:"#1877F2", u:(v)=>`https://facebook.com/${v}`,                     n:"Facebook" },
  github:       { i:"fab fa-github",         c:"#333",    u:(v)=>`https://github.com/${v}`,                       n:"GitHub" },
  snapchat:     { i:"fab fa-snapchat",       c:"#c9a800", u:(v)=>`https://snapchat.com/add/${v}`,                 n:"Snapchat" },
  youtube:      { i:"fab fa-youtube",        c:"#FF0000", u:(v)=>`https://youtube.com/${v}`,                      n:"YouTube" },
  twitter:      { i:"fab fa-x-twitter",      c:"#000",    u:(v)=>`https://twitter.com/${v.replace("@","")}`,      n:"Twitter" },
  linkedin:     { i:"fab fa-linkedin-in",    c:"#0A66C2", u:(v)=>`https://linkedin.com/in/${v}`,                  n:"LinkedIn" },
  tiktok:       { i:"fab fa-tiktok",         c:"#010101", u:(v)=>`https://tiktok.com/@${v.replace("@","")}`,      n:"TikTok" },
  discord:      { i:"fab fa-discord",        c:"#5865F2", u:(v)=>`https://discord.com/users/${v}`,                n:"Discord" },
  telegram:     { i:"fab fa-telegram",       c:"#26A5E4", u:(v)=>`https://t.me/${v.replace("@","")}`,             n:"Telegram" },
  twitch:       { i:"fab fa-twitch",         c:"#9146FF", u:(v)=>`https://twitch.tv/${v}`,                        n:"Twitch" },
  spotify:      { i:"fab fa-spotify",        c:"#1DB954", u:(v)=>`https://open.spotify.com/user/${v}`,            n:"Spotify" },
  pinterest:    { i:"fab fa-pinterest",      c:"#E60023", u:(v)=>`https://pinterest.com/${v}`,                    n:"Pinterest" },
  reddit:       { i:"fab fa-reddit-alien",   c:"#FF4500", u:(v)=>`https://reddit.com/user/${v}`,                  n:"Reddit" },
  medium:       { i:"fab fa-medium",         c:"#000",    u:(v)=>`https://medium.com/${v.replace("@","")}`,       n:"Medium" },
  devto:        { i:"fab fa-dev",            c:"#0a0a0a", u:(v)=>`https://dev.to/${v}`,                           n:"DEV.to" },
  behance:      { i:"fab fa-behance",        c:"#1769FF", u:(v)=>`https://behance.net/${v}`,                      n:"Behance" },
  dribbble:     { i:"fab fa-dribbble",       c:"#ea4c89", u:(v)=>`https://dribbble.com/${v}`,                     n:"Dribbble" },
  threads:      { i:"fab fa-threads",        c:"#000",    u:(v)=>`https://threads.net/${v.replace("@","")}`,      n:"Threads" },
  bluesky:      { i:"fas fa-cloud",          c:"#1185FE", u:(v)=>`https://bsky.app/profile/${v.replace("@","")}`, n:"Bluesky" },
  npm:          { i:"fab fa-npm",            c:"#CC3534", u:(v)=>`https://npmjs.com/~${v.replace("~","")}`,       n:"npm" },
  codepen:      { i:"fab fa-codepen",        c:"#111",    u:(v)=>`https://codepen.io/${v}`,                       n:"CodePen" },
  stackoverflow:{ i:"fab fa-stack-overflow", c:"#F58025", u:(v)=>`https://stackoverflow.com/users/${v}`,          n:"Stack Overflow" },
};

function age(dob) {
  if (!dob) return null;
  const t = new Date(), b = new Date(dob);
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a > 0 ? a : null;
}

function ShareSheet({ url, name, onClose }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); }
    catch (_) {
      const el = document.createElement("textarea");
      el.value = url; document.body.appendChild(el);
      el.select(); document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const opts = [
    { label:"Copy Link",  icon:"fas fa-link",          bg:"#f0edff", fg:"#6C63FF", fn: copy },
    { label:"WhatsApp",   icon:"fab fa-whatsapp",       bg:"#edfaf3", fg:"#25D366", fn:()=>window.open(`https://wa.me/?text=${enc(url)}`) },
    { label:"Telegram",   icon:"fab fa-telegram",       bg:"#edf7fd", fg:"#26A5E4", fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}`) },
    { label:"Twitter",    icon:"fab fa-x-twitter",      bg:"#f5f5f5", fg:"#000",    fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc(name+" "+url)}`) },
    { label:"Facebook",   icon:"fab fa-facebook-f",     bg:"#eef4ff", fg:"#1877F2", fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`) },
    { label:"LinkedIn",   icon:"fab fa-linkedin-in",    bg:"#e8f3fc", fg:"#0A66C2", fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}`) },
    { label:"Reddit",     icon:"fab fa-reddit-alien",   bg:"#fff2ed", fg:"#FF4500", fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}`) },
    { label:"Email",      icon:"fas fa-envelope",       bg:"#fef2f2", fg:"#EA4335", fn:()=>window.open(`mailto:?subject=${enc(name)}&body=${enc(url)}`) },
    { label:"SMS",        icon:"fas fa-comment-sms",    bg:"#f0fdf4", fg:"#10b981", fn:()=>window.open(`sms:?body=${enc(url)}`) },
  ];

  return (
    <div onClick={onClose}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,.48)",zIndex:999,
              display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:"#fff",borderRadius:"24px 24px 0 0",padding:"8px 0 36px",
                width:"100%",maxWidth:500,
                animation:"shUp .25s cubic-bezier(.34,1.56,.64,1) both"}}>
        {/* Handle */}
        <div style={{width:36,height:4,background:"#e5e7eb",borderRadius:2,margin:"12px auto 20px"}}/>
        {/* Header */}
        <div style={{padding:"0 20px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#111827"}}>Share</div>
            <div style={{fontSize:12,color:"#9ca3af",marginTop:2,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
          </div>
          <button onClick={onClose}
            style={{width:34,height:34,borderRadius:"50%",background:"#f3f4f6",border:"none",
                    fontSize:16,color:"#6b7280",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                    outline:"none",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>
        {/* Grid */}
        <div style={{padding:"18px 16px 0",display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {opts.map(o=>(
            <button key={o.label} onClick={o.fn}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                      width:72,padding:"10px 4px",borderRadius:14,border:"none",
                      background:"transparent",cursor:"pointer",
                      outline:"none",WebkitTapHighlightColor:"transparent",
                      transition:"background .12s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:52,height:52,borderRadius:14,background:o.bg,
                           color:o.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
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

export default function ProfilePage({ user, pageUrl }) {
  const [shareOpen, setShareOpen] = useState(false);

  if (!user) {
    return (
      <>
        <Head>
          <title>Not found — mywebsam</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#fafafa;color:#111;}`}</style>
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",background:"#fafafa"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#fef2f2",border:"2px solid #fca5a5",
                       display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:32,color:"#ef4444"}}>
            <i className="fas fa-user-slash"/>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,marginBottom:8,color:"#111827"}}>Profile Not Found</h1>
          <p style={{color:"#6b7280",marginBottom:28,lineHeight:1.6}}>This username doesn't exist yet.</p>
          <a href="/" style={{background:"#6C63FF",color:"#fff",padding:"12px 28px",borderRadius:999,
                              fontWeight:700,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,
                              boxShadow:"0 4px 16px rgba(108,99,255,.35)",textDecoration:"none",
                              outline:"none",WebkitTapHighlightColor:"transparent"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const userAge      = age(user.dob);
  const socials      = Object.entries(user.socialProfiles||{}).filter(([,v])=>v?.trim()).filter(([k])=>P[k]);
  const interestTags = Object.values(user.interests||{}).flat().filter(v=>v&&typeof v==="string").slice(0,16);

  return (
    <>
      <Head>
        <title>{user.name} (@{user.username})</title>
        <meta name="description"        content={user.aboutme||user.bio||`${user.name} on mywebsam`}/>
        <meta property="og:title"       content={`${user.name} — mywebsam`}/>
        <meta property="og:description" content={user.aboutme||user.bio||""}/>
        {user.avatar && <meta property="og:image" content={user.avatar}/>}
        <meta name="viewport"           content="width=device-width,initial-scale=1"/>
        <meta name="twitter:card"       content="summary_large_image"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html{min-height:100%;}
          body{
            font-family:'Plus Jakarta Sans',sans-serif;
            background:#0f0f0f;
            color:#fff;
            min-height:100vh;
            -webkit-font-smoothing:antialiased;
          }
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;color:inherit;text-decoration:none;}

          /* ── Animations ── */
          @keyframes shUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
          .a0{animation:fadeIn .5s .0s ease both;}
          .a1{animation:fadeIn .5s .08s ease both;}
          .a2{animation:fadeIn .5s .16s ease both;}
          .a3{animation:fadeIn .5s .24s ease both;}
          .a4{animation:fadeIn .5s .32s ease both;}
          .a5{animation:fadeIn .5s .40s ease both;}

          /* ── Share button fixed ── */
          .share-fab{
            position:fixed;
            top:16px;right:16px;
            width:42px;height:42px;
            border-radius:50%;
            background:rgba(255,255,255,0.12);
            border:1px solid rgba(255,255,255,0.2);
            backdrop-filter:blur(12px);
            -webkit-backdrop-filter:blur(12px);
            display:flex;align-items:center;justify-content:center;
            font-size:15px;color:#fff;
            cursor:pointer;
            z-index:90;
            transition:background .15s,transform .12s;
            border:none;
          }
          .share-fab:hover{background:rgba(255,255,255,0.22);transform:scale(1.06);}
          .share-fab:active{transform:scale(0.94);}

          /* ── Hero ── */
          .hero{
            width:100%;
            height:56vw;
            max-height:380px;
            min-height:220px;
            position:relative;
            overflow:hidden;
          }
          .hero-img{
            width:100%;height:100%;
            object-fit:cover;
            object-position:center 15%;
            display:block;
          }
          .hero-fade{
            position:absolute;inset:0;
            background:linear-gradient(
              to bottom,
              rgba(15,15,15,0) 30%,
              rgba(15,15,15,0.6) 70%,
              rgba(15,15,15,1) 100%
            );
          }
          .hero-none{height:60px;}

          /* ── Page ── */
          .page{
            max-width:480px;
            margin:0 auto;
            padding:0 18px 80px;
          }

          /* ── Avatar (only when no photo hero) ── */
          .av-center{
            display:flex;justify-content:center;
            margin:28px 0 0;
          }
          .av-ring{
            width:96px;height:96px;border-radius:50%;
            object-fit:cover;
            border:3px solid rgba(255,255,255,0.25);
            box-shadow:0 8px 32px rgba(0,0,0,.5);
            background:linear-gradient(135deg,#6C63FF,#a78bfa);
            display:flex;align-items:center;justify-content:center;
            font-size:38px;font-weight:800;color:#fff;
          }

          /* ── Identity ── */
          .id-block{text-align:center;margin-bottom:20px;}
          .pname{
            font-size:clamp(24px,6.5vw,32px);
            font-weight:800;color:#fff;
            letter-spacing:-0.025em;line-height:1.1;
            margin-bottom:4px;
          }
          .phandle{font-size:13px;color:rgba(255,255,255,0.45);font-weight:500;margin-bottom:12px;}
          .meta-chips{display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin-bottom:13px;}
          .chip{
            display:inline-flex;align-items:center;gap:5px;
            font-size:12px;color:rgba(255,255,255,0.65);
            background:rgba(255,255,255,0.08);
            border:1px solid rgba(255,255,255,0.12);
            padding:5px 13px;border-radius:999px;
          }
          .pbio{
            font-size:14px;color:rgba(255,255,255,0.65);
            line-height:1.78;
            max-width:320px;margin:0 auto;
          }

          /* ── Socials ── */
          .soc-wrap{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:9px;
            margin-bottom:26px;
          }
          .soc-btn{
            width:46px;height:46px;border-radius:14px;
            display:flex;align-items:center;justify-content:center;
            font-size:19px;
            border:1px solid rgba(255,255,255,0.1);
            background:rgba(255,255,255,0.06);
            transition:transform .14s,background .14s,box-shadow .14s;
          }
          .soc-btn:hover{
            transform:translateY(-3px) scale(1.06);
            background:rgba(255,255,255,0.14);
            box-shadow:0 8px 22px rgba(0,0,0,.35);
          }
          .soc-btn:active{transform:scale(0.94);}

          /* ── Links ── */
          .links-col{
            display:flex;flex-direction:column;
            gap:11px;margin-bottom:26px;
          }
          .lbtn{
            display:flex;align-items:center;
            width:100%;
            min-height:58px;
            padding:0;
            background:rgba(255,255,255,0.07);
            border:1px solid rgba(255,255,255,0.1);
            border-radius:16px;
            cursor:pointer;
            transition:background .15s,transform .14s,box-shadow .15s;
            overflow:hidden;
            position:relative;
          }
          .lbtn:hover{
            background:rgba(255,255,255,0.13);
            transform:translateY(-2px);
            box-shadow:0 10px 30px rgba(0,0,0,.3);
          }
          .lbtn:active{transform:scale(0.98);}
          .lbtn-ic{
            width:58px;height:58px;
            display:flex;align-items:center;justify-content:center;
            font-size:17px;
            color:rgba(255,255,255,0.55);
            flex-shrink:0;
            border-right:1px solid rgba(255,255,255,0.07);
          }
          .lbtn-txt{
            flex:1;text-align:center;
            font-size:15px;font-weight:700;
            color:#fff;padding:0 14px;
            letter-spacing:-0.01em;
          }
          .lbtn-arr{
            width:44px;height:58px;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;color:rgba(255,255,255,0.25);
            flex-shrink:0;
          }

          /* ── Spotify ── */
          .sp-block{margin-bottom:26px;}
          .sec-lbl{
            display:flex;align-items:center;justify-content:center;
            gap:6px;margin-bottom:12px;
            font-size:11px;font-weight:700;
            letter-spacing:.08em;text-transform:uppercase;
            color:rgba(255,255,255,0.35);
          }
          .sp-frame{border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.4);}

          /* ── Interests ── */
          .int-block{margin-bottom:26px;}
          .int-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;}
          .itag{
            padding:7px 15px;border-radius:999px;
            font-size:12px;font-weight:600;
            color:rgba(255,255,255,0.72);
            background:rgba(255,255,255,0.07);
            border:1px solid rgba(255,255,255,0.1);
            transition:background .13s;
          }
          .itag:hover{background:rgba(255,255,255,0.13);}

          /* ── Footer ── */
          .pfoot{
            text-align:center;
            padding:6px 0;
            font-size:12px;color:rgba(255,255,255,0.22);
          }
          .pfoot a{color:rgba(255,255,255,0.4);font-weight:700;}
          .pfoot a:hover{color:rgba(255,255,255,0.8);}
          .pfoot-top{
            display:inline-flex;align-items:center;
            gap:5px;margin-bottom:4px;
          }

          /* ── Responsive ── */
          @media(max-width:440px){
            .hero{height:60vw;}
            .pname{font-size:24px;}
            .lbtn-txt{font-size:14px;}
            .soc-btn{width:42px;height:42px;font-size:17px;border-radius:12px;}
            .page{padding:0 14px 60px;}
          }
        `}</style>
      </Head>

      {/* Share FAB */}
      <button className="share-fab" onClick={()=>setShareOpen(true)} aria-label="Share">
        <i className="fas fa-share-nodes"/>
      </button>

      {/* Hero — photo fills top */}
      {user.avatar ? (
        <div className="hero a0">
          <img src={user.avatar} alt={user.name} className="hero-img"/>
          <div className="hero-fade"/>
        </div>
      ) : (
        <div className="hero-none"/>
      )}

      <div className="page">

        {/* Avatar shown only if no hero photo */}
        {!user.avatar && (
          <div className="av-center a0">
            <div className="av-ring">{user.name?.charAt(0)?.toUpperCase()||"?"}</div>
          </div>
        )}

        {/* Name + handle + meta + bio */}
        <div className={`id-block ${user.avatar?"a1":"a1"}`} style={{paddingTop: user.avatar ? 0 : 18}}>
          <div className="pname">{user.name}</div>
          <div className="phandle">@{user.username}</div>

          {(user.location || userAge) && (
            <div className="meta-chips">
              {user.location && (
                <span className="chip">
                  <i className="fas fa-location-dot" style={{fontSize:10,color:"#a78bfa"}}/>
                  {user.location}
                </span>
              )}
              {userAge && (
                <span className="chip">
                  <i className="fas fa-cake-candles" style={{fontSize:10,color:"#fbbf24"}}/>
                  {userAge} years old
                </span>
              )}
            </div>
          )}

          {(user.aboutme||user.bio) && (
            <p className="pbio">{user.aboutme||user.bio}</p>
          )}
        </div>

        {/* Social icons */}
        {socials.length > 0 && (
          <div className="soc-wrap a2">
            {socials.map(([pl,val])=>{
              const m=P[pl];
              return (
                <a key={pl} href={m.u(val)} target="_blank" rel="noopener noreferrer"
                  className="soc-btn" title={m.n} style={{color:m.c}}>
                  <i className={m.i}/>
                </a>
              );
            })}
          </div>
        )}

        {/* Links */}
        {(user.links||[]).length>0 && (
          <div className="links-col a3">
            {user.links.map((lnk,i)=>(
              <a key={lnk.id||i} href={lnk.url} target="_blank" rel="noopener noreferrer" className="lbtn">
                <div className="lbtn-ic"><i className={lnk.icon||"fas fa-link"}/></div>
                <div className="lbtn-txt">{lnk.title}</div>
                <div className="lbtn-arr"><i className="fas fa-chevron-right"/></div>
              </a>
            ))}
          </div>
        )}

        {/* Spotify embed */}
        {user.favSongTrackId && (
          <div className="sp-block a4">
            <div className="sec-lbl">
              <i className="fab fa-spotify" style={{color:"#1DB954",fontSize:13}}/>
              Currently Vibing To
            </div>
            <div className="sp-frame">
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
        {interestTags.length>0 && (
          <div className="int-block a4">
            <div className="sec-lbl">
              <i className="fas fa-sparkles" style={{color:"#fbbf24",fontSize:11}}/>
              Interests
            </div>
            <div className="int-tags">
              {interestTags.map((t,i)=><span key={i} className="itag">{t}</span>)}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pfoot a5">
          <div className="pfoot-top">
            <img src="/icon.png" alt="mywebsam"
              style={{width:16,height:16,borderRadius:4,verticalAlign:"middle",opacity:.6}}/>
            <a href="/"><strong>mywebsam</strong></a>
          </div>
          <div>Your link in bio — <a href="/">Create yours free</a></div>
        </div>

      </div>

      {/* Share sheet (custom — no navigator.share) */}
      {shareOpen && (
        <ShareSheet url={pageUrl} name={user.name} onClose={()=>setShareOpen(false)}/>
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
  } catch(e) {
    console.error(e);
    const host  = req?.headers?.host || "mywebsammu.vercel.app";
    const proto = host.startsWith("localhost") ? "http" : "https";
    return { props: { user:null, pageUrl:`${proto}://${host}/${params.username}` } };
  }
}
