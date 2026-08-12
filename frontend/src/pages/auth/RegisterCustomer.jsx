import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterCustomer() {
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (field) => (e) => setForm((current) => ({ ...current, [field]: field === "phone" ? e.target.value.replace(/\D/g, "") : e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await registerCustomer(form); navigate("/customer"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed."); }
    finally { setLoading(false); }
  };
  return <div className="auth-page"><form className="auth-card" onSubmit={handleSubmit}>
    <img className="auth-brand-logo" src="/fixmate-logo.png" alt="FixMate" />
    <h1>Create your account</h1><p className="auth-subtitle">Book trusted local services in a few taps</p>
    {error && <div className="alert alert-error">{error}</div>}
    <label>Full Name</label><input required value={form.fullName} onChange={update("fullName")} placeholder="Jane Doe" />
    <label>Email</label><input type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" />
    <label>Phone Number</label><input required inputMode="numeric" maxLength={10} value={form.phone} onChange={update("phone")} placeholder="9876543210" />
    <label>Password</label><input type="password" required minLength={6} value={form.password} onChange={update("password")} placeholder="••••••••" />
    <button className="btn btn-primary btn-large" type="submit" disabled={loading}>{loading ? "Creating account..." : "Sign Up"}</button>
    <div className="auth-links"><span>Already have an account? <Link to="/login/customer">Log in</Link></span></div>
  </form></div>;
}
