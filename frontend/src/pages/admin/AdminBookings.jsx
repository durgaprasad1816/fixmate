import { useEffect, useState } from "react";
import client from "../../api/client";
import StatusBadge from "../../components/StatusBadge";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    client.get("/api/admin/bookings").then((res) => setBookings(res.data));
  }, []);

  const visible = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <h2>All Bookings (Track Record)</h2>

      <div className="filter-row">
        {["ALL", "PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REJECTED"].map((s) => (
          <button key={s} className={`chip ${filter === s ? "chip-active" : ""}`} onClick={() => setFilter(s)}>
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="table">
        <div className="table-row table-head">
          <span>#</span>
          <span>Occupation</span>
          <span>Customer</span>
          <span>Provider</span>
          <span>Status</span>
          <span>Created</span>
        </div>
        {visible.map((b) => (
          <div key={b.id} className="table-row">
            <span>{b.id}</span>
            <span>{b.categoryName}</span>
            <span>{b.customerName}</span>
            <span>{b.providerBusinessName}</span>
            <span><StatusBadge status={b.status} /></span>
            <span className="muted small">{new Date(b.createdAt).toLocaleString()}</span>
          </div>
        ))}
        {visible.length === 0 && <p style={{ padding: "1rem" }}>No bookings here.</p>}
      </div>
    </div>
  );
}
