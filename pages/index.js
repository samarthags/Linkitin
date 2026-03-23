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
    { icon: "fas fa-id-badge",            title: "Professional Badge", desc: "Coder, Designer, Trader, Editor ,Singer, Artist — own your role with a clean identity badge." },
    { icon: "fab fa-spotify",             title: "Spotify Widget",     desc: "Pin  you're favorite song right on your profile." },
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
    { q: "What is a link in bio?",        a: "It's one URL you put in your Instagram or X or any social media bio that shows all your important links in one page." },
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
          html, body { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
          * { -webkit-tap-highlight-color: transparent; }
          a, button { outline: none; text-decoration: none; color: inherit; cursor: pointer; }

          body {
            font-family: 'Sora', sans-serif;
            background: #0d0d0d;
            color: #fff;
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

          /* ── HERO — no min-height, pure content height ── */
          .hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 64px 20px 56px;
          }

          .eyebrow {
            display: inline-flex; align-items: center; gap: 7px;
            padding: 5px 14px;
            border: 1px solid #222;
            border-radius: 100px;
            font-size: 11px; font-weight: 600;
            color: rgba(255,255,255,.28);
            letter-spacing: .05em; text-transform: uppercase;
            margin-bottom: 28px;
          }
          .dot {
            width: 5px; height: 5px; border-radius: 50%;
            background: #fff;
            animation: blink 2.4s ease-in-out infinite;
          }

          .headline {
            font-size: clamp(34px, 9vw, 80px);
            font-weight: 800;
            line-height: 1.02;
            letter-spacing: -.04em;
            color: #fff;
            margin-bottom: 10px;
          }

          .word-row {
            font-size: clamp(28px, 7.5vw, 68px);
            font-weight: 800;
            line-height: 1.02;
            letter-spacing: -.04em;
            margin-bottom: 20px;
          }
          .word-wrap { display: inline-block; min-width: 170px; }
          .changing-word {
            display: inline-block;
            background: linear-gradient(90deg, rgba(255,255,255,.35) 0%, #fff 45%, rgba(255,255,255,.35) 100%);
            background-size: 200% auto;
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3.5s linear infinite;
          }
          .changing-word.fade-in  { animation: wordIn  .22s ease forwards, shimmer 3.5s linear infinite; }
          .changing-word.fade-out { animation: wordOut .22s ease forwards; }

          .hero-sub {
            font-size: clamp(13px, 3.5vw, 16px);
            color: rgba(255,255,255,.4);
            font-weight: 300;
            max-width: 400px;
            margin: 0 auto 16px;
            line-height: 1.75;
          }

          .pills {
            display: flex; flex-wrap: wrap;
            align-items: center; justify-content: center;
            gap: 6px; margin-bottom: 28px;
          }
          .pill {
            padding: 4px 11px;
            border: 1px solid #222;
            border-radius: 100px;
            font-size: 10.5px; font-weight: 600;
            color: rgba(255,255,255,.2);
            display: flex; align-items: center; gap: 5px;
          }
          .pill i { font-size: 8px; color: rgba(255,255,255,.35); }

          .cta-col {
            display: flex; flex-direction: column;
            align-items: stretch;
            gap: 10px;
            width: 100%;
            max-width: 360px;
          }
          .btn-main {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            padding: 15px 20px;
            background: #fff; color: #0d0d0d;
            font-family: 'Sora', sans-serif;
            font-size: 14px; font-weight: 700;
            border-radius: 100px;
            transition: opacity .15s, transform .15s;
          }
          .btn-main:hover { opacity: .9; transform: scale(1.02); }
          .btn-ghost {
            display: flex; align-items: center; justify-content: center; gap: 7px;
            padding: 14px 20px;
            background: transparent;
            color: rgba(255,255,255,.36);
            font-family: 'Sora', sans-serif;
            font-size: 13px; font-weight: 600;
            border-radius: 100px;
            border: 1px solid #232323;
            transition: border-color .15s, color .15s;
          }
          .btn-ghost:hover { border-color: rgba(255,255,255,.22); color: #fff; }

          /* ── DIVIDER ── */
          .divider {
            height: 1px;
            background: #191919;
            margin: 0 20px;
          }

          /* ── SECTIONS ── */
          .wrap {
            max-width: 960px; margin: 0 auto;
            padding: 52px 20px;
          }

          .sec-eye {
            text-align: center;
            font-size: 10px; font-weight: 700;
            letter-spacing: .13em; text-transform: uppercase;
            color: rgba(255,255,255,.22);
            margin-bottom: 10px;
          }
          .sec-h {
            text-align: center;
            font-size: clamp(22px, 6vw, 34px);
            font-weight: 800; letter-spacing: -.04em; line-height: 1.1;
            color: #fff; margin-bottom: 8px;
          }
          .sec-sub {
            text-align: center;
            font-size: clamp(12px, 3vw, 13.5px);
            color: rgba(255,255,255,.33);
            font-weight: 300; line-height: 1.7;
            max-width: 380px; margin: 0 auto 36px;
          }

          /* ── FEATURE GRID ── */
          .feat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1px;
            background: #191919;
            border: 1px solid #191919;
            border-radius: 16px; overflow: hidden;
          }
          .feat-card {
            background: #111;
            padding: 22px 20px;
            transition: background .18s;
          }
          .feat-card:hover { background: #141414; }
          .feat-icon {
            width: 38px; height: 38px; border-radius: 10px;
            background: #0d0d0d; border: 1px solid #222;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; color: rgba(255,255,255,.45);
            margin-bottom: 12px;
          }
          .feat-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 6px; letter-spacing: -.02em; }
          .feat-desc  { font-size: 11.5px; color: rgba(255,255,255,.32); line-height: 1.7; font-weight: 300; }

          /* ── STEPS ── */
          .steps-wrap {
            max-width: 500px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 8px;
          }
          .step {
            display: flex; align-items: flex-start; gap: 14px;
            padding: 18px 20px;
            background: #111; border: 1px solid #1c1c1c;
            border-radius: 13px;
            transition: border-color .18s;
          }
          .step:hover { border-color: #282828; }
          .step-n {
            font-size: 10px; font-weight: 700;
            color: rgba(255,255,255,.15);
            letter-spacing: .06em; flex-shrink: 0; margin-top: 2px;
          }
          .step-t { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; letter-spacing: -.02em; }
          .step-d { font-size: 11.5px; color: rgba(255,255,255,.32); line-height: 1.65; font-weight: 300; }

          /* ── FAQ ── */
          .faq-list {
            max-width: 560px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 7px;
          }
          .faq-item {
            background: #111; border: 1px solid #1c1c1c;
            border-radius: 12px; overflow: hidden;
          }
          .faq-q {
            padding: 16px 18px;
            font-size: 13px; font-weight: 700; color: #fff;
            letter-spacing: -.01em;
            display: flex; align-items: center; justify-content: space-between; gap: 10px;
          }
          .faq-q i { font-size: 10px; color: rgba(255,255,255,.2); flex-shrink: 0; }
          .faq-a {
            padding: 0 18px 14px;
            font-size: 11.5px; color: rgba(255,255,255,.33);
            line-height: 1.7; font-weight: 300;
          }

          /* ── BOTTOM CTA ── */
          .cta-box {
            max-width: 520px; margin: 0 auto;
            padding: 44px 28px;
            background: #111; border: 1px solid #1e1e1e;
            border-radius: 20px; text-align: center;
          }
          .cta-t {
            font-size: clamp(22px, 6vw, 30px);
            font-weight: 800; letter-spacing: -.04em;
            line-height: 1.1; margin-bottom: 10px; color: #fff;
          }
          .cta-d {
            font-size: clamp(12px, 3vw, 13px);
            color: rgba(255,255,255,.32);
            font-weight: 300; line-height: 1.75;
            max-width: 320px; margin: 0 auto 22px;
          }
          .cta-url {
            display: inline-block;
            padding: 5px 13px; margin-bottom: 20px;
            background: rgba(255,255,255,.05); border: 1px solid #252525;
            border-radius: 100px;
            font-size: 12px; color: rgba(255,255,255,.38); font-weight: 600;
          }

          /* ── FOOTER ── */
          footer {
            text-align: center;
            padding: 24px 20px 36px;
            border-top: 1px solid #161616;
          }
          .ft-logo { font-size: 13px; font-weight: 800; color: rgba(255,255,255,.22); letter-spacing: -.02em; margin-bottom: 5px; }
          .ft-dev  { font-size: 11px; color: rgba(255,255,255,.15); }
          .ft-dev strong { color: rgba(255,255,255,.24); font-weight: 700; }
          .ft-links {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap; gap: 14px; margin-top: 9px;
          }
          .ft-links a { font-size: 11px; color: rgba(255,255,255,.15); font-weight: 500; transition: color .15s; }
          .ft-links a:hover { color: rgba(255,255,255,.38); }
          .ft-sep { color: #1e1e1e; }
        `}</style>
      </Head>

      <main>
        {/* HERO */}
        <div className={`hero ${visible ? "vis" : ""}`}>

          <div className="eyebrow a1">
            <span className="dot" />
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
                <i className="fas fa-check" />
                {t}
              </span>
            ))}
          </div>

          <div className="cta-col a4">
            <a href="/create" className="btn-main">
              <i className="fas fa-rocket" style={{ fontSize: 12 }} />
              Create Your Profile — Free
            </a>
            <a href="#features" className="btn-ghost">
              See features
              <i className="fas fa-arrow-down" style={{ fontSize: 10 }} />
            </a>
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
                <div className="feat-icon"><i className={f.icon} /></div>
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
                  <i className="fas fa-plus" />
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
              No account. No email. Open on any device, build your page, and share your link — done.
            </p>
            <div className="cta-url">linkitin.site/<strong>you</strong></div>
            <br />
            <a href="/create" className="btn-main" style={{ display: "inline-flex", width: "auto" }}>
              <i className="fas fa-rocket" style={{ fontSize: 12 }} />
              Create for Free
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="ft-logo">linkitin</div>
        <div className="ft-dev">
  Developed by{" "}
  <strong>
    <a 
      href="https://linkitin.site/samarthags" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      Samartha Gs
    </a>
  </strong>
</div>
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
