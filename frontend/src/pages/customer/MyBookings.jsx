import { useEffect, useState } from "react";
import client from "../../api/client";
import StatusBadge from "../../components/StatusBadge";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [tracking, setTracking] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");

  const load = () => {
    client.get("/api/customer/bookings").then((res) => setBookings(res.data));
  };

  useEffect(load, []);

  const toggleTrack = async (id) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (!tracking[id]) {
      const res = await client.get(`/api/customer/bookings/${id}/track`);
      setTracking((t) => ({ ...t, [id]: res.data }));
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await client.put(`/api/customer/bookings/${id}/cancel`);
    load();
  };

  const submitReview = async (bookingId) => {
    await client.post("/api/customer/reviews", { bookingId, ...reviewForm });
    setReviewingId(null);
    setReviewForm({ rating: 5, comment: "" });
    setMessage("Thanks for your feedback!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <h2>My Bookings</h2>
      {message && <div className="alert alert-success">{message}</div>}

      {bookings.length === 0 && <p>You haven't booked any services yet.</p>}

      <div className="booking-list">
        {bookings.map((b) => (
          <div key={b.id} className="booking-item">
            <div className="booking-item-header">
              <div>
                <h4>{b.categoryName}</h4>
                <p className="muted">{b.providerBusinessName} · {b.providerPhone}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>

            <p>{b.description}</p>
            <p className="muted">📍 {b.address}</p>
            {b.latitude != null && b.longitude != null && <a className="map-preview" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`}>⌖ Open visit location in Google Maps ↗</a>}

            <div className="booking-item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => toggleTrack(b.id)}>
                {expanded === b.id ? "Hide tracking" : "Track order"}
              </button>
              {(b.status === "PENDING" || b.status === "ACCEPTED") && (
                <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(b.id)}>Cancel</button>
              )}
              {b.status === "COMPLETED" && reviewingId !== b.id && (
                <button className="btn btn-primary btn-sm" onClick={() => setReviewingId(b.id)}>Rate & Review</button>
              )}
            </div>

            {expanded === b.id && tracking[b.id] && (
              <div className="timeline">
                {tracking[b.id].map((t, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" />
                    <div>
                      <strong>{t.status.replace("_", " ")}</strong>
                      {t.note && <p className="muted">{t.note}</p>}
                      <p className="muted small">{new Date(t.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviewingId === b.id && (
              <div className="review-form">
                <label>Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                </select>
                <textarea
                  rows="2"
                  placeholder="How was the service?"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
                <div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setReviewingId(null)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={() => submitReview(b.id)}>Submit Review</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
