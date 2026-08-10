// components/DuoBadge.jsx
// Advanced inline Duo card — rendered directly on the public profile page,
// above the social icons row. Always visible, no click-to-expand needed.
//
// Level is derived from BOTH partners' combined Itin Score (forked/summed
// live from /api/itin-score for each username), not a stored field:
//   combined <  1000            -> not leveled yet
//   combined >= 1000            -> Level 1
//   combined >= 3000            -> Level 2
//   combined >= 5000            -> Level 3   (steps of 2000 after the first)
import { useEffect, useState } from "react";

const LIME  = "#d7ff3f";
const BLACK = "#0a0a0a";
const CREAM = "#fafaf7";

const LEVEL_BASE = 1000; // combined score needed to reach Level 1
const LEVEL_STEP = 2000; // combined score needed for each level after that

function duoLevelInfo(combined) {
  if (combined < LEVEL_BASE) {
    return { level: 0, levelStart: 0, levelNext: LEVEL_BASE };
  }
  const level      = 1 + Math.floor((combined - LEVEL_BASE) / LEVEL_STEP);
  const levelStart = LEVEL_BASE + (level - 1) * LEVEL_STEP;
  const levelNext  = levelStart + LEVEL_STEP;
  return { level, levelStart, levelNext };
}

function Avatar({ person, z }) {
  const common = {
    width: 50, height: 50, borderRadius: "50%",
    border: `2.5px solid ${BLACK}`, marginRight: z === 2 ? -16 : 0, zIndex: z,
    flexShrink: 0, boxShadow: `0 0 0 3px ${CREAM}`,
  };
  return person?.avatar
    ? <img src={person.avatar} alt="" style={{ ...common, objectFit: "cover" }} />
    : (
      <div style={{
        ...common, background: LIME, display: "flex",
        alignItems: "center", justifyContent: "center", fontWeight: 900, color: BLACK, fontSize: 17,
      }}>
        {person?.name?.[0]?.toUpperCase() || person?.username?.[0]?.toUpperCase() || "?"}
      </div>
    );
}

function ProfileLink({ username, children }) {
  if (!username) return <>{children}</>;
  return (
    <a href={`/${username}`} style={{ textDecoration: "none", color: "inherit" }}>
      {children}
    </a>
  );
}

const KEYFRAMES = `
@keyframes duoCardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes duoAvatarsIn { from { opacity: 0; transform: scale(.75); } to { opacity: 1; transform: scale(1); } }
@keyframes duoFlameBurn {
  0%,100% { transform: scale(1) rotate(-3deg); filter: brightness(1) saturate(1); }
  25%     { transform: scale(1.12) rotate(3deg); filter: brightness(1.25) saturate(1.3); }
  50%     { transform: scale(.94) rotate(-2deg); filter: brightness(.92) saturate(1); }
  75%     { transform: scale(1.08) rotate(2deg); filter: brightness(1.15) saturate(1.2); }
}
@keyframes duoBarFill { from { width: 0; } }
`;

export default function DuoBadge({ duo }) {
  const [scores, setScores] = useState({ me: null, partner: null });

  useEffect(() => {
    const meUser      = duo?.me?.username;
    const partnerUser = duo?.partner?.username;
    if (!meUser || !partnerUser) return;

    Promise.all([
      fetch(`/api/itin-score?username=${meUser}`).then(r => r.json()).catch(() => ({ score: 0 })),
      fetch(`/api/itin-score?username=${partnerUser}`).then(r => r.json()).catch(() => ({ score: 0 })),
    ]).then(([a, b]) => setScores({
      me:      typeof a?.score === "number" ? a.score : 0,
      partner: typeof b?.score === "number" ? b.score : 0,
    }));
  }, [duo?.me?.username, duo?.partner?.username]);

  if (!duo) return null;

  const combined = (scores.me ?? 0) + (scores.partner ?? 0);
  const scoresReady = scores.me !== null && scores.partner !== null;
  const { level, levelStart, levelNext } = duoLevelInfo(combined);
  const progressPct = scoresReady
    ? Math.min(100, Math.max(4, ((combined - levelStart) / (levelNext - levelStart)) * 100))
    : 4;

  const streakCur = duo.streak?.current ?? 0;

  const bondedDate = duo.startDate ? new Date(duo.startDate) : null;
  const daysBonded = duo.daysBonded ?? (
    bondedDate ? Math.max(0, Math.floor((Date.now() - bondedDate.getTime()) / 86400000)) : 0
  );

  const meName      = duo.me?.name || duo.me?.username || "You";
  const partnerName = duo.partner?.name || duo.partner?.username || "Partner";

  return (
    <div style={{
      background: CREAM, border: `2px solid ${BLACK}`, borderRadius: 20,
      padding: "18px 18px 16px", marginBottom: 20, fontFamily: "'Sora', sans-serif",
      animation: "duoCardIn .55s cubic-bezier(.16,1,.3,1) both",
    }}>
      <style>{KEYFRAMES}</style>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: BLACK, color: LIME, borderRadius: 999,
        padding: "4px 12px", fontSize: 10, fontWeight: 800, letterSpacing: ".08em",
        textTransform: "uppercase", marginBottom: 14,
      }}>
        <i className="fas fa-infinity" style={{ fontSize: 11 }}/> Dynamic Duo
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, animation: "duoAvatarsIn .4s .08s cubic-bezier(.34,1.56,.64,1) both" }}>
        <ProfileLink username={duo.me?.username}><Avatar person={duo.me} z={2} /></ProfileLink>
        <ProfileLink username={duo.partner?.username}><Avatar person={duo.partner} z={1} /></ProfileLink>
      </div>

      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 18, color: BLACK, letterSpacing: "-.02em", marginBottom: 12 }}>
        <ProfileLink username={duo.me?.username}>{meName}</ProfileLink>
        <span style={{ color: LIME, WebkitTextStroke: `1px ${BLACK}`, margin: "0 8px" }}>+</span>
        <ProfileLink username={duo.partner?.username}>{partnerName}</ProfileLink>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: BLACK, color: LIME, borderRadius: 999, padding: "6px 13px",
          fontSize: 12, fontWeight: 800,
        }}>
          <i className="fas fa-gem" style={{ fontSize: 10 }}/>
          Level {level}
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#fff", border: `2px solid ${BLACK}`, color: BLACK,
          borderRadius: 999, padding: "6px 13px", fontSize: 12, fontWeight: 800,
        }}>
          <i
            className="fas fa-fire"
            style={{
              fontSize: 12,
              color: streakCur > 0 ? "#ff5b1f" : "#c8c8bc",
              display: "inline-block",
              animation: streakCur > 0 ? "duoFlameBurn 1.3s ease-in-out infinite" : "none",
              transformOrigin: "bottom center",
            }}
          />
          {streakCur} day streak
        </span>
      </div>

      <div style={{ margin: "0 0 12px" }}>
        <div style={{
          height: 8, borderRadius: 999, background: "#e8e8de", overflow: "hidden",
          border: `1.5px solid ${BLACK}`,
        }}>
          <div style={{
            height: "100%", width: `${progressPct}%`, background: LIME,
            transition: "width .6s ease", animation: "duoBarFill .8s ease",
          }}/>
        </div>
      </div>

      {bondedDate && (
        <div style={{ textAlign: "center", fontSize: 11.5, color: "#5c5c50", fontWeight: 600, lineHeight: 1.5 }}>
          <i className="fas fa-calendar-heart" style={{ marginRight: 5, opacity: .8 }}/>
          Our bond on Linkitin — since {bondedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {" · "}{daysBonded} day{daysBonded === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}
