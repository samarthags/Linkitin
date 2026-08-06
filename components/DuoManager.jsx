// components/DuoManager.jsx — NO-AUTH TEST VERSION
// Pass the CURRENT user's username as a prop (from your dashboard's
// `saved.username` — same value you already have on the localStorage-based
// dashboard). No session lookups.
import { useState, useEffect, useCallback } from "react";
import DuoCard from "./DuoCard";

const AC = "#6C63FF";

export default function DuoManager({ username }) {
  const [status,  setStatus]  = useState("loading"); // loading|none|pending_sent|pending_received|active
  const [data,    setData]    = useState(null);
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [sending, setSending] = useState(false);
  const [msg,     setMsg]     = useState("");

  const load = useCallback(async () => {
    if (!username) { setStatus("none"); return; }
    try {
      const r = await fetch(`/api/duo/status?username=${username}`);
      const d = await r.json();
      setStatus(d.status);
      setData(d);
    } catch (_) { setStatus("none"); }
  }, [username]);

  useEffect(() => { load(); }, [load]);

  const search = (q) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    fetch(`/api/duo/search?q=${encodeURIComponent(q)}&exclude=${username}`)
      .then(r => r.json()).then(d => setResults(d.results || []))
      .catch(() => setResults([]));
  };

  const invite = async (toUsername) => {
    setSending(true); setMsg("");
    try {
      const r = await fetch("/api/duo/invite", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUsername: username, toUsername }),
      });
      const d = await r.json();
      if (!r.ok) { setMsg(d.error || "Failed to send invite"); return; }
      setQuery(""); setResults([]);
      await load();
    } finally { setSending(false); }
  };

  const respond = async (action) => {
    const r = await fetch("/api/duo/respond", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, action }),
    });
    if (r.ok) load();
  };

  const remove = async () => {
    if (!confirm("End this duo? This can't be undone.")) return;
    await fetch("/api/duo/remove", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    load();
  };

  if (status === "loading") return null;

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "#f0edff", color: AC,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
        }}>
          <i className="fas fa-user-group"/>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Dynamic Duo</div>
      </div>

      {status === "active" && data?.duo && (
        <>
          <DuoCard duo={{ ...data.duo, me: null, partner: data.partner }} />
          <button className="btn btn-d" style={{ width: "100%" }} onClick={remove}>
            <i className="fas fa-heart-crack"/> End Duo
          </button>
        </>
      )}

      {status === "pending_sent" && (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <i className="fas fa-hourglass-half" style={{ fontSize: 22, color: "#f59e0b", marginBottom: 8, display: "block" }}/>
          <div style={{ fontSize: 14, color: "#374151", marginBottom: 12 }}>
            Waiting for <strong>@{data?.partner?.username}</strong> to accept
          </div>
          <button className="btn btn-s" onClick={remove}>Cancel Invite</button>
        </div>
      )}

      {status === "pending_received" && (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ fontSize: 14, color: "#374151", marginBottom: 14 }}>
            <strong>@{data?.partner?.username}</strong> wants to be your Duo
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-s" style={{ flex: 1 }} onClick={() => respond("decline")}>Decline</button>
            <button className="btn btn-g" style={{ flex: 1 }} onClick={() => respond("accept")}>Accept</button>
          </div>
        </div>
      )}

      {status === "none" && (
        <div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
            Pair up with a friend to show combined stats and level up together.
          </p>
          <input className="inp" placeholder="Search username..." value={query}
            onChange={e => search(e.target.value)} style={{ marginBottom: 8 }} />
          {results.map(u => (
            <div key={u.username} className="lr" style={{ marginBottom: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "#ede9ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: AC, flexShrink: 0,
              }}>
                {u.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>@{u.username}</div>
              <button className="btn btn-p" style={{ padding: "6px 12px", fontSize: 12 }}
                disabled={sending} onClick={() => invite(u.username)}>
                Invite
              </button>
            </div>
          ))}
          {msg && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>{msg}</div>}
        </div>
      )}
    </div>
  );
}
