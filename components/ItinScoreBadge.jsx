// components/ItinScoreBadge.jsx
// Standalone badge — NOT linked to Duo at all. Shows a user's Itin Score,
// which goes up +10 per interaction (see pages/api/track.js).
// The badge's whole look — trigger pill AND modal accent — changes per
// rank, so a Platinum profile visibly reads as more "advanced" than a
// fresh Bronze one at a glance.
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const BLACK = "#0a0a0a";
const CREAM = "#fafaf7";
const LIME  = "#d7ff3f";

const TIERS = [
  { min: 0,     label: "Bronze"   },
  { min: 1000,  label: "Silver"   },
  { min: 5000,  label: "Gold"     },
  { min: 10000, label: "Platinum" },
];

// Per-rank visual theme. Higher rank = richer surface + a soft glow;
// Gold and Platinum also get an animated shimmer sweep.
const TIER_STYLE = {
  Bronze:   { bg: "#fff",                                              border: BLACK,     text: BLACK, glow: "none",                            shimmer: false },
  Silver:   { bg: "linear-gradient(135deg,#f6f6f9,#cfd1da 55%,#f0f0f4)", border: "#9a9aa6", text: BLACK, glow: "0 0 12px rgba(150,150,165,.35)",  shimmer: false },
  Gold:     { bg: "linear-gradient(135deg,#fff2c9,#e7b423 60%,#fff2c9)", border: "#b4870f", text: "#4a3300", glow: "0 0 16px rgba(231,180,35,.45)", shimmer: true  },
  Platinum: { bg: "linear-gradient(135deg,#0a0a0a,#233b2e 45%,#0a0a0a)", border: BLACK,     text: LIME,  glow: "0 0 18px rgba(215,255,63,.5)",     shimmer: true  },
};

function tierFor(score) {
  let t = TIERS[0];
  for (const tier of TIERS) if (score >= tier.min) t = tier;
  return t;
}

const KEYFRAMES = `
@keyframes itinBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes itinCardIn { from { opacity: 0; transform: scale(.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes itinCountIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes itinShimmer { 0% { transform: translateX(-130%) skewX(-12deg); } 100% { transform: translateX(230%) skewX(-12deg); } }
@keyframes itinGlowPulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
`;

export default function ItinScoreBadge({ username }) {
  const [score,   setScore]   = useState(null);
  const [open,    setOpen]    = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/itin-score?username=${username}`)
      .then(r => r.json())
      .then(d => setScore(typeof d?.score === "number" ? d.score : 0))
      .catch(() => setScore(0));
  }, [username]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (score == null) return null;
  const tier  = tierFor(score);
  const style = TIER_STYLE[tier.label];

  const modal = (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.62)", zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, backdropFilter: "blur(4px)",
        animation: "itinBackdropIn .18s ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: CREAM, borderRadius: 20, border: `2px solid ${BLACK}`,
          boxShadow: "0 20px 50px rgba(0,0,0,.35)",
          width: "100%", maxWidth: 300, padding: 20, position: "relative",
          fontFamily: "'Sora', sans-serif",
          animation: "itinCardIn .22s cubic-bezier(.2,.9,.3,1.15) both",
        }}
      >
        <button
          type="button" onClick={() => setOpen(false)} aria-label="Close"
          style={{
            position: "absolute", top: 12, right: 12, width: 26, height: 26,
            borderRadius: "50%", background: BLACK, color: "#fff", border: "none",
            fontSize: 14, cursor: "pointer", lineHeight: 1,
          }}
        >×</button>

        <div style={{
          display: "inline-block", background: style.bg, color: style.text,
          border: `1.5px solid ${style.border}`, boxShadow: style.glow,
          borderRadius: 999, padding: "3px 10px", fontSize: 9, fontWeight: 800,
          letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14,
        }}>
          Itin Score
        </div>

        <div style={{ textAlign: "center", margin: "2px 0 10px", animation: "itinCountIn .3s .05s both" }}>
          <span style={{ fontSize: 40, fontWeight: 900, color: BLACK, lineHeight: 1 }}>{score}</span>
        </div>

        <div style={{ textAlign: "center", fontSize: 14, lineHeight: 1.6, color: "#2e2e28", marginBottom: 14 }}>
          <strong>{username}</strong> has an Itin Score of <strong>{score}</strong>, ranked{" "}
          <span style={{
            position: "relative", display: "inline-block", overflow: "hidden",
            background: style.bg, color: style.text, border: `1.5px solid ${style.border}`,
            boxShadow: style.glow, borderRadius: 6, padding: "1px 9px",
            fontWeight: 800, fontSize: 12.5, letterSpacing: ".02em",
          }}>
            {tier.label}
            {style.shimmer && (
              <span style={{
                position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
                background: "linear-gradient(115deg,transparent,rgba(255,255,255,.65),transparent)",
                animation: "itinShimmer 2.4s ease-in-out infinite",
              }}/>
            )}
          </span>.
        </div>

        <div style={{ textAlign: "center", fontSize: 11.5, color: "#8a8a80", lineHeight: 1.6 }}>
          The Itin Score goes up whenever anyone interacts with this profile — a view, a share, or a click on any link or social icon.
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{KEYFRAMES}</style>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Itin Score ${score}, ${tier.label} rank`}
        title={`Itin Score — ${tier.label}`}
        style={{
          position: "relative", overflow: "hidden",
          display: "inline-flex", alignItems: "center", gap: 5,
          background: style.bg, color: style.text, border: `2px solid ${style.border}`,
          boxShadow: style.glow, borderRadius: 999, padding: "6px 13px",
          fontSize: 12, fontWeight: 800, fontFamily: "'Sora', sans-serif", cursor: "pointer",
          WebkitTapHighlightColor: "transparent", transition: "transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .25s",
          animation: style.shimmer ? "itinGlowPulse 2.6s ease-in-out infinite" : "none",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <i className="fas fa-bolt" style={{ fontSize: 10, opacity: .8 }}/>
        {score}
        {style.shimmer && (
          <span style={{
            position: "absolute", top: 0, left: 0, width: "35%", height: "100%",
            background: "linear-gradient(115deg,transparent,rgba(255,255,255,.6),transparent)",
            animation: "itinShimmer 2.8s ease-in-out infinite",
          }}/>
        )}
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
