// components/DuoBadge.jsx
// Compact pill — same pattern as ItinScoreBadge, including the same
// outlined-pill rank language (matches the TeenStore BOYS/GIRLS pill
// style). Animates itself in the instant it actually mounts with data —
// no more late pop-in. DPs are clickable and jump straight to that
// partner's profile. Modal shows Level (animated count-up) plus the
// bonded-days sentence below it.
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

const BLACK = "#0a0a0a";
const CREAM = "#fafaf7";
const LIME  = "#d7ff3f";

const TIER_STYLE = {
  Bronze:   { border: "#cd7f32", text: "#cd7f32", bg: "#fff" },
  Silver:   { border: "#8b8f99", text: "#6c707a", bg: "#fff" },
  Gold:     { border: "#c99a10", text: "#8a6a0a", bg: "#fff" },
  Platinum: { border: BLACK,     text: LIME,      bg: BLACK  },
};

function duoTier(level) {
  if (level >= 8) return "Platinum";
  if (level >= 5) return "Gold";
  if (level >= 3) return "Silver";
  return "Bronze";
}

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

// Counts up from 0 to `target` with an ease-out curve while `active` is true.
function useCountUp(target, active, duration = 750) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [target, active, duration]);
  return val;
}

const KEYFRAMES = `
@keyframes duoBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes duoCardIn { from { opacity: 0; transform: scale(.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes duoAvatarsIn { from { opacity: 0; transform: scale(.7); } to { opacity: 1; transform: scale(1); } }
@keyframes duoNumIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes duoBadgeIn { from { opacity: 0; transform: translateY(8px) scale(.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
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

  const level      = duo?.level ?? 1;
  const daysBonded = duo?.daysBonded ?? 0;
  const animLevel  = useCountUp(level, open);

  if (!duo) return null;

  const tier  = duoTier(level);
  const style = TIER_STYLE[tier];
  const meName      = duo.me?.name || duo.me?.username || "You";
  const partnerName = duo.partner?.name || duo.partner?.username || "Partner";

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
          display: "inline-block", background: style.bg, color: style.text,
          border: `2px solid ${style.border}`, borderRadius: 999,
          padding: "3px 10px", fontSize: 9, fontWeight: 800,
          letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16,
        }}>
          Dynamic Duo · {tier}
        </div>

        {/* DPs — tap either one to jump straight to that profile */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, animation: "duoAvatarsIn .35s .05s cubic-bezier(.34,1.56,.64,1) both" }}>
          <ProfileLink username={duo.me?.username}><Avatar person={duo.me} z={2} /></ProfileLink>
          <ProfileLink username={duo.partner?.username}><Avatar person={duo.partner} z={1} /></ProfileLink>
        </div>

        <div style={{ animation: "duoNumIn .3s .1s both" }}>
          <div style={{ background: "#f3f3ea", borderRadius: 14, padding: "14px 6px", maxWidth: 140, margin: "0 auto" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: BLACK, lineHeight: 1 }}>{animLevel}</div>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: "#8a8a80", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>Level</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "#5c5c50", lineHeight: 1.55, marginTop: 16, fontWeight: 600, animation: "duoNumIn .3s .16s both" }}>
          <strong style={{ color: BLACK }}>{meName}</strong> and <strong style={{ color: BLACK }}>{partnerName}</strong> have had a Duo on Linkitin for the last {daysBonded} day{daysBonded === 1 ? "" : "s"}.
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
        aria-label={`Dynamic Duo — Level ${level}, ${tier} tier`}
        title={`Dynamic Duo — ${tier}`}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: style.bg, color: style.text, border: `2px solid ${style.border}`,
          borderRadius: 999, padding: "6px 13px", fontSize: 12, fontWeight: 800,
          fontFamily: "'Sora', sans-serif", cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          transition: "transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .2s",
          animation: "duoBadgeIn .4s cubic-bezier(.34,1.56,.64,1) both",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <i className="fas fa-infinity" style={{ fontSize: 10, opacity: .8 }}/>
        Lvl {level}
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
