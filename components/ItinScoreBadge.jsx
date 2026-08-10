// components/ItinScoreBadge.jsx
// Standalone badge — NOT linked to Duo at all. Shows a user's Itin Score,
// which goes up +10 per unique profile view (see pages/api/track.js).
// Compact pill: icon + number only. Tap it for a full tier readout —
// tiers are derived purely from the score number, no extra DB field needed.
//
// Rendered via a React Portal into document.body — same reason DuoBadge
// does this: `position:fixed` gets silently trapped by any ancestor with a
// completed CSS `transform` (e.g. a slide-up entrance animation that ends
// at translateY(0) still counts). Portal-ing avoids that so the modal
// always covers the true viewport no matter where this badge is mounted.
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LIME  = "#d7ff3f";
const BLACK = "#0a0a0a";
const CREAM = "#fafaf7";

const TIERS = [
  { min: 0,     label: "Bronze"   },
  { min: 1000,  label: "Silver"   },
  { min: 5000,  label: "Gold"     },
  { min: 10000, label: "Platinum" },
];

function tierFor(score) {
  let t = TIERS[0];
  for (const tier of TIERS) if (score >= tier.min) t = tier;
  return t;
}

const KEYFRAMES = `
@keyframes itinBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes itinCardIn { from { opacity: 0; transform: scale(.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes itinCountIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
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
  const tier = tierFor(score);

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
      <style>{KEYFRAMES}</style>
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
          display: "inline-block", background: BLACK, color: LIME, borderRadius: 999,
          padding: "3px 10px", fontSize: 9, fontWeight: 800, letterSpacing: ".08em",
          textTransform: "uppercase", marginBottom: 14,
        }}>
          Itin Score
        </div>

        <div style={{ textAlign: "center", margin: "2px 0 10px", animation: "itinCountIn .3s .05s both" }}>
          <span style={{ fontSize: 40, fontWeight: 900, color: BLACK, lineHeight: 1 }}>{score}</span>
        </div>

        <div style={{ textAlign: "center", fontSize: 14, lineHeight: 1.6, color: "#2e2e28", marginBottom: 14 }}>
          <strong>{username}</strong> has an Itin Score of <strong>{score}</strong>, ranked{" "}
          <span style={{
            display: "inline-block", background: BLACK, color: LIME, borderRadius: 6,
            padding: "1px 9px", fontWeight: 800, fontSize: 12.5, letterSpacing: ".02em",
          }}>{tier.label}</span>.
        </div>

        <div style={{ textAlign: "center", fontSize: 11.5, color: "#8a8a80", lineHeight: 1.6 }}>
          The Itin Score goes up whenever anyone interacts with this profile — a view, a share, or a click on any link or social icon.
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Itin Score ${score}`}
        title="Itin Score"
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "#fff", color: BLACK, border: `2px solid ${BLACK}`,
          borderRadius: 999, padding: "6px 13px", fontSize: 12, fontWeight: 800,
          fontFamily: "'Sora', sans-serif", cursor: "pointer",
          WebkitTapHighlightColor: "transparent", transition: "background .15s, transform .1s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f3ea"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
      >
        <i className="fas fa-bolt" style={{ fontSize: 10, opacity: .75 }}/>
        {score}
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
