import { Routes, Route, NavLink } from "react-router-dom";
import ProviderBookings from "./ProviderBookings";
import ProviderStats from "./ProviderStats";
import ProviderProfile from "./ProviderProfile";
import ProviderNotifications from "./ProviderNotifications";

export default function ProviderDashboard() {
  return <div className="dashboard dashboard-premium"><div className="dashboard-welcome provider-welcome"><div><span className="eyebrow">PROVIDER SPACE</span><h1>Run your service business.</h1><p>Manage incoming jobs, visit customers with map-ready details and close completed work.</p></div><div className="dashboard-orb">◉</div></div><nav className="tabbar"><NavLink to="/provider" end className="tab">◷ <span>Bookings</span></NavLink><NavLink to="/provider/stats" className="tab">◒ <span>Track record</span></NavLink><NavLink to="/provider/profile" className="tab">◎ <span>Profile</span></NavLink><NavLink to="/provider/notifications" className="tab">♢ <span>Notifications</span></NavLink></nav><div className="dashboard-content"><Routes><Route index element={<ProviderBookings />} /><Route path="stats" element={<ProviderStats />} /><Route path="profile" element={<ProviderProfile />} /><Route path="notifications" element={<ProviderNotifications />} /></Routes></div></div>;
}
