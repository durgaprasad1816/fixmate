import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

const roleLinks = {
  CUSTOMER: [["/customer", "⌂", "Home"], ["/customer", "▦", "Services"], ["/customer/bookings", "◷", "Bookings"], ["/customer/notifications", "♢", "Notifications"]],
  PROVIDER: [["/provider", "⌂", "Bookings"], ["/provider/stats", "◒", "Track record"], ["/provider/notifications", "♢", "Notifications"]],
  ADMIN: [["/admin", "⌂", "Overview"], ["/admin/categories", "▦", "Services"], ["/admin/providers", "◉", "Providers"], ["/admin/bookings", "◷", "Bookings"], ["/admin/customers", "♙", "Customers"]],
};

function ProfileEditor({ profile, user, onClose, onSaved }) {
  const [mode, setMode] = useState("profile");
  const [form, setForm] = useState({ fullName: profile?.fullName || user?.fullName || "", email: profile?.email || user?.email || "", phone: profile?.phone || user?.phone || "" });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [busy, setBusy] = useState(false);
  const saveProfile = async () => {
    setError(""); setSuccess(""); setBusy(true);
    try { const res = await client.put("/api/account/profile", form); onSaved(res.data); setSuccess("Profile updated successfully."); }
    catch (err) { setError(err.response?.data?.message || "Could not update profile."); } finally { setBusy(false); }
  };
  const changePassword = async () => {
    setError(""); setSuccess(""); setBusy(true);
    try { await client.put("/api/account/password", pw); setPw({ currentPassword: "", newPassword: "" }); setSuccess("Password changed successfully."); }
    catch (err) { setError(err.response?.data?.message || "Could not change password."); } finally { setBusy(false); }
  };
  return <div className="profile-editor-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="profile-editor-card">
      <div className="profile-editor-head"><div><span className="eyebrow">ACCOUNT</span><h2>Edit profile</h2></div><button className="icon-close" onClick={onClose}>×</button></div>
      <div className="profile-editor-tabs"><button className={mode === "profile" ? "active" : ""} onClick={() => { setMode("profile"); setError(""); setSuccess(""); }}>Profile details</button><button className={mode === "password" ? "active" : ""} onClick={() => { setMode("password"); setError(""); setSuccess(""); }}>Change password</button></div>
      {error && <div className="alert alert-error">{error}</div>}{success && <div className="alert alert-success">{success}</div>}
      {mode === "profile" ? <>
        <label>Full Name</label><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label>Mobile Number</label><input inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} />
        {user?.role === "PROVIDER" && <div className="account-readonly"><strong>Provider business details</strong><span>Business name: {profile?.businessName || "—"}</span><span>Category: {profile?.categoryName || "—"}</span><small>Business profile and verification are managed by FixMate administration.</small></div>}
        <div className="modal-actions"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={busy} onClick={saveProfile}>{busy ? "Saving…" : "Save changes"}</button></div>
      </> : <>
        <label>Current Password</label><input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        <label>New Password</label><input type="password" minLength={6} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
        <div className="modal-actions"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={busy || !pw.currentPassword || pw.newPassword.length < 6} onClick={changePassword}>{busy ? "Changing…" : "Change password"}</button></div>
      </>}
    </div>
  </div>;
}

function ProfileCard({ user, profile, loading, error, onLogout, onEdit }) {
  const isProvider = user?.role === "PROVIDER"; const displayName = profile?.fullName || user?.fullName || "FixMate User"; const email = profile?.email || user?.email || "—"; const phone = profile?.phone || user?.phone || "—";
  return <div className="profile-popover" role="dialog" aria-label="Profile details">
    <div className="profile-popover-head"><img src="/profile-avatar.png" className="profile-avatar-large" alt="Profile" /><div className="profile-popover-title"><strong>{displayName}</strong><span>{user?.role === "ADMIN" ? "Administrator" : isProvider ? "Service Provider" : "Customer"}</span></div></div>
    {loading ? <div className="profile-loading">Loading profile details…</div> : error ? <div className="profile-inline-error">{error}</div> : <div className="profile-details">
      {isProvider ? <><div className="profile-detail full"><span>Business Name</span><strong>{profile?.businessName || "—"}</strong></div><div className="profile-detail"><span>Owner</span><strong>{displayName}</strong></div><div className="profile-detail"><span>Category</span><strong>{profile?.categoryName || "—"}</strong></div><div className="profile-detail"><span>Phone</span><strong>{phone}</strong></div><div className="profile-detail full"><span>Email</span><strong className="breakable">{email}</strong></div><div className="profile-detail"><span>Experience</span><strong>{profile ? `${profile.experienceYears || 0} years` : "—"}</strong></div><div className="profile-detail full"><span>Address</span><strong>{profile?.address || "—"}</strong></div><div className="profile-detail full"><span>Bio</span><strong>{profile?.bio || "—"}</strong></div><div className="profile-status">{profile?.blocked ? "🚫 Blocked by admin" : profile?.verified ? "✅ Verified — visible to customers" : "⏳ Pending admin approval"}</div></> : <><div className="profile-detail full"><span>Name</span><strong>{displayName}</strong></div><div className="profile-detail"><span>Role</span><strong>{user?.role}</strong></div><div className="profile-detail"><span>Phone</span><strong>{phone}</strong></div><div className="profile-detail full"><span>Email</span><strong className="breakable">{email}</strong></div><div className="profile-status">{user?.active === false ? "🚫 Account inactive" : "✅ Account active"}</div></>}
    </div>}
    <button className="btn btn-primary profile-edit-button" onClick={onEdit}>✎ Edit profile</button><button className="profile-logout" onClick={onLogout}>⇥ Logout</button>
  </div>;
}

