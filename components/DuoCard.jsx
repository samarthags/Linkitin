// components/DuoCard.jsx
// Renders on the PUBLIC profile page ([username].js). Pass the object
// returned by GET /api/duo?username=xxx as `duo`.

export default function DuoCard({ duo }) {
  if (!duo) return null;

  const days = Math.max(0, Math.floor((Date.now() - new Date(duo.startDate).getTime()) / 86400000));

  const Avatar = ({ person, z }) => person?.avatar ? (
    <img src={person.avatar} alt="" style={{
      width: 52, height: 52, borderRadius: "50%", objectFit: "cover",
      border: "2px solid #a78bfa", marginRight: z === 2 ? -14 : 0, zIndex: z,
    }}/>
  ) : (
    <div style={{
      width: 52, height: 52, borderRadius: "50%", background: "#2a2a3a",
      border: "2px solid #a78bfa", marginRight: z === 2 ? -14 : 0, zIndex: z,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700,
    }}>{person?.name?.[0]?.toUpperCase() || "?"}</div>
  );

  return (
    <div style={{
      background: "linear-gradient(135deg,#1a1a2e,#16162a)",
      border: "1px solid rgba(168,139,250,.35)",
      borderRadius: 18, padding: "18px 16px", marginBottom: 20, textAlign: "center",
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
        color: "rgba(168,139,250,.75)", marginBottom: 10,
      }}>
        <i className="fas fa-link" style={{ marginRight: 5 }}/>Dynamic Duo
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <Avatar person={duo.me} z={2} />
        <Avatar person={duo.partner} z={1} />
      </div>

      <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>
        @{duo.me?.username} &amp; @{duo.partner?.username}
      </div>
      <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, margin: "4px 0" }}>
        Level {duo.level || 1} Duo
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 12 }}>
        Bonded {days} day{days === 1 ? "" : "s"} · 🔥 {duo.streak?.current || 0} day streak
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {[
          ["Views",  duo.combinedStats?.views  || 0],
          ["Clicks", duo.combinedStats?.clicks || 0],
          ["Shares", duo.combinedStats?.shares || 0],
        ].map(([label, val]) => (
          <div key={label} style={{ background: "rgba(255,255,255,.05)", borderRadius: 10, padding: "8px 4px" }}>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>{val}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.35)", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
