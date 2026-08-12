import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ProviderNotifications() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = async () => { try { const res = await client.get("/api/provider/notifications"); setItems(res.data || []); setError(""); } catch (err) { setError(err.response?.data?.message || "Could not load notifications."); } finally { setLoading(false); } };
  useEffect(() => { load(); const id = setInterval(load, 15000); return () => clearInterval(id); }, []);
  const markRead = async (id) => { try { await client.put(`/api/provider/notifications/${id}/read`); await load(); } catch (err) { setError(err.response?.data?.message || "Could not update notification."); } };
  if (loading) return <div className="empty-state"><strong>Loading notifications…</strong></div>;
  return <div><div className="page-title-row"><div><span className="eyebrow">PROVIDER ALERTS</span><h2>Notifications</h2><p>New jobs, account verification and booking changes.</p></div></div>{error && <div className="alert alert-error">{error} <button className="btn btn-ghost btn-sm" onClick={load}>Retry</button></div>}{items.length === 0 && !error && <div className="empty-state"><strong>No notifications yet</strong><p>New customer requests will appear here.</p></div>}<div className="notification-list">{items.map((n) => <article key={n.id} className={`notification-item premium-notification ${n.read ? "" : "unread"}`} onClick={() => !n.read && markRead(n.id)}><div className="notification-icon">♢</div><div className="notification-copy"><div className="notification-head"><strong>{n.title}</strong>{!n.read && <span className="new-pill">NEW</span>}</div><p>{n.message}</p><span className="muted small">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</span></div></article>)}</div></div>;
}
