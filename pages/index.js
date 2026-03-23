// pages/index.js — linkitin Landing Page
import Head from "next/head";
import { useEffect, useState } from "react";

const SITE_URL = "https://linkitin.site";
const OG_IMAGE  = `${SITE_URL}/og-image.png`;

const WORDS = ["Your links.", "Your story.", "Your brand.", "Your identity.", "Your world."];

export default function Landing() {
  const [visible, setVisible] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [fade,    setFade]    = useState(true);
  const [scrolled,setScrolled]= useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setFade(true); }, 240);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const features = [
    { icon: "fas fa-link",                title: "Link in Bio",        desc: "One clean URL with your photo, socials, links and your story — all in one place." },
    { icon: "fas fa-id-badge",            title: "Professional Badge", desc: "Coder, Designer, Trader, Doctor — own your role with a clean identity badge." },
    { icon: "fab fa-spotify",             title: "Spotify Widget",     desc: "Pin the song you're listening to right on your profile." },
    { icon: "fas fa-wand-magic-sparkles", title: "AI Bio Writer",      desc: "Write one sentence about yourself. The AI turns it into a full bio, in your voice." },
    { icon: "fas fa-share-nodes",         title: "Share Anywhere",     desc: "WhatsApp, Instagram, Telegram — one link works everywhere." },
    { icon: "fas fa-chart-line",          title: "Simple Analytics",   desc: "See how many people visit your profile and which links they tap." },
  ];

  const steps = [
    { n: "01", t: "Pick your username", d: "Your profile will live at linkitin.site/yourname" },
    { n: "02", t: "Add your stuff",     d: "Photo, badge, links, Spotify song — and let AI write your bio." },
    { n: "03", t: "Share your link",    d: "Publish and share. No signup, no email, nothing extra." },
  ];

  const faqs = [
    { q: "Is linkitin free?",             a: "Yes, completely free. No hidden plans, no credit card, no catch." },
    { q: "Do I need to make an account?", a: "No. No account, no email. Your profile is saved on your device." },
    { q: "Does it work on mobile?",       a: "Yes — built for mobile first. Build and share from your phone." },
    { q: "What is a link in bio?",        a: "It's one URL you put in your Instagram or TikTok bio that shows all your important links in one page." },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "linkitin",
      "url": SITE_URL,
      "description": "Create your personal link-in-bio profile page. Add your photo, professional badge, socials, Spotify song and an AI-written bio — all at one URL. Free forever. No account needed.",
      "applicationCategory": "SocialNetworkingApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "author": { "@type": "Person", "name": "Samartha GS" },
      "publisher": { "@type": "Organization", "name": "linkitin", "url": SITE_URL, "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",           "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Create Profile", "item": `${SITE_URL}/create` },
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Linkitin — Free Link in Bio | Create Your Profile Page</title>
        <meta name="description" content="Create your free link in bio profile page. Add your photo, badge, social links, Spotify song and AI-written bio — all at one URL. No account needed. Free forever." />
        <meta name="keywords" content="link in bio, free link in bio, linktree alternative, bio link page, personal profile page, linkitin, instagram bio link, link in bio tool, AI bio generator, spotify profile link" />
        <meta name="author"        content="Samartha GS" />
        <meta name="creator"       content="Samartha GS" />
        <meta name="publisher"     content="linkitin" />
        <meta name="robots"        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot"     content="index, follow" />
        <meta name="viewport"      content="width=device-width, initial-scale=1" />
        <meta name="theme-color"   content="#0d0d0d" />
        <meta name="language"      content="English" />
        <meta name="revisit-after" content="3 days" />
        <link rel="canonical" href={SITE_URL} />

        <link rel="icon"             type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="icon"             type="image/png" sizes="16x16" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180"                href="/icon.png" />
        <link rel="shortcut icon"                                    href="/icon.png" />
        <meta name="msapplication-TileImage" content="/icon.png" />
        <meta name="msapplication-TileColor" content="#0d0d0d" />

        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="linkitin" />
        <meta property="og:title"        content="linkitin — Free Link in Bio | Create Your Profile Page" />
        <meta property="og:description"  content="Create your free link in bio profile. Add socials, Spotify, badge and AI bio — all at one URL. No account needed." />
        <meta property="og:url"          content={SITE_URL} />
        <meta property="og:image"        content={OG_IMAGE} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="linkitin — Create your free link in bio page" />
        <meta property="og:locale"       content="en_US" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@linkitin" />
        <meta name="twitter:title"       content="linkitin — Your Free Link in Bio" />
        <meta name="twitter:description" content="One URL for your socials, links, Spotify and AI bio. Free, no account needed." />
        <meta name="twitter:image"       content={OG_IMAGE} />

        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
          * { -webkit-tap-highlight-color: transparent; }
          a, button { outline: none; text-decoration: none; color: inherit; cursor: pointer; }

          body {
            font-family: 'Sora', sans-serif;
            background: #0d0d0d;
            color: #fff;
            min-height: 100vh;
            overflow-x: hidden;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(22px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          @keyframes wordIn  { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0);    } }
          @keyframes wordOut { from { opacity:1; transform:translateY(0);     } to { opacity:0; transform:translateY(-8px); } }
          @keyframes blink   { 0%,100% { opacity:.35; } 50% { opacity:1; } }

          .vis .a1 { animation: fadeUp .7s .05s cubic-bezier(.16,1,.3,1) both; }
          .vis .a2 { animation: fadeUp .7s .14s cubic-bezier(.16,1,.3,1) both; }
          .vis .a3 { animation: fadeUp .7s .23s cubic-bezier(.16,1,.3,1) both; }
          .vis .a4 { animation: fadeUp .7s .32s cubic-bezier(.16,1,.3,1) both; }

          /* ── NAV — logo only, centered ── */
          nav {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            display: flex; align-items: center; justify-content: center;
            padding: 20px 24px;
            transition: background .3s, backdrop-filter .3s;
          }
          nav.scrolled {
            background: rgba(13,13,13,.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid #1c1c1c;
          }
          .nav-logo {
            font-size: 20px; font-weight: 800;
            letter-spacing: -.03em; color: #fff;
          }

          /* ── HERO ── */
          .hero {
            min-height: 100vh;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 100px 20px 80px;
            text-align: center;
            position: relative;
          }
          .hero::before {
            content: "";
            position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
            width: 600px; height: 600px;
            background: radial-gradient(circle, rgba(255,255,255,.025) 0%, transparent 65%);
            pointer-events: none;
          }
          .hero::after {
            content: "";
            position: absolute; bottom: 0; left: 8%; right: 8%;
            height: 1px;
            background: linear-gradient(90deg, transparent, #222, transparent);
          }

          .eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 6px 16px;
            border: 1px solid #222;
            border-radius: 100px;
            font-size: 11px; font-weight: 600;
            color: rgba(255,255,255,.3);
            letter-spacing: .05em; text-transform: uppercase;
            margin-bottom: 40px;
          }
          .dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #fff; opacity: .5;
            animation: blink 2.4s ease-in-out infinite;
          }

          .headline {
            font-size: clamp(38px, 10vw, 88px);
            font-weight: 800;
            line-height: 1.0;
            letter-spacing: -.045em;
            color: #fff;
            margin-bottom: 18px;
          }

          .word-row {
            font-size: clamp(30px, 8vw, 72px);
            font-weight: 800;
            line-height: 1.0;
            letter-spacing: -.04em;
            margin-bottom: 36px;
          }
          .word-wrap { display: inline-block; min-width: 200px; }
          .changing-word {
            display: inline-block;
            background: linear-gradient(90deg, rgba(255,255,255,.38) 0%, #fff 45%, rgba(255,255,255,.38) 100%);
            background-size: 200% auto;
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3.5s linear infinite;
          }
          .changing-word.fade-in  { animation: wordIn  .22s ease forwards, shimmer 3.5s linear infinite; }
          .changing-word.fade-out { animation: wordOut .22s ease forwards; }

          .hero-sub {
            font-size: clamp(13px, 3.5vw, 17px);
            color: rgba(255,255,255,.42);
            font-weight: 300;
            max-width: 420px;
            margin: 0 auto 20px;
            line-height: 1.8;
          }

          .pills {
            display: flex; flex-wrap: wrap;
            align-items: center; justify-content: center;
            gap: 7px; margin-bottom: 44px;
          }
          .pill {
            padding: 5px 12px;
            border: 1px solid #222;
            border-radius: 100px;
            font-size: 11px; font-weight: 600;
            color: rgba(255,255,255,.22);
            display: flex; align-items: center; gap: 5px;
          }
          .pill i { font-size: 9px; color: rgba(255,255,255,.38); }

          .cta-row {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap; gap: 10px;
          }
          .btn-main {
            display: inline-flex; align-items: center; gap: 9px;
            padding: 14px 28px;
            background: #fff; color: #0d0d0d;
            font-family: 'Sora', sans-serif;
            font-size: 14px; font-weight: 700;
            border-radius: 100px;
            transition: opacity .15s, transform .15s;
          }
          .btn-main:hover { opacity: .9; transform: scale(1.025); }
          .btn-ghost {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 13px 22px;
            background: transparent;
            color: rgba(255,255,255,.38);
            font-family: 'Sora', sans-serif;
            font-size: 13px; font-weight: 600;
            border-radius: 100px;
            border: 1px solid #242424;
            transition: border-color .15s, color .15s;
          }
          .btn-ghost:hover { border-color: rgba(255,255,255,.22); color: #fff; }

          /* ── SECTIONS ── */
          .section {
            max-width: 960px; margin: 0 auto;
            padding: 96px 20px;
            position: relative; z-index: 1;
          }
          .divider {
            max-width: 960px; margin: 0 auto;
            height: 1px; background: #191919;
          }
          .sec-eye {
            text-align: center;
            font-size: 10.5px; font-weight: 700;
            letter-spacing: .13em; text-transform: uppercase;
            color: rgba(255,255,255,.25);
            margin-bottom: 12px;
          }
          .sec-h {
            text-align: center;
            font-size: clamp(24px, 6vw, 38px);
            font-weight: 800;
            letter-spacing: -.04em; line-height: 1.1;
            color: #fff; margin-bottom: 10px;
          }
          .sec-sub {
            text-align: center;
            font-size: 14px; color: rgba(255,255,255,.36);
            font-weight: 300; line-height: 1.75;
            max-width: 420px; margin: 0 auto 48px;
          }

          /* ── FEATURE GRID ── */
          .feat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 1px;
            background: #191919;
            border: 1px solid #191919;
            border-radius: 20px; overflow: hidden;
          }
          .feat-card {
            background: #111;
            padding: 28px 24px;
            transition: background .18s;
          }
          .feat-card:hover { background: #141414; }
          .feat-icon {
            width: 42px; height: 42px; border-radius: 11px;
            background: #0d0d0d; border: 1px solid #222;
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; color: rgba(255,255,255,.5);
            margin-bottom: 16px;
          }
          .feat-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 7px; letter-spacing: -.02em; }
          .feat-desc  { font-size: 12.5px; color: rgba(255,255,255,.35); line-height: 1.75; font-weight: 300; }

          /* ── STEPS ── */
          .steps-wrap {
            max-width: 520px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 10px;
          }
          .step {
            display: flex; align-items: flex-start; gap: 18px;
            padding: 22px 24px;
            background: #111; border: 1px solid #1c1c1c;
            border-radius: 16px;
            transition: border-color .18s, transform .18s;
          }
          .step:hover { border-color: #282828; transform: translateX(3px); }
          .step-n {
            font-size: 10px; font-weight: 700;
            color: rgba(255,255,255,.16);
            letter-spacing: .06em; flex-shrink: 0; margin-top: 3px;
          }
          .step-t { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; letter-spacing: -.02em; }
          .step-d { font-size: 12.5px; color: rgba(255,255,255,.35); line-height: 1.7; font-weight: 300; }

          /* ── FAQ ── */
          .faq-list {
            max-width: 580px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 8px;
          }
          .faq-item {
            background: #111; border: 1px solid #1c1c1c;
            border-radius: 14px; overflow: hidden;
          }
          .faq-q {
            padding: 18px 22px;
            font-size: 13.5px; font-weight: 700; color: #fff;
            letter-spacing: -.01em;
            display: flex; align-items: center; justify-content: space-between; gap: 12px;
          }
          .faq-q i { font-size: 10px; color: rgba(255,255,255,.22); flex-shrink: 0; }
          .faq-a {
            padding: 0 22px 16px;
            font-size: 12.5px; color: rgba(255,255,255,.36);
            line-height: 1.75; font-weight: 300;
          }

          /* ── BOTTOM CTA ── */
          .cta-box {
            max-width: 560px; margin: 0 auto;
            padding: 56px 36px;
            background: #111; border: 1px solid #1e1e1e;
            border-radius: 24px; text-align: center;
            position: relative; overflow: hidden;
          }
          .cta-box::before {
            content: "";
            position: absolute; top: -50px; left: 50%; transform: translateX(-50%);
            width: 280px; height: 150px;
            background: radial-gradient(circle, rgba(255,255,255,.025) 0%, transparent 70%);
          }
          .cta-t {
            font-size: clamp(24px, 6vw, 34px);
            font-weight: 800; letter-spacing: -.04em;
            line-height: 1.1; margin-bottom: 12px; color: #fff;
          }
          .cta-d {
            font-size: 13.5px; color: rgba(255,255,255,.35);
            font-weight: 300; line-height: 1.78;
            max-width: 360px; margin: 0 auto 28px;
          }
          .cta-url {
            display: inline-block;
            padding: 6px 16px; margin-bottom: 24px;
            background: rgba(255,255,255,.05); border: 1px solid #252525;
            border-radius: 100px;
            font-size: 12.5px; color: rgba(255,255,255,.42); font-weight: 600;
          }

          /* ── FOOTER ── */
          footer {
            text-align: center;
            padding: 28px 20px 40px;
            border-top: 1px solid #161616;
          }
          .ft-logo { font-size: 15px; font-weight: 800; color: rgba(255,255,255,.28); letter-spacing: -.02em; margin-bottom: 6px; }
          .ft-dev  { font-size: 12px; color: rgba(255,255,255,.18); }
          .ft-dev strong { color: rgba(255,255,255,.28); font-weight: 700; }
          .ft-links {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap; gap: 16px; margin-top: 10px;
          }
          .ft-links a { font-size: 11.5px; color: rgba(255,255,255,.18); font-weight: 500; transition: color .15s; }
          .ft-links a:hover { color: rgba(255,255,255,.4); }
          .ft-sep { color: #1e1e1e; }

          /* ── MOBILE ── */
          @media (max-width: 480px) {
            .hero { padding: 88px 16px 72px; }
            .section { padding: 72px 16px; }
            .cta-box { padding: 40px 20px; }
            .feat-grid { border-radius: 14px; }
            .word-wrap { min-width: 160px; }
            .feat-card { padding: 22px 18px; }
            .step { padding: 18px 18px; }
            .faq-q { padding: 16px 18px; }
            .faq-a { padding: 0 18px 14px; }
            .pills { gap: 6px; }
            .pill { font-size: 10.5px; padding: 4px 10px; }
            .btn-main { padding: 13px 24px; font-size: 13.5px; }
            .btn-ghost { padding: 12px 18px; font-size: 12.5px; }
          }
        `}</style>
      </Head>

      {/* NAV — logo only, centered */}
      <nav className={scrolled ? "scrolled" : ""} aria-label="Main navigation">
        <div className="nav-logo">linkitin</div>
      </nav>

      <main>
        
          <div className="eyebrow a1">
            <span className="dot" aria-hidden="true" />
            Free · No account needed
          </div>

          <h1 className="headline a2">
            One link for<br />everything you are
          </h1>

          <div className="word-row a2" aria-live="polite" aria-atomic="true">
            <span className="word-wrap">
              <span className={`changing-word ${fade ? "fade-in" : "fade-out"}`}>
                {WORDS[wordIdx]}
              </span>
            </span>
          </div>

          <p className="hero-sub a3">
            Build your personal profile page and put all your links in one place.
            Share it on Instagram, WhatsApp, anywhere.
          </p>

          <div className="pills a3">
            {["Free forever", "No account", "No email", "Mobile friendly", "AI bio"].map((t, i) => (
              <span key={i} className="pill">
                <i className="fas fa-check" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>

          <div className="cta-row a4">
            <a href="/create" className="btn-main">
              <i className="fas fa-rocket" style={{ fontSize: 12 }} aria-hidden="true" />
              Create Your Profile — Free
            </a>
            <a href="#features" className="btn-ghost">
              See features
              <i className="fas fa-arrow-down" style={{ fontSize: 11 }} aria-hidden="true" />
            </a>
          </div>

        </div>

        {/* FEATURES */}
        <section id="features" className="section" aria-labelledby="feat-h">
          <div className="sec-eye">What you get</div>
          <h2 className="sec-h" id="feat-h">Everything in one profile</h2>
          <p className="sec-sub">All the tools to show the world who you are — wrapped in a single, shareable link.</p>
          <div className="feat-grid" role="list">
            {features.map((f, i) => (
              <article key={i} className="feat-card" role="listitem">
                <div className="feat-icon" aria-hidden="true"><i className={f.icon} /></div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* STEPS */}
        <section className="section" aria-labelledby="steps-h">
          <div className="sec-eye">How it works</div>
          <h2 className="sec-h" id="steps-h">Up and running in 3 steps</h2>
          <p className="sec-sub">No form to fill. No email to confirm. Just build and share.</p>
          <div className="steps-wrap" role="list">
            {steps.map((s, i) => (
              <div key={i} className="step" role="listitem">
                <div className="step-n">{s.n}</div>
                <div>
                  <h3 className="step-t">{s.t}</h3>
                  <p className="step-d">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* FAQ */}
        <section className="section" aria-labelledby="faq-h">
          <div className="sec-eye">FAQ</div>
          <h2 className="sec-h" id="faq-h">Common questions</h2>
          <p className="sec-sub">Straight answers, no fluff.</p>
          <div className="faq-list" role="list">
            {faqs.map((f, i) => (
              <div key={i} className="faq-item" role="listitem"
                itemScope itemType="https://schema.org/Question">
                <div className="faq-q" itemProp="name">
                  {f.q}
                  <i className="fas fa-plus" aria-hidden="true" />
                </div>
                <div className="faq-a"
                  itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <span itemProp="text">{f.a}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* BOTTOM CTA */}
        <section className="section" aria-labelledby="cta-h">
          <div className="cta-box">
            <h2 className="cta-t" id="cta-h">
              Your profile,<br />your way
            </h2>
            <p className="cta-d">
              No account. No email. Open on any device, build your page, and share your link — done.
            </p>
            <div className="cta-url">linkitin.site/<strong>you</strong></div>
            <br />
            <a href="/create" className="btn-main" style={{ display: "inline-flex" }}>
              <i className="fas fa-rocket" style={{ fontSize: 12 }} aria-hidden="true" />
              Create for Free
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer role="contentinfo">
        <div className="ft-logo">linkitin</div>
        <div className="ft-dev">Developed by <strong>Samartha GS</strong></div>
        <div className="ft-links">
          <a href="/">© {new Date().getFullYear()} linkitin</a>
          <span className="ft-sep">·</span>
          <a href="https://linkitin.site/samarthags">Demo profile</a>
          <span className="ft-sep">·</span>
          <a href="/create">Create Profile</a>
        </div>
      </footer>
    </>
  );
}
