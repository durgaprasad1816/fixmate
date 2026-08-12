import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ProviderStats() {
  const [stats, setStats] = useState(null); const [reviews, setReviews] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = async () => { setLoading(true); setError(""); try { const [statsRes,reviewsRes] = await Promise.all([client.get("/api/provider/stats"),client.get("/api/provider/reviews")]); setStats(statsRes.data); setReviews(reviewsRes.data || []); } catch (err) { setError(err.response?.data?.message || "Could not load your track record."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  if (loading) return <div className="empty-state"><strong>Loading track record…</strong></div>;
  if (error) return <div className="alert alert-error">{error} <button className="btn btn-ghost btn-sm" onClick={load}>Retry</button></div>;
  const rating = Number(stats?.avgRating || 0);
  return <div><div className="page-title-row"><div><span className="eyebrow">PERFORMANCE</span><h2>My Track Record</h2><p>Orders, completion performance and customer reviews.</p></div></div><div className="stats-grid"><div className="stat-card"><span className="stat-value">{stats?.totalOrders ?? 0}</span><span className="stat-label">Total Orders</span></div><div className="stat-card"><span className="stat-value">{stats?.completedOrders ?? 0}</span><span className="stat-label">Completed</span></div><div className="stat-card"><span className="stat-value">{stats?.pendingOrders ?? 0}</span><span className="stat-label">In Pipeline</span></div><div className="stat-card"><span className="stat-value">{rating.toFixed(1)} ★</span><span className="stat-label">{stats?.totalReviews ?? 0} Reviews</span></div></div><h3 className="section-title">Recent Reviews</h3>{reviews.length === 0 && <p>No reviews yet.</p>}<div className="review-list">{reviews.map((r) => <div key={r.id} className="review-item"><div className="review-item-header"><strong>{r.customerName}</strong><span>{"★".repeat(Number(r.rating || 0))}{"☆".repeat(Math.max(0,5-Number(r.rating || 0)))}</span></div>{r.comment && <p>{r.comment}</p>}<span className="muted small">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</span></div>)}</div></div>;
}
