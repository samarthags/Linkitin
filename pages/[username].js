// pages/[username].js
import Head from "next/head";
import clientPromise from "../lib/mongodb";

const PLATFORMS = {
  email:        { icon:"fas fa-envelope",      color:"#EA4335", url:(v)=>`mailto:${v}`,                                    label:"Email" },
  whatsapp:     { icon:"fab fa-whatsapp",       color:"#25D366", url:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,          label:"WhatsApp" },
  instagram:    { icon:"fab fa-instagram",      color:"#E4405F", url:(v)=>`https://instagram.com/${v.replace("@","")}`,    label:"Instagram" },
  facebook:     { icon:"fab fa-facebook-f",     color:"#1877F2", url:(v)=>`https://facebook.com/${v}`,                     label:"Facebook" },
  github:       { icon:"fab fa-github",         color:"#fff",    url:(v)=>`https://github.com/${v}`,                       label:"GitHub" },
  snapchat:     { icon:"fab fa-snapchat",       color:"#FFE700", url:(v)=>`https://snapchat.com/add/${v}`,                 label:"Snapchat" },
  youtube:      { icon:"fab fa-youtube",        color:"#FF0000", url:(v)=>`https://youtube.com/${v}`,                      label:"YouTube" },
  twitter:      { icon:"fab fa-x-twitter",      color:"#fff",    url:(v)=>`https://twitter.com/${v.replace("@","")}`,      label:"Twitter" },
  linkedin:     { icon:"fab fa-linkedin-in",    color:"#0A66C2", url:(v)=>`https://linkedin.com/in/${v}`,                  label:"LinkedIn" },
  tiktok:       { icon:"fab fa-tiktok",         color:"#fff",    url:(v)=>`https://tiktok.com/@${v.replace("@","")}`,      label:"TikTok" },
  discord:      { icon:"fab fa-discord",        color:"#5865F2", url:(v)=>`https://discord.com/users/${v}`,                label:"Discord" },
  telegram:     { icon:"fab fa-telegram",       color:"#26A5E4", url:(v)=>`https://t.me/${v.replace("@","")}`,             label:"Telegram" },
  twitch:       { icon:"fab fa-twitch",         color:"#9146FF", url:(v)=>`https://twitch.tv/${v}`,                        label:"Twitch" },
  spotify:      { icon:"fab fa-spotify",        color:"#1DB954", url:(v)=>`https://open.spotify.com/user/${v}`,            label:"Spotify" },
  pinterest:    { icon:"fab fa-pinterest",      color:"#E60023", url:(v)=>`https://pinterest.com/${v}`,                    label:"Pinterest" },
  reddit:       { icon:"fab fa-reddit-alien",   color:"#FF4500", url:(v)=>`https://reddit.com/user/${v}`,                  label:"Reddit" },
  medium:       { icon:"fab fa-medium",         color:"#fff",    url:(v)=>`https://medium.com/${v.replace("@","")}`,       label:"Medium" },
  devto:        { icon:"fab fa-dev",            color:"#fff",    url:(v)=>`https://dev.to/${v}`,                           label:"DEV.to" },
  behance:      { icon:"fab fa-behance",        color:"#1769FF", url:(v)=>`https://behance.net/${v}`,                      label:"Behance" },
  dribbble:     { icon:"fab fa-dribbble",       color:"#ea4c89", url:(v)=>`https://dribbble.com/${v}`,                     label:"Dribbble" },
  threads:      { icon:"fab fa-threads",        color:"#fff",    url:(v)=>`https://threads.net/${v.replace("@","")}`,      label:"Threads" },
  bluesky:      { icon:"fas fa-cloud",          color:"#1185FE", url:(v)=>`https://bsky.app/profile/${v.replace("@","")}`, label:"Bluesky" },
  npm:          { icon:"fab fa-npm",            color:"#CC3534", url:(v)=>`https://npmjs.com/~${v.replace("~","")}`,       label:"npm" },
  codepen:      { icon:"fab fa-codepen",        color:"#fff",    url:(v)=>`https://codepen.io/${v}`,                       label:"CodePen" },
  stackoverflow:{ icon:"fab fa-stack-overflow", color:"#F58025", url:(v)=>`https://stackoverflow.com/users/${v}`,          label:"Stack Overflow" },
};

