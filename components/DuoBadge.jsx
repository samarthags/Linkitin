// components/DuoBadge.jsx
// Small clickable pill badge — click opens a modal with full Duo details.
// Theme: black + lime-green, bold uppercase, matching the TeenStore look.
//
// IMPORTANT: the modal is rendered via a React Portal straight into
// document.body. Without this, `position:fixed` on the modal can get
// silently trapped by any ancestor that has a CSS `transform` applied
// (even a completed slide-up animation ending at translateY(0) counts —
// that's a real, well-known CSS gotcha). Portal-ing it out avoids that
// entirely, so the modal always covers the true viewport no matter where
// <DuoBadge/> is mounted in the page.
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const LIME  = "#d7ff3f";
const BLACK = "#0a0a0a";
const CREAM = "#fafaf7";

function Avatar({ person, z, ring }) {
  const common = {
    width: 48, height: 48, borderRadius: "50%",
    border: `2px solid ${BLACK}`, marginRight: z === 2 ? -14 : 0, zIndex: z,
    flexShrink: 0, boxShadow: ring ? `0 0 0 3px ${CREAM}, 0 0 0 5px ${LIME}` : "none",
    transition: "box-shadow .3s ease",
  };
  return person?.avatar
    ? <img src={person.avatar} alt="" style={{ ...common, objectFit: "cover" }} />
    : (
      <div style={{
        ...common, background: LIME, display: "flex",
        alignItems: "center", justifyContent: "center", fontWeight: 900, color: BLACK, fontSize: 16,
      }}>
        {person?.name?.[0]?.toUpperCase() || person?.username?.[0]?.toUpperCase() || "?"}
      </div>
    );
}

function ProfileLink({ username, children, style }) {
  if (!username) return <span style={style}>{children}</span>;
  return (
    <a
      href={`/${username}`}
      onClick={(e) => e.stopPropagation()}
      style={{ textDecoration: "none", color: "inherit", cursor: "pointer", ...style }}
    >
      {children}
    </a>
  );
}

