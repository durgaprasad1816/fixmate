import { Routes, Route, NavLink } from "react-router-dom";
import BrowseServices from "./BrowseServices";
import MyBookings from "./MyBookings";
import Notifications from "./Notifications";

export default function CustomerDashboard() {
  return <div className="dashboard dashboard-premium"><div className="dashboard-welcome"><div><span className="eyebrow">CUSTOMER SPACE</span><h1>Your home, looked after.</h1><p>Book verified professionals and stay updated from request to completion.</p></div><div className="dashboard-orb">+</div></div><nav className="tabbar"><NavLink to="/customer" end className="tab">▦ <span>Services</span></NavLink><NavLink to="/customer/bookings" className="tab">◷ <span>My bookings</span></NavLink><NavLink to="/customer/notifications" className="tab">♢ <span>Notifications</span></NavLink></nav><div className="dashboard-content"><Routes><Route index element={<BrowseServices />} /><Route path="bookings" element={<MyBookings />} /><Route path="notifications" element={<Notifications />} /></Routes></div></div>;
}
