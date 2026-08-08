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

function Avatar({ person, z }) {
  const common = {
    width: 48, height: 48, borderRadius: "50%",
    border: `2px solid ${BLACK}`, marginRight: z === 2 ? -14 : 0, zIndex: z,
    flexShrink: 0,
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
`;

export default function DuoBadge({ duo }) {
  const [open,    setOpen]    = useState(false);
  const [mounted, setMounted] = useState(false);

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
  const daysBonded  = duo.daysBonded ?? 0;
  const daysToNext  = duo.daysToNextLevel ?? null;
  const streakCur   = duo.streak?.current ?? 0;
  const stats       = duo.combinedStats || {};
  const totalForLvl = daysBonded + (daysToNext || 0);
  const progressPct = daysToNext == null
    ? 100
    : Math.min(100, Math.max(6, (daysBonded / Math.max(1, totalForLvl)) * 100));

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
          display: "inline-block", background: BLACK, color: LIME, borderRadius: 999,
          padding: "3px 10px", fontSize: 9, fontWeight: 800, letterSpacing: ".08em",
          textTransform: "uppercase", marginBottom: 14,
        }}>
          Dynamic Duo
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <ProfileLink username={duo.me?.username}><Avatar person={duo.me} z={2} /></ProfileLink>
          <ProfileLink username={duo.partner?.username}><Avatar person={duo.partner} z={1} /></ProfileLink>
        </div>

        <div style={{
          textAlign: "center", fontWeight: 900, fontSize: 16, color: BLACK,
          letterSpacing: "-.02em",
        }}>
          <ProfileLink username={duo.me?.username}>@{duo.me?.username || "you"}</ProfileLink>
          {" & "}
          <ProfileLink username={duo.partner?.username}>@{duo.partner?.username || "partner"}</ProfileLink>
        </div>

        <div style={{ textAlign: "center", margin: "6px 0 2px" }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: BLACK, lineHeight: 1 }}>{level}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#8a8a80", marginLeft: 5 }}>/ 100</span>
        </div>

        {daysToNext != null ? (
          <div style={{ margin: "10px 0 14px" }}>
            <div style={{
              height: 8, borderRadius: 999, background: "#e8e8de", overflow: "hidden",
              border: `1.5px solid ${BLACK}`,
            }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: LIME, transition: "width .3s ease" }} />
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

        <div style={{ fontSize: 11, color: "#555", textAlign: "center", marginBottom: 14, fontWeight: 600 }}>
          Bonded {daysBonded} day{daysBonded === 1 ? "" : "s"} · 🔥 {streakCur} day streak
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
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
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: BLACK, color: LIME, border: "none", borderRadius: 999,
          padding: "7px 14px", fontSize: 11, fontWeight: 800,
          letterSpacing: ".05em", textTransform: "uppercase",
          cursor: "pointer", WebkitTapHighlightColor: "transparent",
          fontFamily: "'Sora', sans-serif", transition: "transform .12s",
        }}
        onTouchStart={(e) => { e.currentTarget.style.transform = "scale(.95)"; }}
        onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        <i className="fas fa-people-arrows" style={{ fontSize: 10 }} />
        Duo · Lvl {level}
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
