// components/DuoBadge.jsx
// Small clickable pill badge — click opens a modal with full Duo details.
// Theme: black + lime-green, bold uppercase, matching the TeenStore look.
// Defensive by design: every field is optional-chained / defaulted so a
// partially-loaded `duo` object never throws instead of just rendering "0".
import { useState, useEffect } from "react";

const LIME  = "#d7ff3f";
const BLACK = "#0a0a0a";
const CREAM = "#fafaf7";

function Avatar({ person, z }) {
  const common = {
    width: 56, height: 56, borderRadius: "50%",
    border: `2.5px solid ${BLACK}`, marginRight: z === 2 ? -16 : 0, zIndex: z,
    flexShrink: 0,
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

export default function DuoBadge({ duo }) {
  const [open, setOpen] = useState(false);

  // Close on Escape, and stop the page from scrolling behind the modal.
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

  const level          = duo.level ?? 1;
  const daysBonded      = duo.daysBonded ?? 0;
  const daysToNext      = duo.daysToNextLevel ?? null;
  const streakCurrent    = duo.streak?.current ?? 0;
  const stats           = duo.combinedStats || {};
  const totalForLevel    = daysBonded + (daysToNext || 0);
  const progressPct     = daysToNext == null
    ? 100
    : Math.min(100, Math.max(6, (daysBonded / Math.max(1, totalForLevel)) * 100));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: BLACK, color: LIME, border: "none", borderRadius: 999,
          padding: "8px 16px", fontSize: 12, fontWeight: 800,
          letterSpacing: ".05em", textTransform: "uppercase",
          cursor: "pointer", WebkitTapHighlightColor: "transparent",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        <i className="fas fa-people-arrows" style={{ fontSize: 11 }} />
        Duo · Lvl {level}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.62)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: CREAM, borderRadius: 24, border: `2.5px solid ${BLACK}`,
              width: "100%", maxWidth: 360, padding: 26, position: "relative",
              fontFamily: "'Sora', sans-serif", maxHeight: "88vh", overflowY: "auto",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute", top: 14, right: 14, width: 30, height: 30,
                borderRadius: "50%", background: BLACK, color: "#fff", border: "none",
                fontSize: 15, cursor: "pointer", lineHeight: 1,
              }}
            >×</button>

            <div style={{
              display: "inline-block", background: BLACK, color: LIME, borderRadius: 999,
              padding: "4px 12px", fontSize: 10, fontWeight: 800, letterSpacing: ".08em",
              textTransform: "uppercase", marginBottom: 18,
            }}>
              Dynamic Duo
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <Avatar person={duo.me} z={2} />
              <Avatar person={duo.partner} z={1} />
            </div>

            <div style={{
              textAlign: "center", fontWeight: 900, fontSize: 19, color: BLACK,
              letterSpacing: "-.02em",
            }}>
              @{duo.me?.username || "you"} &amp; @{duo.partner?.username || "partner"}
            </div>

            <div style={{ textAlign: "center", margin: "8px 0 4px" }}>
              <span style={{ fontSize: 46, fontWeight: 900, color: BLACK, lineHeight: 1 }}>{level}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#8a8a80", marginLeft: 6 }}>/ 100</span>
            </div>

            {daysToNext != null ? (
              <div style={{ margin: "12px 0 18px" }}>
                <div style={{
                  height: 10, borderRadius: 999, background: "#e8e8de", overflow: "hidden",
                  border: `1.5px solid ${BLACK}`,
                }}>
                  <div style={{ height: "100%", width: `${progressPct}%`, background: LIME }} />
                </div>
                <div style={{ fontSize: 11, color: "#8a8a80", marginTop: 6, textAlign: "center", fontWeight: 700 }}>
                  {daysToNext} day{daysToNext === 1 ? "" : "s"} to level {level + 1}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: LIME, background: BLACK, borderRadius: 8, padding: "6px 0", textAlign: "center", fontWeight: 800, margin: "12px 0 18px" }}>
                MAX LEVEL REACHED
              </div>
            )}

            <div style={{ fontSize: 12, color: "#555", textAlign: "center", marginBottom: 18, fontWeight: 600 }}>
              Bonded {daysBonded} day{daysBonded === 1 ? "" : "s"} · 🔥 {streakCurrent} day streak
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                ["Views",  stats.views  || 0],
                ["Clicks", stats.clicks || 0],
                ["Shares", stats.shares || 0],
              ].map(([label, val]) => (
                <div key={label} style={{
                  border: `1.5px solid ${BLACK}`, borderRadius: 12, padding: "10px 4px", textAlign: "center",
                }}>
                  <div style={{ fontWeight: 900, fontSize: 16, color: BLACK }}>{val}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#8a8a80", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
