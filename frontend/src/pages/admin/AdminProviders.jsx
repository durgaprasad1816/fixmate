import { useEffect, useState } from "react";
import client from "../../api/client";

const emptyForm = { fullName: "", email: "", phone: "", password: "", businessName: "", categoryId: "", bio: "", experienceYears: 0, address: "" };

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try { const res = await client.get("/api/admin/providers"); setProviders(res.data); }
    catch (err) { setError(err.response?.data?.message || "Could not load providers."); }
  };
  useEffect(() => { load(); client.get("/api/admin/categories").then((res) => setCategories(res.data)).catch(() => {}); }, []);

  const setVerification = async (id, verified, blocked) => {
    setError("");
    try { await client.put(`/api/admin/providers/${id}/verify`, { verified, blocked }); await load(); }
    catch (err) { setError(err.response?.data?.message || "Could not update provider status."); }
  };

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); setError(""); };
  const openEdit = (p) => { setEditingId(p.id); setForm({ fullName: p.fullName || "", email: p.email || "", phone: p.phone || "", password: "", businessName: p.businessName || "", categoryId: p.categoryId || "", bio: p.bio || "", experienceYears: p.experienceYears || 0, address: p.address || "" }); setShowForm(true); setError(""); };

  const saveProvider = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const payload = { ...form, categoryId: Number(form.categoryId), experienceYears: Number(form.experienceYears) };
      if (!editingId) { await client.post("/api/admin/providers", payload); }
      else { if (!payload.password) delete payload.password; await client.put(`/api/admin/providers/${editingId}`, payload); }
      setForm(emptyForm); setShowForm(false); setEditingId(null); await load();
    } catch (err) { setError(err.response?.data?.message || `Could not ${editingId ? "update" : "create"} provider.`); }
    finally { setLoading(false); }
  };

  const deleteProvider = async (p) => {
    const confirmed = window.confirm(`Permanently delete ${p.businessName || p.fullName}?\n\nThis will permanently remove the provider account, profile, notifications, reviews, bookings and booking history. This cannot be undone.`);
    if (!confirmed) return;
    setError("");
    try { await client.delete(`/api/admin/providers/${p.id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || "Could not permanently delete provider."); }
  };

  const visible = providers.filter((p) => filter === "ALL" ? true : filter === "PENDING" ? !p.verified && !p.blocked : filter === "VERIFIED" ? p.verified && !p.blocked : p.blocked);

  return <div>
    <div className="page-title-row"><div><span className="eyebrow">BUSINESS NETWORK</span><h2>Manage providers</h2><p>Admin controls provider onboarding, verification, editing and permanent deletion.</p></div><button className="btn btn-primary" onClick={openCreate}>＋ Add provider</button></div>
    {error && <div className="alert alert-error">{error}</div>}
    {showForm && <form className="admin-create-card" onSubmit={saveProvider}>
      <div className="form-card-heading"><div><span className="eyebrow">{editingId ? "PROVIDER EDIT" : "ADMIN ONBOARDING"}</span><h3>{editingId ? "Edit provider account" : "Create provider account"}</h3><p>{editingId ? "Update provider details. Leave password empty to keep the current password." : "After creation, approve the provider before customers can see them."}</p></div></div>
      <div className="form-grid">
        <div><label>Full name</label><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
        <div><label>Business name</label><input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></div>
        <div><label>Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label>Phone</label><input required pattern="[0-9]{10}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label>{editingId ? "New password (optional)" : "Provider login password"}</label><input type="password" minLength="6" required={!editingId} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <div><label>Service category</label><select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}><option value="">Select category</option>{categories.filter((c) => c.active).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label>Experience (years)</label><input type="number" min="0" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} /></div>
        <div><label>Business address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div className="full-field"><label>Bio</label><textarea rows="3" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
      </div>
      <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button><button className="btn btn-primary" disabled={loading}>{loading ? "Saving…" : editingId ? "Update provider" : "Create provider"}</button></div>
    </form>}
    <div className="filter-row">{["ALL","PENDING","VERIFIED","BLOCKED"].map((f) => <button key={f} className={`chip ${filter === f ? "chip-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
    <div className="card-grid premium-grid">{visible.map((p) => <article key={p.id} className="provider-card premium-provider-card admin-provider-card"><div className="provider-avatar">{p.businessName?.charAt(0) || "F"}</div><div className="provider-main"><h3>{p.businessName}</h3><p className="muted">{p.fullName} · {p.categoryName}</p><p className="muted">{p.phone} · {p.email}</p><p>★ {Number(p.avgRating || 0).toFixed(1)} · {p.totalOrders} orders · {p.completedOrders} completed</p><p>{p.blocked ? <span className="badge badge-cancelled">Blocked</span> : p.verified ? <span className="badge badge-completed">Verified</span> : <span className="badge badge-pending">Pending approval</span>}</p><p className="muted">⌖ {p.address || "Address not provided"}</p></div><div className="booking-item-actions"><button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✎ Edit</button>{!p.verified && !p.blocked && <button className="btn btn-primary btn-sm" onClick={() => setVerification(p.id, true, false)}>Approve</button>}{p.verified && !p.blocked && <button className="btn btn-ghost btn-sm" onClick={() => setVerification(p.id, false, false)}>Unverify</button>}{!p.blocked ? <button className="btn btn-danger btn-sm" onClick={() => setVerification(p.id, false, true)}>Block</button> : <button className="btn btn-primary btn-sm" onClick={() => setVerification(p.id, true, false)}>Unblock &amp; verify</button>}<button className="btn btn-danger btn-sm" onClick={() => deleteProvider(p)}>🗑 Delete permanently</button></div></article>)}{visible.length === 0 && <div className="empty-state"><strong>No providers in this view</strong><p>Create a provider after the business onboarding conversation.</p></div>}</div>
  </div>;
}
