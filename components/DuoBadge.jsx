// components/DuoBadge.jsx
// Compact pill — same pattern as ItinScoreBadge: small trigger, tap opens a
// portal modal with a simple animated reveal. The two DPs are clickable and
// jump straight to that partner's profile. Below that: just Level and
// bonded days — nothing else.
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LIME  = "#d7ff3f";
const BLACK = "#0a0a0a";
const CREAM = "#fafaf7";

function Avatar({ person, z }) {
  const common = {
    width: 56, height: 56, borderRadius: "50%",
    border: `2.5px solid ${BLACK}`, marginRight: z === 2 ? -16 : 0, zIndex: z,
    flexShrink: 0, boxShadow: `0 0 0 3px ${CREAM}`, display: "block",
  };
  return person?.avatar
    ? <img src={person.avatar} alt="" style={{ ...common, objectFit: "cover" }} />
    : (
      <div style={{
        ...common, background: LIME, display: "flex",
        alignItems: "center", justifyContent: "center", fontWeight: 900, color: BLACK, fontSize: 18,
      }}>
        {person?.name?.[0]?.toUpperCase() || person?.username?.[0]?.toUpperCase() || "?"}
      </div>
    );
}

function ProfileLink({ username, children }) {
  if (!username) return <>{children}</>;
  return (
    <a
      href={`/${username}`}
      onClick={(e) => e.stopPropagation()}
      style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
      title={`Visit @${username}`}
    >
      {children}
    </a>
  );
}

const KEYFRAMES = `
@keyframes duoBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes duoCardIn { from { opacity: 0; transform: scale(.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes duoAvatarsIn { from { opacity: 0; transform: scale(.7); } to { opacity: 1; transform: scale(1); } }
@keyframes duoNumIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
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

  const level      = duo.level ?? 1;
  const daysBonded = duo.daysBonded ?? 0;

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
          width: "100%", maxWidth: 280, padding: "22px 20px", position: "relative",
          fontFamily: "'Sora', sans-serif", textAlign: "center",
          animation: "duoCardIn .22s cubic-bezier(.2,.9,.3,1.15) both",
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
          textTransform: "uppercase", marginBottom: 16,
        }}>
          Dynamic Duo
        </div>

        {/* DPs — tap either one to jump straight to that profile */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, animation: "duoAvatarsIn .35s .05s cubic-bezier(.34,1.56,.64,1) both" }}>
          <ProfileLink username={duo.me?.username}><Avatar person={duo.me} z={2} /></ProfileLink>
          <ProfileLink username={duo.partner?.username}><Avatar person={duo.partner} z={1} /></ProfileLink>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, animation: "duoNumIn .3s .1s both" }}>
          <div style={{ flex: 1, background: "#f3f3ea", borderRadius: 14, padding: "12px 6px" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: BLACK, lineHeight: 1 }}>{level}</div>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: "#8a8a80", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>Level</div>
          </div>
          <div style={{ flex: 1, background: "#f3f3ea", borderRadius: 14, padding: "12px 6px" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: BLACK, lineHeight: 1 }}>{daysBonded}</div>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: "#8a8a80", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>Day{daysBonded === 1 ? "" : "s"} bonded</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Dynamic Duo — Level ${level}`}
        title="Dynamic Duo"
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
        <i className="fas fa-infinity" style={{ fontSize: 10, opacity: .75 }}/>
        Lvl {level}
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
