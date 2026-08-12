import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ProviderProfile() {
  const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { client.get("/api/provider/profile").then((res) => setProfile(res.data)).catch((err) => setError(err.response?.data?.message || "Could not load your provider profile.")).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="empty-state"><strong>Loading your profile…</strong><p>Please wait while FixMate loads your provider account.</p></div>;
  if (error) return <div className="alert alert-error">{error}<button className="btn btn-ghost btn-sm" onClick={() => window.location.reload()}>Retry</button></div>;
  if (!profile) return <div className="empty-state"><strong>Provider profile not found</strong><p>Ask the FixMate administrator to verify that your provider account was created correctly.</p></div>;
  return <div><div className="page-title-row"><div><span className="eyebrow">BUSINESS PROFILE</span><h2>My Profile</h2><p>Your provider information visible to FixMate operations.</p></div></div><div className="profile-card">{[["Business Name",profile.businessName],["Owner",profile.fullName],["Category",profile.categoryName],["Phone",profile.phone],["Email",profile.email],["Experience",`${profile.experienceYears || 0} years`],["Address",profile.address || "—"],["Bio",profile.bio || "—"]].map(([label,value])=><div className="profile-row" key={label}><span className="muted">{label}</span><strong>{value}</strong></div>)}<div className="profile-row"><span className="muted">Verification Status</span><strong>{profile.blocked ? "🚫 Blocked by admin" : profile.verified ? "✅ Verified — visible to customers" : "⏳ Pending admin approval"}</strong></div></div>{!profile.verified && !profile.blocked && <div className="alert alert-info">Your account is awaiting admin approval. You won't receive bookings until an admin verifies your profile.</div>}</div>;
}