export default function Navbar() {
  const { user, logout, updateUser } = useAuth(); const [open, setOpen] = useState(false); const [profileOpen, setProfileOpen] = useState(false); const [editorOpen, setEditorOpen] = useState(false); const [profile, setProfile] = useState(null); const [profileLoading, setProfileLoading] = useState(false); const [profileError, setProfileError] = useState(""); const profileRef = useRef(null); const navigate = useNavigate(); const links = user ? roleLinks[user.role] || [] : [];
  const close = () => setOpen(false); const handleLogout = () => { logout(); setProfileOpen(false); close(); navigate("/login/customer"); };
  const loadProfile = async () => { setProfileLoading(true); setProfileError(""); try { const res = await client.get("/api/account/profile"); setProfile(res.data); } catch (err) { setProfileError(err.response?.data?.message || "Could not load profile."); } finally { setProfileLoading(false); } };
  useEffect(() => { const onPointerDown = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); }; document.addEventListener("mousedown", onPointerDown); return () => document.removeEventListener("mousedown", onPointerDown); }, []);
  useEffect(() => { if (profileOpen && user) loadProfile(); }, [profileOpen, user?.userId]);
  const handleSaved = (data) => { setProfile(data); updateUser({ fullName: data.fullName, email: data.email, phone: data.phone }); };
  return <header className="navbar"><div className="navbar-inner"><Link to={user ? links[0]?.[0] || "/" : "/"} className="navbar-brand" onClick={close}><img className="navbar-logo" src="/fixmate-logo.png" alt="FixMate" /></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">{!user ? <><NavLink to="/" end>Home</NavLink><NavLink to="/about">About</NavLink><Link className="nav-login" to="/login/customer">Customer login</Link><Link className="nav-cta" to="/register/customer">Register</Link></> : <>{links.map(([to, icon, label]) => <NavLink key={to + label} to={to} end={to === `/${user.role.toLowerCase()}`}>{icon} {label}</NavLink>)}<div className="profile-menu" ref={profileRef}><button className={`profile-trigger ${profileOpen ? "profile-trigger-open" : ""}`} onClick={() => setProfileOpen((v) => !v)}><img src="/profile-avatar.png" alt="Profile" /><span className="profile-trigger-name">{user.fullName || "Profile"}</span><span className="profile-chevron">⌄</span></button>{profileOpen && <ProfileCard user={user} profile={profile} loading={profileLoading} error={profileError} onLogout={handleLogout} onEdit={() => setEditorOpen(true)} />}</div></>}</nav>
    <button className="mobile-menu-button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}><span></span><span></span><span></span></button></div>
    {open && <div className="mobile-nav">{!user ? <><NavLink onClick={close} to="/">⌂ Home</NavLink><NavLink onClick={close} to="/about">ⓘ About</NavLink><NavLink onClick={close} to="/login/customer">⇥ Customer login</NavLink><NavLink onClick={close} to="/register/customer">＋ Register</NavLink></> : <>{links.map(([to, icon, label]) => <NavLink onClick={close} key={to + label} to={to}>{icon} {label}</NavLink>)}<button className="mobile-profile-summary" onClick={() => { setProfileOpen((v) => !v); if (!profileOpen) loadProfile(); }}><img src="/profile-avatar.png" alt="Profile" /><div><strong>{user.fullName || "Profile"}</strong><span>{user.role}</span></div><span className="profile-chevron">⌄</span></button>{profileOpen && <ProfileCard user={user} profile={profile} loading={profileLoading} error={profileError} onLogout={handleLogout} onEdit={() => setEditorOpen(true)} />}<button onClick={handleLogout}>⇥ Logout</button></>}</div>}
    {editorOpen && <ProfileEditor profile={profile} user={user} onClose={() => setEditorOpen(false)} onSaved={handleSaved} />}
  </header>;
}