function calcAge(dob) {
  if (!dob) return null;
  const today = new Date(), b = new Date(dob);
  let age = today.getFullYear() - b.getFullYear();
  if (today.getMonth() < b.getMonth() ||
    (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())) age--;
  return age > 0 ? age : null;
}

export default function ProfilePage({ user }) {
  if (!user) {
    return (
      <>
        <Head>
          <title>Not found — mywebsam</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#f4f5f9;color:#111827;}`}</style>
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#fef2f2",border:"2px solid #fca5a5",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:32,color:"#ef4444"}}>
            <i className="fas fa-user-slash" />
          </div>
          <h1 style={{fontSize:24,fontWeight:800,marginBottom:8,color:"#111827"}}>Profile Not Found</h1>
          <p style={{color:"#6b7280",marginBottom:28,fontSize:15,lineHeight:1.6}}>This username does not exist yet.</p>
          <a href="/" style={{background:"#6C63FF",color:"#fff",padding:"13px 28px",borderRadius:999,fontWeight:700,fontSize:15,display:"inline-flex",alignItems:"center",gap:9,boxShadow:"0 4px 18px rgba(108,99,255,.3)",textDecoration:"none"}}>
            <i className="fas fa-plus" /> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const age = calcAge(user.dob);
  const filledSocials = Object.entries(user.socialProfiles || {})
    .filter(([, v]) => v?.trim())
    .filter(([k]) => PLATFORMS[k]);
  const interestTags = Object.values(user.interests || {})
    .flat().filter(v => v && typeof v === "string").slice(0, 16);

  // Accent color — pulled from avatar or just vivid purple/blue like Linktree
  const BG = "#1a1a2e"; // deep navy, looks great with any avatar

  return (
    <>
      <Head>
        <title>{user.name} (@{user.username})</title>
        <meta name="description"        content={user.aboutme || user.bio || `${user.name} on mywebsam`} />
        {user.avatar && <meta property="og:image"       content={user.avatar} />}
        <meta property="og:title"       content={`${user.name} — mywebsam`} />
        <meta property="og:description" content={user.aboutme || user.bio || ""} />
        <meta name="viewport"           content="width=device-width,initial-scale=1" />
        <meta name="twitter:card"       content="summary_large_image" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html{min-height:100%;}
          body{
            font-family:'Plus Jakarta Sans',sans-serif;
            min-height:100vh;
            background:${BG};
            color:#fff;
            -webkit-font-smoothing:antialiased;
          }
          a{text-decoration:none;color:inherit;}

          @keyframes up{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
          .a1{animation:up .4s cubic-bezier(.22,.68,0,1.2) both;}
          .a2{animation:up .42s .06s cubic-bezier(.22,.68,0,1.2) both;}
          .a3{animation:up .44s .12s cubic-bezier(.22,.68,0,1.2) both;}
          .a4{animation:up .46s .18s cubic-bezier(.22,.68,0,1.2) both;}

          /* ─── PHOTO HERO — fills top, bleeds into background ─── */
          .hero{
            width:100%;
            max-height:55vh;
            position:relative;
            overflow:hidden;
          }
          .hero-img{
            width:100%;
            height:100%;
            max-height:55vh;
            object-fit:cover;
            object-position:center top;
            display:block;
          }
          /* gradient fade from photo into background color */
          .hero-fade{
            position:absolute;
            bottom:0;left:0;right:0;
            height:50%;
            background:linear-gradient(to bottom, transparent 0%, ${BG} 100%);
            pointer-events:none;
          }
          /* placeholder when no photo */
          .hero-ph{
            width:100%;height:220px;
            background:linear-gradient(160deg,#2d2b55,#1a1a2e);
          }

          /* ─── PAGE CONTENT ─── */
          .page{
            max-width:480px;
            margin:0 auto;
            padding:0 20px 80px;
          }

          /* avatar only shown when no banner photo */
          .avatar-solo{
            display:flex;justify-content:center;
            margin-top:28px;margin-bottom:16px;
          }
          .av{
            width:100px;height:100px;border-radius:50%;
            border:3px solid rgba(255,255,255,0.7);
            box-shadow:0 6px 24px rgba(0,0,0,0.4);
            object-fit:cover;display:block;
            background:linear-gradient(135deg,#6C63FF,#a78bfa);
            font-size:40px;font-weight:800;color:#fff;
            align-items:center;justify-content:center;
          }
          .av-ph{display:flex;}

          /* ─── IDENTITY ─── */
          .id-block{text-align:center;padding-top:8px;margin-bottom:20px;}
          .pname{
            font-size:28px;font-weight:800;
            color:#fff;
            text-shadow:0 2px 12px rgba(0,0,0,0.5);
            margin-bottom:5px;line-height:1.15;
          }
          .phandle{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:12px;}
          .meta-row{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
          .mc{
            display:inline-flex;align-items:center;gap:5px;
            font-size:12px;color:rgba(255,255,255,0.7);
            background:rgba(255,255,255,0.1);
            border:1px solid rgba(255,255,255,0.15);
            padding:4px 12px;border-radius:999px;
          }
          .pbio{
            font-size:14px;color:rgba(255,255,255,0.75);
            line-height:1.72;text-align:center;
            max-width:340px;margin:0 auto;
          }

          /* ─── SOCIAL ICONS — small circles ─── */
          .soc{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:10px;
            margin-bottom:28px;
          }
          .sicon{
            width:42px;height:42px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:17px;
            background:rgba(255,255,255,0.12);
            border:1.5px solid rgba(255,255,255,0.22);
            transition:transform .14s,background .14s;
          }
          .sicon:hover{transform:scale(1.12);background:rgba(255,255,255,0.22);}

          /* ─── LINKS — solid white pill buttons like Linktree ─── */
          .links{display:flex;flex-direction:column;gap:12px;margin-bottom:28px;}
          .lbtn{
            display:flex;align-items:center;
            width:100%;
            background:#fff;
            color:#111827;
            border-radius:999px;
            font-weight:700;font-size:15px;
            font-family:'Plus Jakarta Sans',sans-serif;
            cursor:pointer;
            transition:transform .15s,box-shadow .15s,background .15s;
            overflow:hidden;
            position:relative;
            min-height:56px;
          }
          .lbtn:hover{
            transform:scale(1.025);
            box-shadow:0 8px 28px rgba(0,0,0,0.25);
            background:#f5f5f5;
          }
          .lbtn:active{transform:scale(0.98);}
          .lbtn-icon{
            width:56px;min-height:56px;
            display:flex;align-items:center;justify-content:center;
            background:rgba(0,0,0,0.06);
            font-size:16px;color:#555;
            flex-shrink:0;
          }
          .lbtn-text{
            flex:1;text-align:center;
            padding:0 16px;
            color:#111827;
          }
          .lbtn-arr{
            width:44px;min-height:56px;
            display:flex;align-items:center;justify-content:center;
            font-size:12px;color:#bbb;flex-shrink:0;
          }

          /* ─── SPOTIFY ─── */
          .sp-block{margin-bottom:28px;}
          .sp-hd{
            text-align:center;font-size:11px;font-weight:700;
            letter-spacing:.07em;text-transform:uppercase;
            color:rgba(255,255,255,0.42);
            margin-bottom:12px;
            display:flex;align-items:center;justify-content:center;gap:6px;
          }
          .sp-embed{border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.35);}

          /* ─── INTERESTS ─── */
          .int-block{margin-bottom:28px;}
          .int-hd{
            text-align:center;font-size:11px;font-weight:700;
            letter-spacing:.07em;text-transform:uppercase;
            color:rgba(255,255,255,0.42);
            margin-bottom:12px;
            display:flex;align-items:center;justify-content:center;gap:6px;
          }
          .int-wrap{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;}
          .itag{
            padding:6px 14px;border-radius:999px;
            font-size:12px;font-weight:600;
            color:rgba(255,255,255,0.8);
            background:rgba(255,255,255,0.1);
            border:1px solid rgba(255,255,255,0.15);
          }

          /* ─── FOOTER ─── */
          .foot{
            text-align:center;
            font-size:12px;color:rgba(255,255,255,0.28);
            padding:8px 0 4px;
          }
          .foot a{color:rgba(255,255,255,0.5);font-weight:700;}
          .foot a:hover{color:#fff;}
          .foot-logo{display:inline-flex;align-items:center;gap:5px;margin-bottom:4px;}

          @media(max-width:460px){
            .pname{font-size:24px;}
            .lbtn{font-size:14px;min-height:52px;}
            .lbtn-icon{width:52px;min-height:52px;}
            .lbtn-arr{width:40px;min-height:52px;}
          }
        `}</style>
      </Head>

      {/* ── HERO PHOTO — full bleed, bleeds into background ── */}
      {user.avatar ? (
        <div className="hero a1">
          <img src={user.avatar} alt={user.name} className="hero-img" />
          <div className="hero-fade" />
        </div>
      ) : (
        <div className="hero-ph" />
      )}

      <div className="page">

        {/* Avatar shown only when no photo (already shown as hero) */}
        {!user.avatar && (
          <div className="avatar-solo a1">
            <div className="av av-ph">
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          </div>
        )}

        {/* ── Name + handle + meta + bio ── */}
        <div className="id-block a2">
          <div className="pname">{user.name}</div>
          <div className="phandle">@{user.username}</div>

          {(user.location || calcAge(user.dob)) && (
            <div className="meta-row">
              {user.location && (
                <span className="mc">
                  <i className="fas fa-location-dot" style={{fontSize:10}} />
                  {user.location}
                </span>
              )}
              {calcAge(user.dob) && (
                <span className="mc">
                  <i className="fas fa-cake-candles" style={{fontSize:10}} />
                  {calcAge(user.dob)} years old
                </span>
              )}
            </div>
          )}

          {(user.aboutme || user.bio) && (
            <p className="pbio">{user.aboutme || user.bio}</p>
          )}
        </div>

        {/* ── Social icons — small circles in a row ── */}
        {filledSocials.length > 0 && (
          <div className="soc a3">
            {filledSocials.map(([platform, value]) => {
              const p = PLATFORMS[platform];
              return (
                <a key={platform}
                  href={p.url(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sicon"
                  title={p.label}
                  style={{color: p.color}}>
                  <i className={p.icon} />
                </a>
              );
            })}
          </div>
        )}

        {/* ── Links — solid white pill buttons ── */}
        {(user.links || []).length > 0 && (
          <div className="links a3">
            {user.links.map((link, i) => (
              <a key={link.id || i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lbtn">
                <div className="lbtn-icon">
                  <i className={link.icon || "fas fa-link"} />
                </div>
                <div className="lbtn-text">{link.title}</div>
                <div className="lbtn-arr">
                  <i className="fas fa-chevron-right" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── Spotify embed ── */}
        {user.favSongTrackId && (
          <div className="sp-block a4">
            <div className="sp-hd">
              <i className="fab fa-spotify" style={{color:"#1DB954",fontSize:14}} />
              Currently Vibing To
            </div>
            <div className="sp-embed">
              <iframe
                src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{display:"block"}}
              />
            </div>
          </div>
        )}

        {/* ── Interests ── */}
        {interestTags.length > 0 && (
          <div className="int-block a4">
            <div className="int-hd">
              <i className="fas fa-heart" style={{color:"#f87171",fontSize:12}} />
              Interests
            </div>
            <div className="int-wrap">
              {interestTags.map((tag, i) => (
                <span key={i} className="itag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="foot">
          <div className="foot-logo">
            <img src="/icon.png" alt="mywebsam" style={{width:18,height:18,borderRadius:4,verticalAlign:"middle"}} />
            <a href="/"><strong>mywebsam</strong></a>
          </div>
          <div>Your link in bio — <a href="/">Create yours free</a></div>
        </div>

      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const user = await db.collection("users").findOne(
      { username: params.username.toLowerCase() },
      { projection: { _id: 0 } }
    );

    if (!user) return { props: { user: null } };

    return {
      props: {
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
  } catch (err) {
    console.error("[username page]", err);
    return { props: { user: null } };
  }
}
