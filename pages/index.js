// pages/index.js — linkitin Landing Page (Advanced SEO + Premium Design)
import Head from "next/head";
import { useEffect, useState, useRef } from "react";

const SITE_URL = "https://linkitin.site";
const OG_IMAGE = `${SITE_URL}/og-image.png`; // Use a 1200x630 OG image for best results

const WORDS = ["Your links.", "Your story.", "Your brand.", "Your identity.", "Your world."];

const STATS = [
  { value: "10K+", label: "Profiles created" },
  { value: "Free", label: "Forever, always" },
  { value: "3 sec", label: "Setup time" },
  { value: "0", label: "Accounts needed" },
];

export default function Landing() {
  const [visible, setVisible] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setFade(true);
      }, 240);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { icon: "fas fa-link", title: "Link in Bio", desc: "One powerful URL with your photo, socials, links, and story — polished and ready to share." },
    { icon: "fas fa-id-badge", title: "Professional Badge", desc: "Coder, Designer, Trader, Doctor — declare your identity with a verified-style badge." },
    { icon: "fab fa-spotify", title: "Spotify Player", desc: "Embed what you're listening to right on your profile with a live Spotify widget." },
    { icon: "fas fa-wand-magic-sparkles", title: "AI Bio Generator", desc: "Describe yourself in one line. Our AI crafts your full bio instantly, in your voice." },
    { icon: "fas fa-share-nodes", title: "Share Everywhere", desc: "WhatsApp, Instagram, Telegram, LinkedIn — one link, every platform." },
    { icon: "fas fa-chart-line", title: "Profile Analytics", desc: "Know who's visiting. Track profile views, link clicks, and Spotify plays in real time." },
  ];

  const steps = [
    { n: "01", t: "Claim your username", d: "Your profile lives at linkitin.site/you — pick yours before someone else does." },
    { n: "02", t: "Build your profile", d: "Add your photo, badge, social links, Spotify song, and let AI write your bio." },
    { n: "03", t: "Go live in seconds", d: "Publish instantly and share your link everywhere. No signup. No waiting." },
  ];

  const faqs = [
    { q: "Is linkitin really free?", a: "Yes — 100% free, forever. No hidden plans, no credit card, no catch." },
    { q: "Do I need to create an account?", a: "No account or email required. Your profile is stored on your device and published instantly." },
    { q: "Can I use it on mobile?", a: "Absolutely. linkitin is fully optimized for mobile — build and share from your phone in seconds." },
    { q: "What is a link in bio?", a: "A link in bio is a single URL you share on Instagram, TikTok, Twitter, etc., that leads to one page with all your important links." },
  ];

  // ── Rich Structured Data (Google Rich Results) ──
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "linkitin",
      "url": SITE_URL,
      "description": "Create your personal link-in-bio profile page in seconds. Add your photo, professional badge, socials, external links, Spotify song and an AI-written bio — all at one URL. Free forever. No account needed.",
      "applicationCategory": "SocialNetworkingApplication",
      "operatingSystem": "Web",
      "browserRequirements": "Requires JavaScript",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Link in Bio profile page",
        "Professional identity badge",
        "Spotify embedded player",
        "AI-powered bio generator",
        "Social media link sharing",
        "Profile analytics dashboard"
      ],
      "screenshot": OG_IMAGE,
      "author": { "@type": "Person", "name": "Samartha GS" },
      "publisher": { "@type": "Organization", "name": "linkitin", "url": SITE_URL, "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.png` } },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "312" },
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
      "@type": "SoftwareApplication",
      "name": "linkitin — Free Link in Bio Builder",
      "operatingSystem": "Web",
      "applicationCategory": "UtilitiesApplication",
      "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Create Profile", "item": `${SITE_URL}/create` },
      ]
    }
  ];

  return (
    <>
      <Head>
        {/* ── Primary SEO ── */}
        <title>Linkitin — Free Link in Bio Builder | Create Your Profile Page Instantly</title>
        <meta name="description" content="Linkitin is the best free link in bio tool. Create your personal profile page in seconds — add photo, professional badge, social links, Spotify song & AI-written bio. No account needed. Free forever." />
        <meta name="keywords" content="link in bio, free link in bio, linktree alternative, bio link page, personal profile page, linkitin, create profile page, social media bio link, spotify profile link, AI bio generator, one link for everything, free linktree, instagram bio link, link in bio tool" />
        <meta name="author" content="Samartha GS" />
        <meta name="creator" content="Samartha GS" />
        <meta name="publisher" content="linkitin" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080808" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="3 days" />
        <meta name="language" content="English" />
        <link rel="canonical" href={SITE_URL} />

        {/* ── Favicons ── */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <meta name="msapplication-TileImage" content="/icon.png" />
        <meta name="msapplication-TileColor" content="#080808" />

        {/* ── Open Graph (WhatsApp / Facebook / LinkedIn) — use 1200×630 image ── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="linkitin" />
        <meta property="og:title" content="linkitin — Free Link in Bio Builder | Create Your Profile Page" />
        <meta property="og:description" content="Create your personal link-in-bio profile in seconds. Add your socials, Spotify, badge & AI bio — all at one URL. 100% free, no account needed." />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="linkitin — Create your free link in bio page" />
        <meta property="og:locale" content="en_US" />

        {/* ── Twitter / X Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@linkitin" />
        <meta name="twitter:creator" content="@linkitin" />
        <meta name="twitter:title" content="linkitin — Your Free Link in Bio" />
        <meta name="twitter:description" content="One URL for your socials, links, Spotify & AI bio. Free forever. No account needed." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="linkitin profile page preview" />

        {/* ── Structured Data (Multiple schemas) ── */}
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* ── Fonts & Icons ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
          * { -webkit-tap-highlight-color: transparent; }
          a, button { outline: none; text-decoration: none; color: inherit; cursor: pointer; }

          :root {
            --bg: #080808;
            --surface: #101010;
            --surface2: #161616;
            --border: #1e1e1e;
            --border-bright: #2a2a2a;
            --text: #f0ede8;
            --text-dim: rgba(240,237,232,0.45);
            --text-dimmer: rgba(240,237,232,0.22);
            --accent: #e8e0d0;
            --gold: #c9a96e;
            --gold-light: #e2c68e;
          }

          body {
            font-family: 'DM Sans', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
          }

          /* ── NOISE TEXTURE overlay ── */
          body::before {
            content: "";
            position: fixed;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: 0;
            opacity: 0.4;
          }

          /* ── NAVBAR ── */
          nav {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            display: flex; align-items: center; justify-content: space-between;
            padding: 18px 32px;
            transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s;
          }
          nav.scrolled {
            background: rgba(8,8,8,0.82);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom: 1px solid var(--border);
          }
          .nav-logo {
            font-family: 'Instrument Serif', serif;
            font-size: 22px;
            color: var(--text);
            letter-spacing: -0.02em;
          }
          .nav-logo span { color: var(--gold); }
          .nav-cta {
            display: flex; align-items: center; gap: 8px;
            padding: 9px 20px;
            background: var(--text);
            color: #080808;
            font-size: 13px; font-weight: 600;
            border-radius: 100px;
            transition: opacity 0.15s, transform 0.15s;
          }
          .nav-cta:hover { opacity: 0.88; transform: scale(1.02); }

          /* ── HERO ── */
          .hero {
            min-height: 100vh;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 120px 24px 80px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }

          /* Radial glow layers */
          .hero::before {
            content: "";
            position: absolute;
            top: -20%; left: 50%; transform: translateX(-50%);
            width: 900px; height: 900px;
            background: radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 65%);
            pointer-events: none;
          }
          .hero::after {
            content: "";
            position: absolute;
            bottom: 0; left: 50%; transform: translateX(-50%);
            width: 100%; height: 1px;
            background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
          }

          /* Floating orbs */
          .orb {
            position: absolute; border-radius: 50%; pointer-events: none;
            filter: blur(80px);
          }
          .orb-1 { width: 400px; height: 400px; top: 10%; left: 5%; background: rgba(201,169,110,0.04); animation: floatOrb 14s ease-in-out infinite; }
          .orb-2 { width: 300px; height: 300px; top: 40%; right: 8%; background: rgba(180,160,220,0.03); animation: floatOrb 18s ease-in-out infinite reverse; }

          @keyframes floatOrb {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, -30px); }
          }

          /* Animations */
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes wordIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes wordOut {
            from { opacity: 1; transform: translateY(0); }
            to   { opacity: 0; transform: translateY(-10px); }
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0.5; }
            70% { transform: scale(1.1); opacity: 0; }
            100% { transform: scale(0.95); opacity: 0; }
          }

          .vis .a1 { animation: fadeUp 0.7s 0.05s cubic-bezier(0.16,1,0.3,1) both; }
          .vis .a2 { animation: fadeUp 0.7s 0.14s cubic-bezier(0.16,1,0.3,1) both; }
          .vis .a3 { animation: fadeUp 0.7s 0.22s cubic-bezier(0.16,1,0.3,1) both; }
          .vis .a4 { animation: fadeUp 0.7s 0.30s cubic-bezier(0.16,1,0.3,1) both; }
          .vis .a5 { animation: fadeUp 0.7s 0.38s cubic-bezier(0.16,1,0.3,1) both; }
          .vis .a6 { animation: fadeUp 0.7s 0.46s cubic-bezier(0.16,1,0.3,1) both; }
          .vis .a7 { animation: fadeUp 0.7s 0.54s cubic-bezier(0.16,1,0.3,1) both; }

          /* Badge pill */
          .hero-badge {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 6px 14px 6px 8px;
            background: rgba(201,169,110,0.08);
            border: 1px solid rgba(201,169,110,0.22);
            border-radius: 100px;
            font-size: 12px; font-weight: 500;
            color: var(--gold-light);
            margin-bottom: 32px;
            letter-spacing: 0.01em;
          }
          .hero-badge-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: var(--gold);
            position: relative;
          }
          .hero-badge-dot::after {
            content: ""; position: absolute; inset: -3px;
            border-radius: 50%; border: 1px solid var(--gold);
            animation: pulse-ring 2s ease-out infinite;
          }

          /* Main headline — mix serif + sans */
          .headline {
            font-size: clamp(44px, 10vw, 88px);
            font-weight: 400;
            line-height: 1.0;
            letter-spacing: -0.04em;
            margin-bottom: 28px;
          }
          .headline-serif {
            font-family: 'Instrument Serif', serif;
            font-style: italic;
            color: var(--gold);
          }
          .headline-sans {
            font-family: 'DM Sans', sans-serif;
            font-weight: 700;
            color: var(--text);
          }

          /* Changing word */
          .word-line {
            font-size: clamp(38px, 8.5vw, 76px);
            font-family: 'Instrument Serif', serif;
            font-style: italic;
            font-weight: 400;
            letter-spacing: -0.03em;
            line-height: 1.0;
            margin-bottom: 30px;
          }
          .word-wrap { display: inline-block; min-width: 220px; }
          .changing-word {
            display: inline-block;
            background: linear-gradient(90deg, rgba(201,169,110,0.55) 0%, var(--gold-light) 40%, rgba(201,169,110,0.55) 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3.5s linear infinite;
          }
          .changing-word.fade-in  { animation: wordIn  0.22s ease forwards, shimmer 3.5s linear infinite; }
          .changing-word.fade-out { animation: wordOut 0.22s ease forwards; }

          /* Sub text */
          .hero-sub {
            font-size: clamp(15px, 2.2vw, 18px);
            color: var(--text-dim);
            line-height: 1.65;
            max-width: 500px;
            margin: 0 auto 12px;
            font-weight: 300;
          }
          .hero-pills {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap; gap: 8px;
            margin-bottom: 40px;
          }
          .pill {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 4px 12px;
            border: 1px solid var(--border-bright);
            border-radius: 100px;
            font-size: 11.5px; color: var(--text-dimmer);
            font-weight: 500;
          }
          .pill i { font-size: 9px; color: var(--gold); }

          /* Buttons */
          .cta-wrap {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap; gap: 12px;
            margin-bottom: 64px;
          }
          .btn-main {
            display: inline-flex; align-items: center; gap: 9px;
            padding: 15px 30px;
            background: var(--text);
            color: #080808;
            font-size: 14.5px; font-weight: 700;
            border-radius: 100px;
            border: none;
            transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
            box-shadow: 0 0 0 0 rgba(240,237,232,0);
            letter-spacing: -0.01em;
          }
          .btn-main:hover {
            transform: scale(1.03);
            box-shadow: 0 8px 30px rgba(240,237,232,0.12);
          }
          .btn-outline {
            display: inline-flex; align-items: center; gap: 9px;
            padding: 14px 26px;
            background: transparent;
            color: var(--text-dim);
            font-size: 14px; font-weight: 500;
            border-radius: 100px;
            border: 1px solid var(--border-bright);
            transition: border-color 0.15s, color 0.15s, transform 0.15s;
          }
          .btn-outline:hover { border-color: rgba(240,237,232,0.3); color: var(--text); transform: scale(1.02); }

          /* Profile preview card */
          .profile-preview {
            display: flex; align-items: center; gap: 14px;
            padding: 14px 20px;
            background: var(--surface);
            border: 1px solid var(--border-bright);
            border-radius: 18px;
            max-width: 340px;
            margin: 0 auto;
            text-align: left;
          }
          .preview-avatar {
            width: 44px; height: 44px; border-radius: 50%;
            background: linear-gradient(135deg, var(--gold) 0%, #a07840 100%);
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; color: #fff; font-family: 'Instrument Serif', serif;
            flex-shrink: 0;
          }
          .preview-url { font-size: 12px; color: var(--text-dimmer); margin-bottom: 2px; }
          .preview-name { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
          .preview-badge-tag {
            display: inline-flex; align-items: center; gap: 4px;
            padding: 2px 8px;
            background: rgba(201,169,110,0.1);
            border: 1px solid rgba(201,169,110,0.2);
            border-radius: 100px;
            font-size: 10px; color: var(--gold-light); font-weight: 600;
            margin-top: 4px;
          }
          .preview-links {
            display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;
          }
          .preview-link-dot {
            width: 24px; height: 24px; border-radius: 7px;
            background: var(--surface2); border: 1px solid var(--border);
            display: flex; align-items: center; justify-content: center;
            font-size: 10px; color: var(--text-dimmer);
          }

          /* ── STATS BAR ── */
          .stats-bar {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap;
            gap: 0;
            max-width: 680px;
            margin: 0 auto 0;
            border: 1px solid var(--border);
            border-radius: 18px;
            overflow: hidden;
            background: var(--surface);
          }
          .stat-item {
            flex: 1; min-width: 120px;
            padding: 20px 16px;
            text-align: center;
            border-right: 1px solid var(--border);
            position: relative;
          }
          .stat-item:last-child { border-right: none; }
          .stat-value {
            font-family: 'Instrument Serif', serif;
            font-size: 28px;
            color: var(--text);
            line-height: 1;
            margin-bottom: 4px;
            letter-spacing: -0.03em;
          }
          .stat-label { font-size: 11px; color: var(--text-dimmer); font-weight: 500; letter-spacing: 0.02em; }

          /* ── SECTIONS ── */
          .section {
            max-width: 1020px; margin: 0 auto;
            padding: 96px 24px;
            position: relative; z-index: 1;
          }
          .sec-eyebrow {
            text-align: center; font-size: 10.5px; font-weight: 700;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 12px;
          }
          .sec-title {
            text-align: center;
            font-size: clamp(26px, 5.5vw, 40px);
            font-weight: 700; letter-spacing: -0.04em;
            color: var(--text); margin-bottom: 10px; line-height: 1.1;
          }
          .sec-title em {
            font-family: 'Instrument Serif', serif;
            font-style: italic;
            font-weight: 400;
            color: var(--gold);
          }
          .sec-sub {
            text-align: center;
            font-size: 15px; color: var(--text-dim);
            max-width: 480px; margin: 0 auto 52px;
            line-height: 1.65; font-weight: 300;
          }

          /* divider line */
          .section-line {
            width: 100%; max-width: 1020px; margin: 0 auto;
            height: 1px; background: var(--border);
          }

          /* ── FEATURE GRID ── */
          .feat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1px;
            background: var(--border);
            border: 1px solid var(--border);
            border-radius: 20px;
            overflow: hidden;
          }
          .feat-card {
            background: var(--surface);
            padding: 28px 26px;
            transition: background 0.2s;
            position: relative;
          }
          .feat-card::before {
            content: "";
            position: absolute; top: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(201,169,110,0), transparent);
            transition: background 0.3s;
          }
          .feat-card:hover { background: var(--surface2); }
          .feat-card:hover::before {
            background: linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent);
          }
          .feat-icon {
            width: 44px; height: 44px; border-radius: 12px;
            background: var(--bg);
            border: 1px solid var(--border-bright);
            display: flex; align-items: center; justify-content: center;
            font-size: 17px; color: var(--gold);
            margin-bottom: 16px;
          }
          .feat-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; letter-spacing: -0.01em; }
          .feat-desc { font-size: 13px; color: var(--text-dim); line-height: 1.7; font-weight: 300; }

          /* ── STEPS ── */
          .steps-wrap { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 1px; }
          .step {
            display: flex; align-items: flex-start; gap: 20px;
            padding: 24px 26px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            position: relative;
            transition: border-color 0.2s, transform 0.2s;
          }
          .step:hover { border-color: var(--border-bright); transform: translateX(4px); }
          .step-number {
            font-family: 'Instrument Serif', serif;
            font-size: 38px; color: rgba(201,169,110,0.12);
            font-style: italic;
            line-height: 1; flex-shrink: 0;
            margin-top: -4px;
            width: 40px; text-align: center;
          }
          .step-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 5px; letter-spacing: -0.01em; }
          .step-desc { font-size: 13px; color: var(--text-dim); line-height: 1.65; font-weight: 300; }

          /* ── FAQ ── */
          .faq-list { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 1px; }
          .faq-item {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            overflow: hidden;
          }
          .faq-q {
            padding: 18px 22px;
            font-size: 14px; font-weight: 600; color: var(--text);
            letter-spacing: -0.01em; cursor: default;
            display: flex; align-items: center; justify-content: space-between; gap: 12px;
          }
          .faq-q i { font-size: 11px; color: var(--gold); flex-shrink: 0; }
          .faq-a {
            padding: 0 22px 16px;
            font-size: 13px; color: var(--text-dim); line-height: 1.7; font-weight: 300;
          }

          /* ── BOTTOM CTA ── */
          .cta-box {
            max-width: 640px; margin: 0 auto;
            padding: 56px 40px;
            background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
            border: 1px solid var(--border-bright);
            border-radius: 28px;
            text-align: center;
            position: relative; overflow: hidden;
          }
          .cta-box::before {
            content: "";
            position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
            width: 350px; height: 200px;
            background: radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%);
          }
          .cta-glyph {
            font-family: 'Instrument Serif', serif;
            font-size: 56px; font-style: italic; color: rgba(201,169,110,0.12);
            line-height: 1; margin-bottom: 8px;
          }
          .cta-t {
            font-size: clamp(24px, 5vw, 34px);
            font-weight: 700; letter-spacing: -0.04em; margin-bottom: 10px; line-height: 1.1;
          }
          .cta-t em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--gold); }
          .cta-d { font-size: 14px; color: var(--text-dim); line-height: 1.7; margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto; font-weight: 300; }
          .cta-url {
            display: inline-block;
            padding: 6px 16px;
            background: rgba(201,169,110,0.08);
            border: 1px solid rgba(201,169,110,0.18);
            border-radius: 100px;
            font-size: 13px; color: var(--gold-light); font-weight: 600;
            margin-bottom: 28px;
            letter-spacing: 0.01em;
          }

          /* ── FOOTER ── */
          footer {
            text-align: center;
            padding: 28px 24px 36px;
            border-top: 1px solid var(--border);
            position: relative; z-index: 1;
          }
          .ft-brand {
            font-family: 'Instrument Serif', serif;
            font-size: 20px; font-style: italic;
            color: rgba(240,237,232,0.3); margin-bottom: 6px;
          }
          .ft-brand span { color: var(--gold); opacity: 0.6; }
          .ft-dev { font-size: 12px; color: var(--text-dimmer); }
          .ft-dev strong { color: rgba(240,237,232,0.28); font-weight: 600; }
          .ft-links {
            display: flex; align-items: center; justify-content: center;
            gap: 20px; margin-top: 12px; flex-wrap: wrap;
          }
          .ft-links a { font-size: 11.5px; color: var(--text-dimmer); font-weight: 500; transition: color 0.15s; }
          .ft-links a:hover { color: rgba(240,237,232,0.45); }
          .ft-sep { color: var(--border-bright); }

          @media (max-width: 600px) {
            nav { padding: 14px 18px; }
            .hero { padding: 100px 18px 60px; }
            .section { padding: 64px 18px; }
            .stats-bar { border-radius: 14px; }
            .stat-item { padding: 16px 12px; }
            .stat-value { font-size: 22px; }
            .cta-box { padding: 36px 22px; }
            .feat-grid { border-radius: 14px; }
          }
          @media (max-width: 420px) {
            .word-wrap { min-width: 160px; }
            .headline { font-size: 38px; }
          }
        `}</style>
      </Head>

      {/* ── NAVBAR ── */}
      <nav className={scrolled ? "scrolled" : ""} aria-label="Main navigation">
        <div className="nav-logo">link<span>i</span>tin</div>
        <a href="/create" className="nav-cta" aria-label="Create your free profile">
          Create Free Profile
        </a>
      </nav>

      {/* ── HERO ── */}
      <main>
        <div ref={heroRef} className={`hero ${visible ? "vis" : ""}`} role="banner">
          <div className="orb orb-1" aria-hidden="true" />
          <div className="orb orb-2" aria-hidden="true" />

          {/* Live badge */}
          <div className="hero-badge a1" aria-label="Free link in bio tool">
            <span className="hero-badge-dot" aria-hidden="true" />
            Free Link in Bio — No Account Needed
          </div>

          {/* Headline */}
          <h1 className="headline a2">
            <span className="headline-serif">One URL</span>{" "}
            <span className="headline-sans">for</span>
          </h1>

          {/* Rotating word */}
          <div className="word-line a2" aria-live="polite" aria-atomic="true">
            <span className="word-wrap">
              <span className={`changing-word ${fade ? "fade-in" : "fade-out"}`}>
                {WORDS[wordIdx]}
              </span>
            </span>
          </div>

          <p className="hero-sub a3">
            Build your personal profile page in seconds. Add your photo, badge, social links, Spotify song and AI-written bio — then share one link everywhere.
          </p>

          {/* Feature pills */}
          <div className="hero-pills a3" aria-label="Key features">
            {["Free forever", "No account", "Live in 3 sec", "AI bio", "Spotify"].map((t, i) => (
              <span key={i} className="pill">
                <i className="fas fa-check" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="cta-wrap a4">
            <a href="/create" className="btn-main" aria-label="Create your free link in bio profile">
              <i className="fas fa-rocket" style={{ fontSize: 12 }} aria-hidden="true" />
              Create Your Profile — Free
            </a>
            <a href="#features" className="btn-outline" aria-label="See all features">
              See features
              <i className="fas fa-arrow-down" style={{ fontSize: 11 }} aria-hidden="true" />
            </a>
          </div>

          {/* Profile preview */}
          <div className="profile-preview a5" aria-label="Profile preview example">
            <div className="preview-avatar" aria-hidden="true">S</div>
            <div>
              <div className="preview-url">linkitin.site/samarthags</div>
              <div className="preview-name">Samartha GS</div>
              <div className="preview-badge-tag">
                <i className="fas fa-code" aria-hidden="true" style={{ fontSize: 9 }} />
                Full-Stack Developer
              </div>
              <div className="preview-links" aria-hidden="true">
                {["fab fa-github", "fab fa-instagram", "fab fa-linkedin", "fab fa-spotify"].map((ic, i) => (
                  <div key={i} className="preview-link-dot"><i className={ic} /></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 96 }}>
          <div className="stats-bar" role="list" aria-label="Platform statistics">
            {STATS.map((s, i) => (
              <div key={i} className="stat-item" role="listitem">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-line" aria-hidden="true" />

        {/* ── FEATURES ── */}
        <section id="features" className="section" aria-labelledby="features-heading">
          <div className="sec-eyebrow">What you get</div>
          <h2 className="sec-title" id="features-heading">
            Everything in <em>one profile</em>
          </h2>
          <p className="sec-sub">All the tools you need to show the world who you are — wrapped into a single, shareable link.</p>
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

        <div className="section-line" aria-hidden="true" />

        {/* ── HOW IT WORKS ── */}
        <section className="section" aria-labelledby="steps-heading">
          <div className="sec-eyebrow">Simple process</div>
          <h2 className="sec-title" id="steps-heading">
            Live in <em>3 steps</em>
          </h2>
          <p className="sec-sub">No account. No email. No waiting. Just open, build, and share.</p>
          <div className="steps-wrap" role="list">
            {steps.map((s, i) => (
              <div key={i} className="step" role="listitem">
                <div className="step-number" aria-hidden="true">{s.n}</div>
                <div>
                  <h3 className="step-title">{s.t}</h3>
                  <p className="step-desc">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-line" aria-hidden="true" />

        {/* ── FAQ ── */}
        <section className="section" aria-labelledby="faq-heading">
          <div className="sec-eyebrow">FAQ</div>
          <h2 className="sec-title" id="faq-heading">
            Common <em>questions</em>
          </h2>
          <p className="sec-sub">Everything you need to know before getting started.</p>
          <div className="faq-list" role="list">
            {faqs.map((f, i) => (
              <div key={i} className="faq-item" role="listitem" itemScope itemType="https://schema.org/Question">
                <div className="faq-q" itemProp="name">
                  {f.q}
                  <i className="fas fa-plus" aria-hidden="true" />
                </div>
                <div className="faq-a" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <span itemProp="text">{f.a}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-line" aria-hidden="true" />

        {/* ── BOTTOM CTA ── */}
        <section className="section" aria-labelledby="cta-heading">
          <div className="cta-box">
            <div className="cta-glyph" aria-hidden="true">&ldquo;</div>
            <h2 className="cta-t" id="cta-heading">
              Your profile,<br /><em>your story</em>
            </h2>
            <p className="cta-d">
              No account. No email. Open on any device, build your profile, and share your link everywhere — in under a minute.
            </p>
            <div className="cta-url" aria-label="Your profile URL format">
              linkitin.site/<strong>you</strong>
            </div>
            <br />
            <a href="/create" className="btn-main" style={{ display: "inline-flex" }} aria-label="Create your free link in bio profile">
              <i className="fas fa-rocket" style={{ fontSize: 12 }} aria-hidden="true" />
              Create for Free
            </a>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer role="contentinfo">
        <div className="ft-brand">link<span>i</span>tin</div>
        <div className="ft-dev">
          Developed by <strong>Samartha GS</strong>
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
