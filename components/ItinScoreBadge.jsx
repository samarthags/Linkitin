// components/ItinScoreBadge.jsx
// Standalone badge — NOT linked to Duo at all. Shows a user's Itin Score,
// which goes up +10 per unique profile view (see pages/api/track.js).
// Same black/lime theme as DuoBadge, but a distinct white-outline style
// so the two badges read as separate things at a glance.
import { useEffect, useState } from "react";

const LIME  = "#d7ff3f";
const BLACK = "#0a0a0a";

export default function ItinScoreBadge({ username }) {
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/itin-score?username=${username}`)
      .then(r => r.json())
      .then(d => setScore(d.score))
      .catch(() => {});
  }, [username]);

  if (score == null) return null;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: "#fff", color: BLACK, border: `2px solid ${BLACK}`,
      borderRadius: 999, padding: "7px 15px", fontSize: 12, fontWeight: 800,
      letterSpacing: ".05em", textTransform: "uppercase",
      fontFamily: "'Sora', sans-serif",
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%", background: LIME,
        border: `1.5px solid ${BLACK}`, flexShrink: 0,
      }} />
      Itin Score · {score}
    </span>
  );
}
