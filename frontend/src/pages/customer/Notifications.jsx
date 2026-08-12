import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const load = () => client.get("/api/customer/notifications").then((res) => setItems(res.data));
  useEffect(() => { load(); const id = setInterval(load, 15000); return () => clearInterval(id); }, []);
  const markRead = async (id) => { await client.put(`/api/customer/notifications/${id}/read`); load(); };
  return <div><div className="page-title-row"><div><span className="eyebrow">LIVE UPDATES</span><h2>Notifications</h2><p>Booking requests, provider decisions and completion updates.</p></div></div>{items.length === 0 && <div className="empty-state"><strong>You're all caught up</strong><p>New booking updates will appear here.</p></div>}<div className="notification-list">{items.map((n) => { const completed = /completed/i.test(`${n.title} ${n.message}`); return <article key={n.id} className={`notification-item premium-notification ${n.read ? "" : "unread"}`} onClick={() => !n.read && markRead(n.id)}><div className="notification-icon">{completed ? "✓" : "♢"}</div><div className="notification-copy"><div className="notification-head"><strong>{n.title}</strong>{!n.read && <span className="new-pill">NEW</span>}</div><p>{n.message}</p><span className="muted small">{new Date(n.createdAt).toLocaleString()}</span>{completed && <Link className="btn btn-primary btn-sm notification-action" to="/customer/bookings">Rate your completed service →</Link>}</div></article>; })}</div></div>;
}
