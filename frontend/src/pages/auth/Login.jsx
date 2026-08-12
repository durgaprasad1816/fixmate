import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.role === "ADMIN") navigate("/admin", { replace: true });
      else if (data.role === "PROVIDER") navigate("/provider", { replace: true });
      else if (data.role === "CUSTOMER") navigate("/customer", { replace: true });
      else throw new Error("Your account does not have a valid FixMate role.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="auth-page premium-auth">
    <div className="auth-side">
      <span className="eyebrow">WELCOME TO FIXMATE</span>
      <h1>Everything you need, <span>one FixMate away.</span></h1>
      <p>Sign in with your FixMate account. We'll automatically take you to the right dashboard.</p>
      <div className="auth-side-points">
        <span>✓ Verified professionals</span>
        <span>✓ Live booking notifications</span>
        <span>✓ Secure role-based access</span>
      </div>
    </div>

    <form className="auth-card" onSubmit={handleSubmit}>
      <img className="auth-brand-logo" src="/fixmate-logo.png" alt="FixMate" />
      <h2>Welcome back</h2>
      <p className="auth-subtitle">Sign in to your FixMate account.</p>
      {error && <div className="alert alert-error">{error}</div>}

      <label>Email</label>
      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />

      <label>Password</label>
      <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />

      <button className="btn btn-primary btn-large" type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <div className="auth-links">
        <span>New customer? <Link to="/register/customer">Create an account</Link></span>
      </div>
    </form>
  </div>;
}
