// pages/[username].js
import Head from "next/head";
import { useState, useEffect } from "react";
import clientPromise from "../lib/mongodb";

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
    {l:"Copy Link",ic:"fas fa-copy",       bg:"#1a1a2a",fg:"#a78bfa",fn:doCopy},
    {l:"WhatsApp", ic:"fab fa-whatsapp",   bg:"#0d1f15",fg:"#25D366",fn:()=>window.open(`https://wa.me/?text=${enc(name+" "+url)}`)},
    {l:"Telegram", ic:"fab fa-telegram",   bg:"#0d1820",fg:"#26A5E4",fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(name)}`)},
    {l:"Twitter",  ic:"fab fa-x-twitter",  bg:"#111",   fg:"#fff",   fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc(name+" "+url)}`)},
    {l:"Facebook", ic:"fab fa-facebook-f", bg:"#0d1220",fg:"#1877F2",fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`)},
    {l:"LinkedIn", ic:"fab fa-linkedin-in",bg:"#0a1520",fg:"#0A66C2",fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}`)},
    {l:"Reddit",   ic:"fab fa-reddit-alien",bg:"#1f1208",fg:"#FF4500",fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}`)},
    {l:"Email",    ic:"fas fa-envelope",   bg:"#1f0d0d",fg:"#EA4335",fn:()=>window.open(`mailto:?subject=${enc(name)}&body=${enc(url)}`)},
    {l:"SMS",      ic:"fas fa-comment-sms",bg:"#0d1f15",fg:"#1DB954",fn:()=>window.open(`sms:?body=${enc(url)}`)},
  ];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,paddingBottom:44,animation:"ssUp .28s cubic-bezier(.34,1.4,.64,1) both"}}>
        <style>{`@keyframes ssUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
        <div style={{display:"flex",justifyContent:"center",padding:"14px 0 8px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#2a2a2a"}}/>
        </div>
        <div style={{padding:"8px 20px 14px",borderBottom:"1px solid #1e1e1e",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:800,fontSize:15,color:"#fff"}}>Share</div>
            <div style={{fontSize:11,color:"#444",marginTop:2,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",background:"#1a1a1a",border:"1px solid #2a2a2a",fontSize:17,color:"#555",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>
        <div style={{padding:"14px 10px 0",display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {opts.map(o=>(
            <button key={o.l} onClick={o.fn} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,width:72,padding:"10px 4px",border:"none",background:"transparent",cursor:"pointer",borderRadius:14,outline:"none",WebkitTapHighlightColor:"transparent",transition:"background .12s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#161616"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:52,height:52,borderRadius:14,background:o.bg,color:o.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                {o.l==="Copy Link"&&copied?<i className="fas fa-check" style={{color:"#1DB954"}}/>:<i className={o.ic}/>}
              </div>
              <span style={{fontSize:10.5,fontWeight:600,color:"#555",textAlign:"center",lineHeight:1.2}}>{o.l==="Copy Link"&&copied?"Copied!":o.l}</span>
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

  useEffect(()=>{
    if (user?.username) track(user.username, "view");
  },[]);

  if (!user) {
    return (
      <>
        <Head>
          <title>Not Found | mywebsam</title>
          <meta name="robots" content="noindex"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#080808;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;}`}</style>
        </Head>
        <div style={{textAlign:"center",padding:32}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#111",border:"1px solid #222",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32,color:"#333"}}>
            <i className="fas fa-user-slash"/>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Profile Not Found</h1>
          <p style={{color:"#444",marginBottom:28}}>This username doesn't exist yet.</p>
          <a href="/" style={{background:"#fff",color:"#000",padding:"12px 28px",borderRadius:999,fontWeight:800,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,outline:"none",WebkitTapHighlightColor:"transparent"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const userAge   = calcAge(user.dob);
  const socials   = Object.entries(user.socialProfiles||{}).filter(([,v])=>v?.trim()).filter(([k])=>PLAT[k]);
  const interests = Object.values(user.interests||{}).flat().filter(v=>v&&typeof v==="string").slice(0,12);
  const bio       = user.aboutme||user.bio||"";
  const ptitle    = `${user.name} | mywebsam`;
  const badge     = user.interests?.role;
  const badgeIcon = badge && BADGE_ICONS[badge];
  const badgeLabel= badge ? badge.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase()) : null;

  return (
    <>
      <Head>
        <title>{ptitle}</title>
        <meta name="description"         content={bio||`${user.name}'s profile on mywebsam`}/>
        <meta name="viewport"            content="width=device-width,initial-scale=1"/>
        <meta name="theme-color"         content="#080808"/>
        <meta property="og:type"         content="profile"/>
        <meta property="og:title"        content={ptitle}/>
        <meta property="og:description"  content={bio||`${user.name}'s links on mywebsam`}/>
        <meta property="og:url"          content={pageUrl}/>
        <meta property="og:site_name"    content="mywebsam"/>
        <meta property="og:image"        content={avatarUrl}/>
        <meta property="og:image:width"  content="400"/>
        <meta property="og:image:height" content="400"/>
        <meta property="og:image:type"   content="image/jpeg"/>
        <meta name="twitter:card"        content="summary_large_image"/>
        <meta name="twitter:title"       content={ptitle}/>
        <meta name="twitter:description" content={bio||`${user.name}'s links on mywebsam`}/>
        <meta name="twitter:image"       content={avatarUrl}/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{background:#080808;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;overflow-x:hidden;}

          @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
          @keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
          @keyframes breathe{0%,100%{opacity:.9;}50%{opacity:.4;}}

          /* stagger helpers */
          .s1{animation:slideUp .55s .06s cubic-bezier(.22,.68,0,1.1) both;}
          .s2{animation:slideUp .55s .14s cubic-bezier(.22,.68,0,1.1) both;}
          .s3{animation:slideUp .55s .22s cubic-bezier(.22,.68,0,1.1) both;}
          .s4{animation:slideUp .55s .30s cubic-bezier(.22,.68,0,1.1) both;}
          .s5{animation:slideUp .55s .38s cubic-bezier(.22,.68,0,1.1) both;}
          .s6{animation:slideUp .55s .46s cubic-bezier(.22,.68,0,1.1) both;}
          .s7{animation:slideUp .55s .54s cubic-bezier(.22,.68,0,1.1) both;}

          /* ── HERO — centered, full-width photo filling top half ── */
          .hero{
            position:relative;
            width:100%;
            height:58vh;
            min-height:320px;
            max-height:520px;
            overflow:hidden;
            animation:fadeIn .6s ease both;
          }
          .hero-img{
            width:100%;
            height:100%;
            object-fit:cover;
            object-position:center top;
            display:block;
          }
          /* smooth gradient fade to pure black — no hard cut */
          .hero-fade{
            position:absolute;inset:0;pointer-events:none;
            background:linear-gradient(
              to bottom,
              rgba(8,8,8,0)    0%,
              rgba(8,8,8,0)    30%,
              rgba(8,8,8,.25)  55%,
              rgba(8,8,8,.78)  78%,
              rgba(8,8,8,1)    100%
            );
          }

          /* No photo fallback */
          .hero-ph{
            width:100%;height:58vh;min-height:320px;max-height:520px;
            background:#0e0e0e;
            display:flex;align-items:center;justify-content:center;
          }
          .av-ph{
            width:100px;height:100px;border-radius:50%;
            background:#1a1a1a;border:2px solid #2a2a2a;
            display:flex;align-items:center;justify-content:center;
            font-size:40px;font-weight:800;color:#fff;
          }

          /* ── IDENTITY ── */
          .id-block{
            text-align:center;
            padding:20px 20px 0;
          }
          .pname{
            font-size:clamp(32px,8.5vw,52px);
            font-weight:800;
            color:#fff;
            letter-spacing:-0.025em;
            line-height:1.05;
            margin-bottom:10px;
          }
          /* badge row — no @handle */
          .badge-row{
            display:flex;align-items:center;justify-content:center;
            flex-wrap:wrap;gap:8px;margin-bottom:4px;
          }
          .age-pill{
            display:inline-flex;align-items:center;
            background:rgba(255,255,255,.07);
            border:1px solid rgba(255,255,255,.12);
            border-radius:999px;padding:4px 13px;
            font-size:12px;font-weight:600;color:rgba(255,255,255,.5);
          }
          .badge-pill{
            display:inline-flex;align-items:center;gap:6px;
            background:rgba(255,255,255,.09);
            border:1px solid rgba(255,255,255,.16);
            border-radius:999px;padding:4px 14px;
            font-size:12px;font-weight:700;
            color:rgba(255,255,255,.72);
          }
          .badge-pill i{font-size:11px;opacity:.8;}

          /* ── CONTENT ── */
          .content{
            max-width:460px;
            margin:0 auto;
            padding:18px 18px 80px;
          }

          /* Bio */
          .bio-text{
            font-size:14px;line-height:1.8;
            color:rgba(255,255,255,.42);
            text-align:center;
            margin-bottom:22px;
          }

          /* Interest tags */
          .int-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-bottom:24px;}
          .itag{
            padding:6px 14px;border-radius:999px;
            font-size:12px;font-weight:600;
            color:rgba(255,255,255,.5);
            background:#111;border:1px solid #1e1e1e;
            transition:background .13s,color .13s,border-color .13s,transform .18s cubic-bezier(.34,1.56,.64,1);
          }
          .itag:hover{background:#1a1a1a;border-color:#2d2d2d;color:rgba(255,255,255,.85);transform:translateY(-2px);}

          /* Social icons */
          .soc-row{
            display:flex;justify-content:center;flex-wrap:wrap;gap:9px;
            margin-bottom:24px;
          }
          .soc-btn{
            width:46px;height:46px;border-radius:13px;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
            background:#111;border:1px solid #1e1e1e;
            transition:transform .18s cubic-bezier(.34,1.56,.64,1),background .13s,border-color .13s,box-shadow .13s;
            position:relative;
          }
          .soc-btn::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(255,255,255,.05),transparent);pointer-events:none;}
          .soc-btn:hover{transform:translateY(-4px) scale(1.07);background:#181818;border-color:#2c2c2c;box-shadow:0 10px 26px rgba(0,0,0,.55);}
          .soc-btn:active{transform:scale(.93);}

          /* Link buttons */
          .links{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
          .lbtn{
            display:flex;align-items:center;
            width:100%;min-height:60px;
            background:#111;border:1px solid #1e1e1e;border-radius:16px;
            cursor:pointer;overflow:hidden;position:relative;
            transition:transform .18s cubic-bezier(.34,1.56,.64,1),background .13s,border-color .13s,box-shadow .13s;
          }
          .lbtn::before{content:"";position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(to bottom,rgba(255,255,255,.04),transparent);pointer-events:none;}
          .lbtn:hover{transform:translateY(-3px) scale(1.01);background:#181818;border-color:#2c2c2c;box-shadow:0 12px 34px rgba(0,0,0,.5);}
          .lbtn:active{transform:scale(.98);}
          .lbtn-ic{
            width:60px;min-height:60px;overflow:hidden;
            display:flex;align-items:center;justify-content:center;
            font-size:17px;color:rgba(255,255,255,.38);
            flex-shrink:0;border-right:1px solid #181818;
            transition:color .13s;
          }
          .lbtn:hover .lbtn-ic{color:rgba(255,255,255,.75);}
          .lbtn-t{
            flex:1;text-align:center;
            font-size:15px;font-weight:700;color:#f0f0f0;
            padding:0 14px;letter-spacing:-.01em;
          }
          .lbtn-a{
            width:44px;min-height:60px;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;color:rgba(255,255,255,.15);flex-shrink:0;
            transition:color .13s,transform .18s;
          }
          .lbtn:hover .lbtn-a{color:rgba(255,255,255,.45);transform:translateX(3px);}

          /* Spotify */
          .sp-block{margin-bottom:24px;}
          .sp-trig{
            display:flex;align-items:center;gap:14px;padding:13px 16px;
            background:#111;border:1px solid #1e1e1e;border-radius:16px;cursor:pointer;
            position:relative;overflow:hidden;
            transition:background .13s,border-color .13s;
          }
          .sp-trig::before{content:"";position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(to bottom,rgba(255,255,255,.03),transparent);pointer-events:none;}
          .sp-trig:hover{background:#181818;border-color:#2c2c2c;}
          .sp-trig.open{border-radius:16px 16px 0 0;border-bottom-color:transparent;}
          .sp-art{
            width:48px;height:48px;border-radius:10px;
            background:#0d1f15;border:1px solid rgba(29,185,84,.2);
            display:flex;align-items:center;justify-content:center;
            font-size:22px;color:#1DB954;flex-shrink:0;
          }
          .sp-meta{flex:1;min-width:0;}
          .sp-eye{font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(29,185,84,.65);margin-bottom:3px;display:flex;align-items:center;gap:5px;}
          .sp-dot{width:5px;height:5px;border-radius:50%;background:#1DB954;animation:breathe 2s ease infinite;flex-shrink:0;}
          .sp-title{font-size:14px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
          .sp-artist{font-size:12px;color:rgba(255,255,255,.32);margin-top:1px;}
          .sp-caret{font-size:12px;color:rgba(255,255,255,.22);transition:transform .25s cubic-bezier(.34,1.56,.64,1);flex-shrink:0;}
          .sp-caret.open{transform:rotate(180deg);}
          .sp-embed{border:1px solid #1e1e1e;border-top:none;border-radius:0 0 16px 16px;overflow:hidden;}

          /* Footer */
          .foot{text-align:center;padding:4px 0;}
          .foot-logo{display:inline-flex;align-items:center;gap:5px;margin-bottom:3px;}
          .foot a{font-size:12px;color:#252525;font-weight:700;}
          .foot a:hover{color:#454545;}
          .foot-sub{font-size:11px;color:#1e1e1e;}

          /* Share FAB */
          .sfab{
            position:fixed;top:16px;right:16px;
            width:44px;height:44px;border-radius:50%;
            background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
            backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
            display:flex;align-items:center;justify-content:center;
            font-size:15px;color:rgba(255,255,255,.65);cursor:pointer;z-index:80;
            transition:background .13s,transform .13s,color .13s;
          }
          .sfab:hover{background:rgba(255,255,255,.16);color:#fff;transform:scale(1.08);}
          .sfab:active{transform:scale(.92);}

          @media(max-width:420px){
            .hero{height:54vh;}
            .pname{font-size:30px;}
            .content{padding:16px 14px 64px;}
            .lbtn{min-height:56px;border-radius:14px;}
            .soc-btn{width:42px;height:42px;font-size:16px;border-radius:11px;}
          }
        `}</style>
      </Head>

      {/* Share FAB */}
      <button className="sfab" onClick={()=>{
        setShareOpen(true);
        track(user.username,"share");
      }} aria-label="Share">
        <i className="fas fa-share-nodes"/>
      </button>

      {/* ── HERO — full width centered photo ── */}
      {user.avatar ? (
        <div className="hero">
          <img src={user.avatar} alt={user.name} className="hero-img"/>
          <div className="hero-fade"/>
        </div>
      ) : (
        <div className="hero-ph">
          <div className="av-ph">{user.name?.charAt(0)?.toUpperCase()||"?"}</div>
        </div>
      )}

      {/* ── Identity block — name + badge only, NO @handle ── */}
      <div className="id-block s1">
        <div className="pname">{user.name}</div>
        <div className="badge-row">
          {userAge && <span className="age-pill">{userAge}</span>}
          {badgeLabel && (
            <span className="badge-pill">
              {badgeIcon && <i className={badgeIcon}/>}
              {badgeLabel}
            </span>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="content">

        {bio && <p className="bio-text s2">{bio}</p>}

        {interests.length > 0 && (
          <div className="int-tags s3">
            {interests.map((t,i)=><span key={i} className="itag">{t}</span>)}
          </div>
        )}

        {socials.length > 0 && (
          <div className="soc-row s3">
            {socials.map(([pl,val])=>{
              const m=PLAT[pl];
              return(
                <a key={pl} href={m.u(val)} target="_blank" rel="noopener noreferrer"
                  className="soc-btn" title={m.n} style={{color:m.c}}>
                  <i className={m.i}/>
                </a>
              );
            })}
          </div>
        )}

        {(user.links||[]).length > 0 && (
          <div className="links s4">
            {user.links.map((lnk,i)=>(
              <a key={lnk.id||i} href={lnk.url} target="_blank" rel="noopener noreferrer"
                className="lbtn"
                onClick={()=>track(user.username,"link_click")}>
                <div className="lbtn-ic">
                  {lnk.icon?.startsWith("data:")
                    ? <img src={lnk.icon} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} alt=""/>
                    : lnk.icon?.startsWith("fas ")||lnk.icon?.startsWith("fab ")
                      ? <i className={lnk.icon}/>
                      : <span style={{fontSize:20}}>{lnk.icon||"🔗"}</span>}
                </div>
                <div className="lbtn-t">{lnk.title}</div>
                <div className="lbtn-a"><i className="fas fa-arrow-up-right-from-square"/></div>
              </a>
            ))}
          </div>
        )}

        {user.favSongTrackId && (
          <div className="sp-block s5">
            <div className={`sp-trig${spOpen?" open":""}`}
              onClick={()=>{setSpOpen(v=>!v);if(!spOpen)track(user.username,"spotify_play");}}>
              <div className="sp-art"><i className="fab fa-spotify"/></div>
              <div className="sp-meta">
                <div className="sp-eye"><span className="sp-dot"/>Currently Vibing To</div>
                <div className="sp-title">{user.favSong||"My Favourite Song"}</div>
                {user.favArtist&&<div className="sp-artist">{user.favArtist}</div>}
              </div>
              <i className={`fas fa-chevron-down sp-caret${spOpen?" open":""}`}/>
            </div>
            {spOpen&&(
              <div className="sp-embed">
                <iframe
                  src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0`}
                  width="100%" height="380" frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy" style={{display:"block"}}
                />
              </div>
            )}
          </div>
        )}

        <div className="foot s7">
          <div className="foot-logo">
            <img src="/icon.png" alt="mywebsam" style={{width:15,height:15,borderRadius:3,verticalAlign:"middle",opacity:.35}}/>
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
    const client    = await clientPromise;
    const db        = client.db(process.env.DB_NAME);
    const user      = await db.collection("users").findOne(
      { username: params.username.toLowerCase() },
      { projection: { _id: 0 } }
    );
    const host      = req.headers.host || "mywebsammu.vercel.app";
    const proto     = host.startsWith("localhost") ? "http" : "https";
    const base      = `${proto}://${host}`;
    const pageUrl   = `${base}/${params.username.toLowerCase()}`;
    const avatarUrl = `${base}/api/avatar/${params.username.toLowerCase()}`;
    if (!user) return { props: { user:null, pageUrl, avatarUrl } };
    return {
      props: {
        pageUrl, avatarUrl,
        user: JSON.parse(JSON.stringify({
          username:       user.username       || "",
          name:           user.name           || "",
          dob:            user.dob            || null,
          bio:            user.bio            || "",
          aboutme:        user.aboutme        || "",
          avatar:         user.avatar         || "",
          socialProfiles: user.socialProfiles || {},
          links:          user.links          || [],
          interests:      user.interests      || {},
          favSong:        user.favSong        || "",
          favArtist:      user.favArtist      || "",
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
