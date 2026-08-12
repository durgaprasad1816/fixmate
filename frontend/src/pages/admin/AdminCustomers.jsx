import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); setError(""); try { const res = await client.get("/api/admin/customers"); setCustomers(Array.isArray(res.data) ? res.data : []); } catch (err) { setError(err.response?.status === 403 ? "Your admin session is not authorized. Please log in again." : err.response?.data?.message || "Could not load customers."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const toggleActive = async (id) => { try { await client.put(`/api/admin/customers/${id}/toggle-active`); await load(); } catch (err) { setError(err.response?.data?.message || "Could not update customer."); } };
  return <div><div className="page-title-row"><div><span className="eyebrow">CUSTOMER DIRECTORY</span><h2>Customers</h2><p className="muted">View and manage registered FixMate customers.</p></div><button className="btn btn-ghost" onClick={load}>↻ Refresh</button></div>{error && <div className="alert alert-error">{error}</div>}
    <div className="table">{loading ? <div className="empty-state">Loading customers…</div> : <><div className="table-row table-head"><span>Name</span><span>Email</span><span>Phone</span><span>Status</span><span>Action</span></div>{customers.map(c => <div key={c.id} className="table-row"><span><strong>{c.fullName}</strong></span><span className="muted breakable">{c.email}</span><span className="muted">{c.phone}</span><span><span className={`badge ${c.active ? "badge-completed" : "badge-cancelled"}`}>{c.active ? "Active" : "Deactivated"}</span></span><span><button className="btn btn-ghost btn-sm" onClick={() => toggleActive(c.id)}>{c.active ? "Deactivate" : "Reactivate"}</button></span></div>)}{customers.length === 0 && <div className="empty-state">No customers have registered yet.</div>}</>}</div>
  </div>;
}
