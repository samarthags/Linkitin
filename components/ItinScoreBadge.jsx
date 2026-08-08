// components/ItinScoreBadge.jsx
// Standalone badge — NOT linked to Duo at all. Shows a user's Itin Score,
// which goes up +10 per unique profile view (see pages/api/track.js).
// Tap it for a tiny tier readout — tiers are derived purely from the score
// number itself, so no extra DB field or logic is needed anywhere else.
import { useEffect, useState } from "react";

const LIME  = "#d7ff3f";
const BLACK = "#0a0a0a";

const TIERS = [
  { min: 0,    label: "New",      },
  { min: 100,  label: "Bronze",   },
  { min: 500,  label: "Silver",   },
  { min: 1500, label: "Gold",     },
  { min: 5000, label: "Platinum", },
];

function tierFor(score) {
  let t = TIERS[0];
  for (const tier of TIERS) if (score >= tier.min) t = tier;
  return t;
}

export default function ItinScoreBadge({ username }) {
  const [score, setScore] = useState(null);
  const [open,  setOpen]  = useState(false);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/itin-score?username=${username}`)
      .then(r => r.json())
      .then(d => setScore(d.score ?? 0))
      .catch(() => setScore(0));
  }, [username]);

  if (score == null) return null;

  const tier = tierFor(score);
  const next = TIERS.find(t => t.min > score);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#fff", color: BLACK, border: `2px solid ${BLACK}`,
          borderRadius: 999, padding: "7px 15px", fontSize: 12, fontWeight: 800,
          letterSpacing: ".05em", textTransform: "uppercase",
          fontFamily: "'Sora', sans-serif", cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: "50%", background: LIME,
          border: `1.5px solid ${BLACK}`, flexShrink: 0,
        }} />
        Itin Score · {score}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
            background: BLACK, color: "#fff", borderRadius: 12, padding: "10px 14px",
            fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", zIndex: 50,
            fontFamily: "'Sora', sans-serif", textAlign: "center", cursor: "pointer",
          }}
        >
          <span style={{ color: LIME }}>{tier.label} tier</span>
          {next && <> · {next.min - score} pts to {next.label}</>}
        </div>
      )}
    </span>
  );
}