const KEYFRAMES = `
@keyframes duoBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes duoCardIn { from { opacity: 0; transform: scale(.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes duoAvatarsIn { from { opacity: 0; transform: scale(.7); } to { opacity: 1; transform: scale(1); } }
@keyframes duoFlame { 0%,100% { transform: scale(1); } 50% { transform: scale(1.18); } }
@keyframes duoLevelIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function DuoBadge({ duo }) {
  const [open,    setOpen]    = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shared,  setShared]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  if (!duo) return null;

  const level       = duo.level ?? 1;
  const maxLevel    = level >= 100;
  const daysBonded  = duo.daysBonded ?? 0;
  const daysToNext  = duo.daysToNextLevel ?? null;
  const streakCur   = duo.streak?.current ?? 0;
  const stats       = duo.combinedStats || {};
  const totalForLvl = daysBonded + (daysToNext || 0);
  const progressPct = daysToNext == null
    ? 100
    : Math.min(100, Math.max(6, (daysBonded / Math.max(1, totalForLvl)) * 100));

  const shareDuo = async (e) => {
    e.stopPropagation();
    const url  = typeof window !== "undefined" ? `${window.location.origin}/${duo.me?.username}` : "";
    const text = `Check out our Dynamic Duo — @${duo.me?.username} & @${duo.partner?.username}, Level ${level}!`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "Dynamic Duo", text, url }); return; } catch (_) { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (_) {}
  };

  const modal = (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.62)", zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, backdropFilter: "blur(4px)",
        animation: "duoBackdropIn .18s ease both",
      }}
    >
      <style>{KEYFRAMES}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: CREAM, borderRadius: 20, border: `2px solid ${BLACK}`,
          boxShadow: "0 20px 50px rgba(0,0,0,.35)",
          width: "100%", maxWidth: 300, padding: 20, position: "relative",
          fontFamily: "'Sora', sans-serif", maxHeight: "85vh", overflowY: "auto",
          animation: "duoCardIn .22s cubic-bezier(.2,.9,.3,1.15) both",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          style={{
            position: "absolute", top: 12, right: 12, width: 26, height: 26,
            borderRadius: "50%", background: BLACK, color: "#fff", border: "none",
            fontSize: 14, cursor: "pointer", lineHeight: 1,
          }}
        >×</button>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: BLACK, color: LIME, borderRadius: 999,
          padding: "3px 10px", fontSize: 9, fontWeight: 800, letterSpacing: ".08em",
          textTransform: "uppercase", marginBottom: 14,
        }}>
          Dynamic Duo
          {maxLevel && <i className="fas fa-crown" style={{ fontSize: 10 }}/>}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, animation: "duoAvatarsIn .35s .05s cubic-bezier(.34,1.56,.64,1) both" }}>
          <ProfileLink username={duo.me?.username}><Avatar person={duo.me} z={2} ring={maxLevel} /></ProfileLink>
          <ProfileLink username={duo.partner?.username}><Avatar person={duo.partner} z={1} ring={maxLevel} /></ProfileLink>
        </div>

        <div style={{
          textAlign: "center", fontWeight: 900, fontSize: 16, color: BLACK,
          letterSpacing: "-.02em",
        }}>
          <ProfileLink username={duo.me?.username}>@{duo.me?.username || "you"}</ProfileLink>
          {" & "}
          <ProfileLink username={duo.partner?.username}>@{duo.partner?.username || "partner"}</ProfileLink>
        </div>

        <div style={{ textAlign: "center", margin: "6px 0 2px", animation: "duoLevelIn .3s .1s both" }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: BLACK, lineHeight: 1 }}>{level}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#8a8a80", marginLeft: 5 }}>/ 100</span>
        </div>

        {daysToNext != null ? (
          <div style={{ margin: "10px 0 14px" }}>
            <div style={{
              height: 8, borderRadius: 999, background: "#e8e8de", overflow: "hidden",
              border: `1.5px solid ${BLACK}`,
            }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: LIME, transition: "width .5s ease" }} />
            </div>
            <div style={{ fontSize: 10, color: "#8a8a80", marginTop: 5, textAlign: "center", fontWeight: 700 }}>
              {daysToNext} day{daysToNext === 1 ? "" : "s"} to level {level + 1}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 11, color: LIME, background: BLACK, borderRadius: 8, padding: "5px 0", textAlign: "center", fontWeight: 800, margin: "10px 0 14px" }}>
            MAX LEVEL REACHED
          </div>
        )}

        <div style={{ fontSize: 11, color: "#555", textAlign: "center", marginBottom: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <span>Bonded {daysBonded} day{daysBonded === 1 ? "" : "s"}</span>
          <span>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
            <span style={{ display: "inline-block", animation: streakCur > 0 ? "duoFlame 1.1s ease-in-out infinite" : "none" }}>🔥</span>
            {streakCur} day streak
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 14 }}>
          {[
            ["Views",  stats.views  || 0],
            ["Clicks", stats.clicks || 0],
            ["Shares", stats.shares || 0],
          ].map(([label, val]) => (
            <div key={label} style={{
              border: `1.5px solid ${BLACK}`, borderRadius: 10, padding: "8px 4px", textAlign: "center",
            }}>
              <div style={{ fontWeight: 900, fontSize: 14, color: BLACK }}>{val}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: "#8a8a80", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={shareDuo}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: BLACK, color: LIME, border: "none", borderRadius: 12,
            padding: "11px 0", fontSize: 12.5, fontWeight: 800, letterSpacing: ".03em",
            textTransform: "uppercase", cursor: "pointer", fontFamily: "'Sora', sans-serif",
          }}
        >
          <i className={shared ? "fas fa-check" : "fas fa-share-nodes"}/>
          {shared ? "Copied!" : "Share Duo"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: BLACK, color: LIME, border: "none", borderRadius: 999,
          padding: "6px 13px 6px 11px", fontSize: 12, fontWeight: 800,
          letterSpacing: ".03em", textTransform: "uppercase",
          cursor: "pointer", WebkitTapHighlightColor: "transparent",
          fontFamily: "'Sora', sans-serif", transition: "transform .12s",
        }}
        onTouchStart={(e) => { e.currentTarget.style.transform = "scale(.95)"; }}
        onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        <i className="fas fa-people-arrows" style={{ fontSize: 10 }} />
        Duo · Lvl {level}
        {maxLevel && <i className="fas fa-crown" style={{ fontSize: 10 }}/>}
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
