import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";

export default function RegisterProvider() {
  const { registerProvider } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    categoryId: "",
    bio: "",
    experienceYears: 0,
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    client.get("/api/public/categories").then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setForm((f) => ({ ...f, categoryId: res.data[0].id }));
      }
    });
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerProvider({ ...form, categoryId: Number(form.categoryId), experienceYears: Number(form.experienceYears) });
      navigate("/provider");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card auth-card-wide" onSubmit={handleSubmit}>
        <h1>Join FixMate as a Provider</h1>
        <p className="auth-subtitle">
          List your services and start receiving bookings. Your account needs to be verified
          by an admin before it goes live — you'll get a notification once approved.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-grid">
          <div>
            <label>Full Name</label>
            <input required value={form.fullName} onChange={update("fullName")} placeholder="Vinay Kumar" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" />
          </div>
          <div>
            <label>Phone Number</label>
            <input required value={form.phone} onChange={update("phone")} placeholder="9876543210" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" required value={form.password} onChange={update("password")} placeholder="••••••••" />
          </div>
          <div>
            <label>Business Name</label>
            <input required value={form.businessName} onChange={update("businessName")} placeholder="Vinay AC Services" />
          </div>
          <div>
            <label>Type of Work</label>
            <select required value={form.categoryId} onChange={update("categoryId")}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Experience (years)</label>
            <input type="number" min="0" value={form.experienceYears} onChange={update("experienceYears")} />
          </div>
          <div>
            <label>Service Address / Area</label>
            <input value={form.address} onChange={update("address")} placeholder="Hyderabad, Telangana" />
          </div>
        </div>

        <label>Short Bio (optional)</label>
        <textarea rows="3" value={form.bio} onChange={update("bio")} placeholder="Tell customers about your experience..." />

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register as Provider"}
        </button>

        <div className="auth-links">
          <span>Already registered? <Link to="/login">Log in</Link></span>
        </div>
      </form>
    </div>
  );
}
