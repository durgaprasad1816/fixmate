import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get("/api/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-value">{stats.totalCustomers}</span><span className="stat-label">Customers</span></div>
        <div className="stat-card"><span className="stat-value">{stats.totalProviders}</span><span className="stat-label">Providers</span></div>
        <div className="stat-card"><span className="stat-value">{stats.totalCategories}</span><span className="stat-label">Occupations</span></div>
        <div className="stat-card"><span className="stat-value">{stats.totalBookings}</span><span className="stat-label">Total Bookings</span></div>
        <div className="stat-card"><span className="stat-value">{stats.pendingBookings}</span><span className="stat-label">Pending</span></div>
        <div className="stat-card"><span className="stat-value">{stats.completedBookings}</span><span className="stat-label">Completed</span></div>
        <div className="stat-card"><span className="stat-value">{stats.cancelledBookings}</span><span className="stat-label">Cancelled</span></div>
      </div>

      <h3 className="section-title">Bookings by Occupation</h3>
      <div className="bar-list">
        {Object.entries(stats.bookingsByCategory).map(([name, count]) => (
          <div key={name} className="bar-row">
            <span className="bar-label">{name}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${stats.totalBookings ? (count / stats.totalBookings) * 100 : 0}%` }}
              />
            </div>
            <span className="bar-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
