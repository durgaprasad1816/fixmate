import { useEffect, useState } from "react";
import client from "../../api/client";

export default function BrowseServices() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [form, setForm] = useState({ description: "", address: "", latitude: "", longitude: "", scheduledDate: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => { client.get("/api/public/categories").then((res) => setCategories(res.data)); }, []);

  const openCategory = async (category) => {
    setSelectedCategory(category); setSelectedProvider(null); setMessage(""); setError("");
    try { const res = await client.get(`/api/public/categories/${category.id}/providers`); setProviders(res.data); }
    catch (err) { setError(err.response?.data?.message || "Could not load providers."); }
  };

  const useLocation = () => {
    if (!navigator.geolocation) { setError("Location is not supported by this browser."); return; }
    setLocating(true); setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setForm((f) => ({ ...f, latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) })); setLocating(false); },
      () => { setLocating(false); setError("We could not access your location. Please allow location permission and try again."); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submitBooking = async (e) => {
    e.preventDefault(); setError("");
    if (!form.latitude || !form.longitude) { setError("Map location is mandatory. Tap 'Use my current location' before confirming."); return; }
    setLoading(true);
    try {
      await client.post("/api/customer/bookings", { providerId: selectedProvider.id, categoryId: selectedCategory.id, description: form.description, address: form.address, latitude: Number(form.latitude), longitude: Number(form.longitude), scheduledDate: form.scheduledDate ? new Date(form.scheduledDate).toISOString() : null });
      setMessage(`Booking request sent to ${selectedProvider.businessName}. Watch Notifications for the provider's response.`);
      setSelectedProvider(null); setForm({ description: "", address: "", latitude: "", longitude: "", scheduledDate: "" });
    } catch (err) { setError(err.response?.data?.message || "Could not create booking."); }
    finally { setLoading(false); }
  };

  return <div className="service-browser">
    <div className="page-title-row"><div><span className="eyebrow">VERIFIED NETWORK</span><h2>Choose a service</h2><p>Only admin-approved providers appear here.</p></div></div>
    {message && <div className="alert alert-success">✓ {message}</div>}{error && !selectedProvider && <div className="alert alert-error">{error}</div>}
    {!selectedCategory && <div className="card-grid premium-grid">{categories.map((cat) => <button key={cat.id} className="service-card premium-service-card" onClick={() => openCategory(cat)}><div className="service-card-icon">{cat.name.toLowerCase().includes("ac") ? "❄" : cat.name.toLowerCase().includes("electric") ? "⚡" : cat.name.toLowerCase().includes("plumb") ? "⌁" : "⌂"}</div><h3>{cat.name}</h3><p>{cat.description || "Professional home service from a verified FixMate provider."}</p><span>View providers →</span></button>)}{categories.length === 0 && <p>No services are available yet.</p>}</div>}
    {selectedCategory && !selectedProvider && <div><button className="btn btn-ghost" onClick={() => setSelectedCategory(null)}>← Back to services</button><div className="page-title-row compact"><div><span className="eyebrow">{selectedCategory.name}</span><h2>Choose your provider</h2></div></div><div className="card-grid premium-grid">{providers.map((p) => <article key={p.id} className="provider-card premium-provider-card"><div className="provider-avatar">{p.businessName?.charAt(0) || "F"}</div><div className="provider-main"><span className="verified-pill">✓ Verified</span><h3>{p.businessName}</h3><p className="muted">{p.fullName} · {p.experienceYears} years experience</p><p>★ {Number(p.avgRating || 0).toFixed(1)} <span className="muted">({p.totalReviews} reviews) · {p.completedOrders} jobs</span></p><p className="muted">⌖ {p.address || "Local service provider"}</p></div><button className="btn btn-primary" onClick={() => { setSelectedProvider(p); setError(""); }}>Book this provider</button></article>)}{providers.length === 0 && <div className="empty-state"><strong>No verified provider yet</strong><p>This service will appear as soon as FixMate approves a provider for it.</p></div>}</div></div>}

    {selectedProvider && <div className="modal-overlay" onClick={() => setSelectedProvider(null)}><form className="modal-card booking-modal" onSubmit={submitBooking} onClick={(e) => e.stopPropagation()}><div className="modal-top"><div><span className="eyebrow">CONFIRM VISIT</span><h2>{selectedProvider.businessName}</h2><p>{selectedProvider.fullName} · {selectedProvider.phone}</p></div><button type="button" className="icon-close" onClick={() => setSelectedProvider(null)}>×</button></div>{error && <div className="alert alert-error">{error}</div>}<div className="mandatory-note">Your address and map location are mandatory so the provider can reach your home.</div><label>What needs fixing?</label><textarea rows="3" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell the provider what is wrong…" /><label>Full service address *</label><textarea rows="2" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House / flat, street, area, city, PIN" /><div className="location-box"><div><strong>📍 Map location *</strong><p>{form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : "No location selected"}</p></div><button type="button" className="btn btn-ghost btn-sm" onClick={useLocation} disabled={locating}>{locating ? "Locating…" : "Use my current location"}</button></div>{form.latitude && form.longitude && <a className="map-preview" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${form.latitude},${form.longitude}`}>Open selected location in Google Maps ↗</a>}<label>Preferred date &amp; time *</label><input type="datetime-local" required value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} /><div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setSelectedProvider(null)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Confirming…" : "Confirm booking"}</button></div></form></div>}
  </div>;
}
