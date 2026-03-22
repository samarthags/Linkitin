// pages/index.js — mywebsam Landing Page
// Domain root → this page. "Create Profile" → /create
import Head from "next/head";
import { useEffect, useState } from "react";

const SITE_URL = "https://mywebsam.site";
const OG_IMAGE  = `${SITE_URL}/og.png`;  // place a 1200×630 image at /public/og.png

// Rotating words for the hero
const WORDS = ["Create", "Publish", "Share", "Analyse", "Shine"];

export default function Landing() {
  const [visible,  setVisible]  = useState(false);
  const [wordIdx,  setWordIdx]  = useState(0);
  const [fade,     setFade]     = useState(true);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  // Cycle words every 1.8s with fade
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length);
        setFade(true);
      }, 220);
    }, 1900);
    return () => clearInterval(id);
  }, []);

  const features = [
    { icon:"fas fa-user-circle",         title:"Link in Bio",         desc:"One clean URL with your photo, socials, links and story." },
    { icon:"fas fa-certificate",         title:"Professional Badge",   desc:"Coder, Designer, Trader, Doctor — own your identity." },
    { icon:"fab fa-spotify",             title:"Spotify Player",       desc:"Show what you're listening to with an embedded player." },
    { icon:"fas fa-wand-magic-sparkles", title:"AI Bio Generator",     desc:"Type a line, AI writes your full bio instantly." },
    { icon:"fas fa-share-nodes",         title:"Share Everywhere",     desc:"WhatsApp, Instagram, Telegram — one tap." },
    { icon:"fas fa-chart-bar",           title:"Profile Analytics",    desc:"Track views, link clicks and Spotify plays." },
  ];

  const steps = [
    { n:"01", t:"Pick your username",     d:"Your profile lives at mywebsam.site/you" },
    { n:"02", t:"Add badge, links & song", d:"Photo, socials, external links, Spotify, AI bio" },
    { n:"03", t:"Go live instantly",      d:"Publish and share — no account needed" },
  ];

  // JSON-LD structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "mywebsam",
    "url": SITE_URL,
    "description": "Create your personal link-in-bio profile page. Add socials, links, Spotify song, professional badge and AI-written bio.",
    "applicationCategory": "SocialNetworkingApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "author": { "@type": "Person", "name": "Samartha GS" },
    "publisher": { "@type": "Organization", "name": "mywebsam", "url": SITE_URL },
  };

  return (
    <>
      <Head>
        {/* ── Primary ── */}
        <title>mywebsam — Your Link in Bio, Free Forever</title>
        <meta name="description"        content="Create your personal link-in-bio profile page in seconds. Add your photo, professional badge, socials, links, Spotify song and an AI-written bio — all at one URL. Free forever. No account needed."/>
        <meta name="keywords"           content="link in bio, linktree alternative, personal profile page, link in bio free, mywebsam, samartha gs, bio link, social links, spotify profile"/>
        <meta name="author"             content="Samartha GS"/>
        <meta name="creator"            content="Samartha GS"/>
        <meta name="publisher"          content="mywebsam"/>
        <meta name="robots"             content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
        <meta name="viewport"           content="width=device-width,initial-scale=1"/>
        <meta name="theme-color"        content="#0d0d0d"/>
        <link rel="canonical"           href={SITE_URL}/>

        {/* ── Favicon & icons — shows in browser tab and Google ── */}
        <link rel="icon"              type="image/png" sizes="32x32"  href="/icon.png"/>
        <link rel="icon"              type="image/png" sizes="16x16"  href="/icon.png"/>
        <link rel="apple-touch-icon"  sizes="180x180"                 href="/icon.png"/>
        <link rel="shortcut icon"                                      href="/icon.png"/>
        <meta name="msapplication-TileImage" content="/icon.png"/>
        <meta name="msapplication-TileColor" content="#0d0d0d"/>

        {/* ── Open Graph (WhatsApp, Facebook, LinkedIn previews) ── */}
        <meta property="og:type"          content="website"/>
        <meta property="og:site_name"     content="mywebsam"/>
        <meta property="og:title"         content="mywebsam — Your Link in Bio, Free Forever"/>
        <meta property="og:description"   content="Create your personal link-in-bio profile. Add socials, Spotify, badge and AI bio — all at one URL. Free forever."/>
        <meta property="og:url"           content={SITE_URL}/>
        <meta property="og:image"         content={OG_IMAGE}/>
        <meta property="og:image:width"   content="1200"/>
        <meta property="og:image:height"  content="630"/>
        <meta property="og:image:alt"     content="mywebsam — Create your link in bio"/>
        <meta property="og:locale"        content="en_US"/>

        {/* ── Twitter Card ── */}
        <meta name="twitter:card"         content="summary_large_image"/>
        <meta name="twitter:title"        content="mywebsam — Your Link in Bio"/>
        <meta name="twitter:description"  content="Create your personal profile page — socials, links, Spotify, AI bio. Free forever."/>
        <meta name="twitter:image"        content={OG_IMAGE}/>
        <meta name="twitter:creator"      content="@mywebsam"/>

        {/* ── Structured Data (Google Rich Results) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── Fonts & Icons ── */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;scroll-behavior:smooth;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{
            font-family:'Sora',sans-serif;
            background:#0d0d0d;
            color:#fff;
            min-height:100vh;
            overflow-x:hidden;
          }

          @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
          @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
          @keyframes wordFadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
          @keyframes wordFadeOut{from{opacity:1;transform:translateY(0);}to{opacity:0;transform:translateY(-8px);}}

          .vis .a1{animation:fadeUp .65s .04s cubic-bezier(.16,1,.3,1) both;}
          .vis .a2{animation:fadeUp .65s .12s cubic-bezier(.16,1,.3,1) both;}
          .vis .a3{animation:fadeUp .65s .20s cubic-bezier(.16,1,.3,1) both;}
          .vis .a4{animation:fadeUp .65s .28s cubic-bezier(.16,1,.3,1) both;}
          .vis .a5{animation:fadeUp .65s .36s cubic-bezier(.16,1,.3,1) both;}
          .vis .a6{animation:fadeUp .65s .44s cubic-bezier(.16,1,.3,1) both;}

          /* ── HERO ── */
          .hero{
            min-height:100vh;
            display:flex;flex-direction:column;
            align-items:center;justify-content:center;
            padding:60px 20px;
            text-align:center;
            position:relative;
            overflow:hidden;
          }
          .hero::before{
            content:"";position:absolute;
            top:-10%;left:50%;transform:translateX(-50%);
            width:600px;height:600px;
            background:radial-gradient(circle,rgba(255,255,255,.03) 0%,transparent 65%);
            pointer-events:none;
          }

          /* brand name + changing word */
          .brand-line{
            font-size:clamp(42px,13vw,88px);
            font-weight:800;
            letter-spacing:-.04em;
            line-height:1.0;
            color:#fff;
            margin-bottom:6px;
          }
          .brand-static{color:#fff;}
          .word-wrap{
            display:inline-block;
            min-width:200px;
            text-align:center;
          }
          .changing-word{
            display:inline-block;
            background:linear-gradient(90deg,rgba(255,255,255,.45) 0%,#fff 45%,rgba(255,255,255,.45) 100%);
            background-size:200% auto;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            background-clip:text;
            animation:shimmer 3s linear infinite;
            transition:opacity .22s ease, transform .22s ease;
          }
          .changing-word.fade-in{animation:shimmer 3s linear infinite, wordFadeIn .22s ease both;}
          .changing-word.fade-out{opacity:0;transform:translateY(-8px);}

          .hero-sub-line{
            font-size:clamp(15px,3.8vw,20px);
            color:rgba(255,255,255,.35);
            font-weight:400;
            margin-bottom:4px;
            letter-spacing:-.01em;
          }
          .hero-tagline{
            font-size:clamp(13px,3vw,15px);
            color:rgba(255,255,255,.22);
            font-weight:400;
            margin-bottom:40px;
            letter-spacing:.01em;
          }

          .cta-wrap{
            display:flex;align-items:center;gap:12px;
            flex-wrap:wrap;justify-content:center;
          }
          .btn-main{
            display:inline-flex;align-items:center;gap:8px;
            background:#fff;color:#0d0d0d;
            padding:15px 30px;border-radius:999px;
            font-size:15px;font-weight:700;
            font-family:'Sora',sans-serif;
            letter-spacing:-.02em;
            transition:background .13s,transform .13s,box-shadow .13s;
            box-shadow:0 4px 28px rgba(255,255,255,.09);
          }
          .btn-main:hover{background:#efefef;transform:scale(1.03);box-shadow:0 8px 36px rgba(255,255,255,.13);}
          .btn-main:active{transform:scale(.97);}
          .btn-outline{
            display:inline-flex;align-items:center;gap:7px;
            background:transparent;
            border:1px solid rgba(255,255,255,.15);
            color:rgba(255,255,255,.55);
            padding:14px 24px;border-radius:999px;
            font-size:14px;font-weight:600;
            font-family:'Sora',sans-serif;
            transition:border-color .13s,color .13s,transform .12s;
          }
          .btn-outline:hover{border-color:rgba(255,255,255,.3);color:#fff;transform:scale(1.02);}

          /* ── SECTIONS ── */
          .section{
            max-width:960px;margin:0 auto;
            padding:72px 20px;
          }
          .sec-label{
            text-align:center;font-size:10.5px;font-weight:700;
            letter-spacing:.12em;text-transform:uppercase;
            color:rgba(255,255,255,.28);margin-bottom:12px;
          }
          .sec-title{
            text-align:center;
            font-size:clamp(24px,5.5vw,36px);
            font-weight:700;letter-spacing:-.03em;
            color:#fff;margin-bottom:44px;line-height:1.1;
          }

          /* features */
          .grid{
            display:grid;
            grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
            gap:12px;
          }
          .card{
            background:#111;border:1px solid #1c1c1c;
            border-radius:16px;padding:22px;
            transition:border-color .15s,transform .18s;
          }
          .card:hover{border-color:#282828;transform:translateY(-2px);}
          .card-icon{
            width:40px;height:40px;border-radius:10px;
            background:#181818;border:1px solid #222;
            display:flex;align-items:center;justify-content:center;
            font-size:16px;color:rgba(255,255,255,.6);
            margin-bottom:12px;
          }
          .card-t{font-size:14px;font-weight:700;color:#fff;margin-bottom:5px;letter-spacing:-.01em;}
          .card-d{font-size:12.5px;color:rgba(255,255,255,.38);line-height:1.7;}

          /* steps */
          .steps{display:flex;flex-direction:column;gap:10px;max-width:520px;margin:0 auto;}
          .step{
            display:flex;align-items:flex-start;gap:16px;
            padding:18px 20px;
            background:#111;border:1px solid #1c1c1c;border-radius:14px;
          }
          .step-n{
            font-size:10px;font-weight:700;color:rgba(255,255,255,.18);
            letter-spacing:.06em;flex-shrink:0;margin-top:3px;
          }
          .step-title{font-size:14px;font-weight:700;color:#fff;margin-bottom:3px;letter-spacing:-.01em;}
          .step-desc{font-size:12.5px;color:rgba(255,255,255,.38);line-height:1.6;}

          /* bottom cta */
          .cta-box{
            max-width:480px;margin:0 auto;
            padding:44px 28px;
            background:#111;border:1px solid #1c1c1c;border-radius:22px;
            text-align:center;
          }
          .cta-t{font-size:clamp(22px,5vw,30px);font-weight:700;letter-spacing:-.03em;margin-bottom:10px;line-height:1.1;}
          .cta-d{font-size:13px;color:rgba(255,255,255,.35);line-height:1.7;margin-bottom:24px;}

          /* footer */
          footer{
            text-align:center;padding:20px 20px 28px;
            border-top:1px solid #161616;
          }
          .ft-name{font-size:14px;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:-.01em;margin-bottom:5px;}
          .ft-dev{font-size:12px;color:rgba(255,255,255,.18);}
          .ft-dev strong{color:rgba(255,255,255,.32);font-weight:700;}
          .ft-links{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:10px;}
          .ft-links a{font-size:11.5px;color:rgba(255,255,255,.18);font-weight:500;}
          .ft-links a:hover{color:rgba(255,255,255,.45);}
          .ft-sep{color:rgba(255,255,255,.08);}

          @media(max-width:480px){
            .hero{padding:48px 16px;}
            .section{padding:56px 14px;}
            .btn-main{padding:13px 24px;font-size:14px;}
            .cta-box{padding:32px 18px;}
            .word-wrap{min-width:150px;}
          }
        `}</style>
      </Head>

      {/* ── HERO ── */}
      <div className={`hero ${visible ? "vis" : ""}`}>

        {/* mywebsam + changing word */}
        <div className="brand-line a1">
          <span className="brand-static">mywebsam</span>
        </div>
        <div className="brand-line a2" style={{marginBottom:24}}>
          <span className="word-wrap">
            <span className={`changing-word ${fade ? "fade-in" : "fade-out"}`}>
              {WORDS[wordIdx]}
            </span>
          </span>
        </div>

        <p className="hero-sub-line a3">Your personal link in bio — one URL, everything you are.</p>
        <p className="hero-tagline a3">Free forever · No account needed · Live in seconds</p>

        <div className="cta-wrap a4">
          <a href="/create" className="btn-main">
            <i className="fas fa-rocket" style={{fontSize:12}}/>
            Create Your Profile
          </a>
          <a href="#features" className="btn-outline">
            See features
            <i className="fas fa-arrow-down" style={{fontSize:11}}/>
          </a>
        </div>

      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="section">
        <div className="sec-label">What you get</div>
        <div className="sec-title">Everything in one profile</div>
        <div className="grid">
          {features.map((f,i)=>(
            <div key={i} className="card">
              <div className="card-icon"><i className={f.icon}/></div>
              <div className="card-t">{f.title}</div>
              <div className="card-d">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{paddingTop:0}}>
        <div className="sec-label">Simple process</div>
        <div className="sec-title">Live in 3 steps</div>
        <div className="steps">
          {steps.map((s,i)=>(
            <div key={i} className="step">
              <div className="step-n">{s.n}</div>
              <div>
                <div className="step-title">{s.t}</div>
                <div className="step-desc">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="section" style={{paddingTop:0}}>
        <div className="cta-box">
          <div className="cta-t">Ready to go live?</div>
          <div className="cta-d">
            No account. No email. Just open on this device,
            build your profile and share your link.
          </div>
          <a href="/create" className="btn-main" style={{display:"inline-flex"}}>
            <i className="fas fa-rocket" style={{fontSize:12}}/>
            Create for Free
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="ft-name">mywebsam</div>
        <div className="ft-dev">Developed by <strong>Samartha GS</strong></div>
        <div className="ft-links">
          <a href="/create">Create Profile</a>
          <span className="ft-sep">·</span>
          <a href="https://mywebsam.site">mywebsam.site</a>
        </div>
      </footer>
    </>
  );
}
