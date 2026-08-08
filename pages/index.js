// pages/index.js — linkitin Landing Page (Production)
import Head from "next/head";
import { useEffect, useState } from "react";

const SITE_URL = "https://linkitin.site";
const OG_IMAGE  = `${SITE_URL}/og-image.png`;

const WORDS = ["Your links.", "Your story.", "Your brand.", "Your identity.", "Your world."];

export default function Landing() {
  const [visible, setVisible] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [fade,    setFade]    = useState(true);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setFade(true); }, 240);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const features = [
    { icon: "fas fa-link",                title: "Link in Bio",        desc: "One clean URL with your photo, socials, links and your story — all in one place." },
    { icon: "fas fa-id-badge",            title: "Professional Badge", desc: "Coder, Designer, Trader, Editor, Singer, Artist — own your role with a clean identity badge." },
    { icon: "fab fa-spotify",             title: "Spotify Widget",     desc: "Pin your favourite song right on your profile." },
    { icon: "fas fa-wand-magic-sparkles", title: "AI Bio Writer",      desc: "Write one sentence about yourself. The AI turns it into a full bio, in your voice." },
    { icon: "fas fa-share-nodes",         title: "Share Anywhere",     desc: "WhatsApp, Instagram, Telegram — one link works everywhere." },
    { icon: "fas fa-chart-line",          title: "Simple Analytics",   desc: "See how many people visit your profile and which links they tap." },
  ];

  const steps = [
    { n: "01", t: "Create your profile", d: "No sign-up needed — just pick a username and you're in." },
    { n: "02", t: "Build your profile",   d: "Add your photo, badge, links, Spotify song and let AI write your bio." },
    { n: "03", t: "Share your link",      d: "Go live at linkitin.site/yourname and drop it in every bio." },
  ];

  const faqs = [
    { q: "Is linkitin free?",              a: "Yes, completely free. No hidden plans, no credit card, no catch." },
    { q: "Do I need to sign up?",          a: "No — just pick a username. Your profile is saved to this device and browser so you can edit it anytime." },
    { q: "Does it work on mobile?",        a: "Yes — built for mobile first. Build and share from your phone." },
    { q: "What is a link in bio?",         a: "It's one URL you put in your Instagram or X bio that shows all your important links in one page." },
    { q: "Can I change my username later?", a: "Yes. You can update your username and profile details anytime from your dashboard." },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "linkitin",
      "url": SITE_URL,
      "description": "Create your personal link-in-bio profile page. Add your photo, professional badge, socials, Spotify song and an AI-written bio — all at one URL.",
      "applicationCategory": "SocialNetworkingApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
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
        <meta name="description" content="Create your free link in bio profile page. Add your photo, badge, social links, Spotify song and AI-written bio — all at one URL. Sign in with Google to get started." />
        <meta name="keywords" content="link in bio, free link in bio, linktree alternative, bio link page, personal profile page, linkitin, instagram bio link, link in bio tool, AI bio generator, spotify profile link" />
        <meta name="robots"        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot"     content="index, follow" />
        <meta name="viewport"      content="width=device-width, initial-scale=1" />
        <meta name="theme-color"   content="#fafaf7" />
        <meta name="language"      content="English" />
        <meta name="revisit-after" content="3 days" />
        <link rel="canonical" href={SITE_URL} />

        <link rel="icon"             type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="icon"             type="image/png" sizes="16x16" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180"                href="/icon.png" />
        <link rel="shortcut icon"                                    href="/icon.png" />
        <meta name="msapplication-TileImage" content="/icon.png" />
        <meta name="msapplication-TileColor" content="#fafaf7" />

        <meta property="og:type"         content="website" />
        <meta property="og:site_name"    content="linkitin" />
        <meta property="og:title"        content="linkitin — Free Link in Bio | Create Your Profile Page" />
        <meta property="og:description"  content="Create your free link in bio profile. Add socials, Spotify, badge and AI bio — all at one URL." />
        <meta property="og:url"          content={SITE_URL} />
        <meta property="og:image"        content={OG_IMAGE} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="linkitin — Create your free link in bio page" />
        <meta property="og:locale"       content="en_US" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@linkitin" />
        <meta name="twitter:title"       content="linkitin — Your Free Link in Bio" />
        <meta name="twitter:description" content="One URL for your socials, links, Spotify and AI bio. Sign in with Google to get started." />
        <meta name="twitter:image"       content={OG_IMAGE} />

        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
          * { -webkit-tap-highlight-color: transparent; }
          a, button { outline: none; text-decoration: none; color: inherit; cursor: pointer; }

          body {
            font-family: 'Sora', sans-serif;
            background: #fafaf7;
            color: #0a0a0a;
            overflow-x: hidden;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          @keyframes wordIn  { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0); } }
          @keyframes wordOut { from { opacity:1; transform:translateY(0); }   to { opacity:0; transform:translateY(-8px); } }
          @keyframes blink   { 0%,100% { opacity:.3; } 50% { opacity:.9; } }

          .vis .a1 { animation: fadeUp .65s .05s cubic-bezier(.16,1,.3,1) both; }
          .vis .a2 { animation: fadeUp .65s .13s cubic-bezier(.16,1,.3,1) both; }
          .vis .a3 { animation: fadeUp .65s .21s cubic-bezier(.16,1,.3,1) both; }
          .vis .a4 { animation: fadeUp .65s .29s cubic-bezier(.16,1,.3,1) both; }

          /* ── NAV ── */
          nav {
            display: flex; align-items: center; justify-content: space-between;
            padding: 18px 24px;
            border-bottom: 2px solid #0a0a0a;
            position: sticky; top: 0; z-index: 100;
            background: rgba(250,250,247,.94);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          .nav-logo {
            font-size: 16px; font-weight: 900;
            color: #0a0a0a; letter-spacing: -.02em;
          }
          .nav-cta {
            display: flex; align-items: center; gap: 7px;
            padding: 9px 18px;
            background: #0a0a0a; color: #d7ff3f;
            font-family: 'Sora', sans-serif;
            font-size: 12px; font-weight: 800;
            border-radius: 100px;
            border: none;
            transition: transform .15s;
            text-transform: uppercase; letter-spacing: .03em;
          }
          .nav-cta:hover { transform: scale(1.02); }
          .nav-cta img { width: 14px; height: 14px; }

          /* ── HERO ── */
          .hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 72px 20px 64px;
            position: relative;
            overflow: hidden;
          }
          .hero::before {
            content: "";
            position: absolute; top: -10%; right: -20%; width: 65%; height: 55%;
            background: radial-gradient(circle, rgba(215,255,63,.55) 0%, rgba(215,255,63,0) 70%);
            pointer-events: none; z-index: 0;
          }
          .hero > * { position: relative; z-index: 1; }

          .eyebrow {
            display: inline-flex; align-items: center; gap: 7px;
            padding: 6px 15px;
            background: #0a0a0a;
            border-radius: 100px;
            font-size: 11px; font-weight: 800;
            color: #d7ff3f;
            letter-spacing: .05em; text-transform: uppercase;
            margin-bottom: 28px;
          }
          .dot {
            width: 5px; height: 5px; border-radius: 50%;
            background: #d7ff3f;
            animation: blink 2.4s ease-in-out infinite;
          }

          .headline {
            font-size: clamp(32px, 8.5vw, 74px);
            font-family: 'Archivo Black', 'Sora', sans-serif;
            font-weight: 400;
            line-height: 1.02;
            letter-spacing: -.01em;
            color: #0a0a0a;
            text-transform: uppercase;
            margin-bottom: 10px;
          }

          .word-row {
            font-size: clamp(26px, 7vw, 62px);
            font-family: 'Archivo Black', 'Sora', sans-serif;
            font-weight: 400;
            line-height: 1.02;
            letter-spacing: -.01em;
            text-transform: uppercase;
            margin-bottom: 20px;
          }
          .word-wrap { display: inline-block; min-width: 170px; }
          .changing-word {
            display: inline-block;
            color: #0a0a0a;
          }
          .changing-word.fade-in  { animation: wordIn  .22s ease forwards; }
          .changing-word.fade-out { animation: wordOut .22s ease forwards; }

          .hero-sub {
            font-size: clamp(13px, 3.5vw, 16px);
            color: #6b6b60;
            font-weight: 400;
            max-width: 400px;
            margin: 0 auto 20px;
            line-height: 1.75;
          }

          .pills {
            display: flex; flex-wrap: wrap;
            align-items: center; justify-content: center;
            gap: 6px; margin-bottom: 32px;
          }
          .pill {
            padding: 5px 12px;
            border: 1.5px solid #0a0a0a;
            border-radius: 100px;
            font-size: 10.5px; font-weight: 700;
            color: #0a0a0a;
            display: flex; align-items: center; gap: 5px;
          }
          .pill i { font-size: 8px; color: #0a0a0a; }

          /* ── CTA BUTTON ── */
          .cta-col {
            display: flex; flex-direction: column;
            align-items: stretch;
            gap: 10px;
            width: 100%;
            max-width: 360px;
          }

          .btn-google {
            display: flex; align-items: center; justify-content: center; gap: 10px;
            padding: 16px 20px;
            background: #0a0a0a; color: #d7ff3f;
            font-family: 'Sora', sans-serif;
            font-size: 14px; font-weight: 800;
            border-radius: 14px;
            border: none;
            transition: transform .15s;
            text-transform: uppercase; letter-spacing: .02em;
          }
          .btn-google:hover {
            transform: scale(1.015);
          }
          .btn-google svg {
            width: 18px; height: 18px; flex-shrink: 0;
          }
          .btn-terms {
            font-size: 10.5px;
            color: #a5a598;
            font-weight: 400;
            text-align: center;
            line-height: 1.6;
          }
          .btn-terms a {
            color: #6b6b60;
            text-decoration: underline;
            text-underline-offset: 2px;
          }

          /* ── SOCIAL PROOF ── */
          .social-proof {
            display: flex; align-items: center; gap: 8px;
            justify-content: center;
            margin-top: 20px;
          }
          .avatars {
            display: flex;
          }
          .avatar {
            width: 24px; height: 24px; border-radius: 50%;
            background: #d7ff3f; border: 1.5px solid #fafaf7;
            margin-left: -6px; overflow: hidden;
            display: flex; align-items: center; justify-content: center;
            font-size: 9px; color: #0a0a0a; font-weight: 800;
          }
          .avatar:first-child { margin-left: 0; }
          .proof-text {
            font-size: 11px; color: #a5a598;
            font-weight: 600;
          }

          /* ── DIVIDER ── */
          .divider {
            height: 1.5px;
            background: #e5e5da;
            margin: 0 20px;
          }

          /* ── SECTIONS ── */
          .wrap {
            max-width: 960px; margin: 0 auto;
            padding: 52px 20px;
          }

          .sec-eye {
            text-align: center;
            font-size: 10px; font-weight: 800;
            letter-spacing: .13em; text-transform: uppercase;
            color: #a5a598;
            margin-bottom: 10px;
          }
          .sec-h {
            text-align: center;
            font-size: clamp(22px, 6vw, 32px);
            font-family: 'Archivo Black', 'Sora', sans-serif;
            font-weight: 400; letter-spacing: -.01em; line-height: 1.1;
            color: #0a0a0a; margin-bottom: 8px;
            text-transform: uppercase;
          }
          .sec-sub {
            text-align: center;
            font-size: clamp(12px, 3vw, 13.5px);
            color: #6b6b60;
            font-weight: 400; line-height: 1.7;
            max-width: 380px; margin: 0 auto 36px;
          }

          /* ── FEATURE GRID ── */
          .feat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1.5px;
            background: #0a0a0a;
            border: 2px solid #0a0a0a;
            border-radius: 16px; overflow: hidden;
          }
          .feat-card {
            background: #fff;
            padding: 22px 20px;
            transition: background .18s;
          }
          .feat-card:hover { background: #f8fbe8; }
          .feat-icon {
            width: 38px; height: 38px; border-radius: 10px;
            background: #0a0a0a;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; color: #d7ff3f;
            margin-bottom: 12px;
          }
          .feat-title { font-size: 13px; font-weight: 800; color: #0a0a0a; margin-bottom: 6px; letter-spacing: -.02em; }
          .feat-desc  { font-size: 11.5px; color: #6b6b60; line-height: 1.7; font-weight: 400; }

          /* ── STEPS ── */
          .steps-wrap {
            max-width: 500px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 8px;
          }
          .step {
            display: flex; align-items: flex-start; gap: 14px;
            padding: 18px 20px;
            background: #fff; border: 1.5px solid #e5e5da;
            border-radius: 13px;
            transition: border-color .18s;
          }
          .step:hover { border-color: #0a0a0a; }
          .step-n {
            font-size: 10px; font-weight: 800;
            color: #b0b0a0;
            letter-spacing: .06em; flex-shrink: 0; margin-top: 2px;
          }
          .step-t { font-size: 13px; font-weight: 800; color: #0a0a0a; margin-bottom: 3px; letter-spacing: -.02em; }
          .step-d { font-size: 11.5px; color: #6b6b60; line-height: 1.65; font-weight: 400; }

          /* ── FAQ ── */
          .faq-list {
            max-width: 560px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 7px;
          }
          .faq-item {
            background: #fff; border: 1.5px solid #e5e5da;
            border-radius: 12px; overflow: hidden;
          }
          .faq-q {
            padding: 16px 18px;
            font-size: 13px; font-weight: 800; color: #0a0a0a;
            letter-spacing: -.01em;
            display: flex; align-items: center; justify-content: space-between; gap: 10px;
          }
          .faq-q i { font-size: 10px; color: #a5a598; flex-shrink: 0; }
          .faq-a {
            padding: 0 18px 14px;
            font-size: 11.5px; color: #6b6b60;
            line-height: 1.7; font-weight: 400;
          }

          /* ── BOTTOM CTA ── */
          .cta-box {
            max-width: 520px; margin: 0 auto;
            padding: 44px 28px;
            background: #0a0a0a; border: 2px solid #0a0a0a;
            border-radius: 24px; text-align: center;
            position: relative; overflow: hidden;
          }
          .cta-box::before {
            content: "";
            position: absolute; top: -30%; right: -20%; width: 60%; height: 80%;
            background: radial-gradient(circle, rgba(215,255,63,.35) 0%, rgba(215,255,63,0) 70%);
            pointer-events: none;
          }
          .cta-box > * { position: relative; z-index: 1; }
          .cta-t {
            font-size: clamp(22px, 6vw, 30px);
            font-family: 'Archivo Black', 'Sora', sans-serif;
            font-weight: 400; letter-spacing: -.01em;
            line-height: 1.1; margin-bottom: 10px; color: #fff;
            text-transform: uppercase;
          }
          .cta-d {
            font-size: clamp(12px, 3vw, 13px);
            color: rgba(255,255,255,.55);
            font-weight: 400; line-height: 1.75;
            max-width: 320px; margin: 0 auto 22px;
          }
          .cta-url {
            display: inline-block;
            padding: 6px 15px; margin-bottom: 22px;
            background: rgba(215,255,63,.14); border: 1.5px solid #d7ff3f;
            border-radius: 100px;
            font-size: 12px; color: #d7ff3f; font-weight: 700;
          }
          .cta-box .btn-google { background: #d7ff3f; color: #0a0a0a; }

          /* ── FOOTER ── */
          footer {
            text-align: center;
            padding: 24px 20px 36px;
            border-top: 2px solid #0a0a0a;
          }
          .ft-logo { font-size: 13px; font-weight: 900; color: #0a0a0a; letter-spacing: -.02em; margin-bottom: 5px; }
          .ft-links {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap; gap: 14px; margin-top: 9px;
          }
          .ft-links a { font-size: 11px; color: #a5a598; font-weight: 600; transition: color .15s; }
          .ft-links a:hover { color: #0a0a0a; }
          .ft-sep { color: #d8d8cc; }

          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
          }
        `}</style>
      </Head>

      {/* NAV */}
      <nav>
        <div className="nav-logo">linkitin</div>
        <a href="/create" className="nav-cta" aria-label="Create your profile">
          Get Started
        </a>
      </nav>

      <main>
        {/* HERO */}
        <div className={`hero ${visible ? "vis" : ""}`}>

          <div className="eyebrow a1">
            <span className="dot" />
            Free · Simple profile builder
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
            {["Free forever", "Mobile friendly", "AI bio", "Spotify", "Dynamic Duo"].map((t, i) => (
              <span key={i} className="pill">
                <i className="fas fa-check" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>

          <div className="cta-col a4">
            <a href="/create" className="btn-google" aria-label="Create your profile">
              Create Your Profile — It's Free
            </a>
            <p className="btn-terms">
              By continuing you agree to our{" "}
              <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
            </p>
          </div>

          <div className="social-proof a4">
            <div className="avatars" aria-hidden="true">
              {["U","A","S","B"].map((l, i) => (
                <div className="avatar" key={i}>{l}</div>
              ))}
            </div>
            <p className="proof-text">Thousands of profiles already live</p>
          </div>

        </div>

        <div className="divider" />

        {/* FEATURES */}
        <section id="features" className="wrap" aria-labelledby="feat-h">
          <div className="sec-eye">What you get</div>
          <h2 className="sec-h" id="feat-h">Everything in one profile</h2>
          <p className="sec-sub">All the tools to show the world who you are — wrapped in a single, shareable link.</p>
          <div className="feat-grid" role="list">
            {features.map((f, i) => (
              <article key={i} className="feat-card" role="listitem">
                <div className="feat-icon"><i className={f.icon} aria-hidden="true" /></div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* STEPS */}
        <section className="wrap" aria-labelledby="steps-h">
          <div className="sec-eye">How it works</div>
          <h2 className="sec-h" id="steps-h">Up and running in 3 steps</h2>
          <p className="sec-sub">Create your profile. Build your page. Share everywhere.</p>
          <div className="steps-wrap" role="list">
            {steps.map((s, i) => (
              <div key={i} className="step" role="listitem">
                <div className="step-n" aria-hidden="true">{s.n}</div>
                <div>
                  <h3 className="step-t">{s.t}</h3>
                  <p className="step-d">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* FAQ */}
        <section className="wrap" aria-labelledby="faq-h">
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

        <div className="divider" />

        {/* BOTTOM CTA */}
        <section className="wrap" aria-labelledby="cta-h">
          <div className="cta-box">
            <h2 className="cta-t" id="cta-h">Your profile,<br />your way</h2>
            <p className="cta-d">
              Create your profile and it's saved automatically on this device — edit it anytime.
            </p>
            <div className="cta-url">linkitin.site/<strong>you</strong></div>
            <br />
            <a href="/create" className="btn-google" style={{ display: "inline-flex", width: "auto" }}
              aria-label="Create your profile">
              Get Started — Free
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="ft-logo">linkitin</div>
        <div className="ft-links">
          <a href="/">© {new Date().getFullYear()} linkitin</a>
          <span className="ft-sep">·</span>
          <a href="/terms">Terms</a>
          <span className="ft-sep">·</span>
          <a href="/privacy">Privacy</a>
          <span className="ft-sep">·</span>
          <a href="/create">Create Profile</a>
        </div>
      </footer>
    </>
  );
}
