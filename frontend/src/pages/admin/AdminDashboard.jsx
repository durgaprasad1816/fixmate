import { Routes, Route, NavLink } from "react-router-dom";
import AdminOverview from "./AdminOverview";
import AdminCategories from "./AdminCategories";
import AdminProviders from "./AdminProviders";
import AdminBookings from "./AdminBookings";
import AdminCustomers from "./AdminCustomers";

export default function AdminDashboard() {
  return <div className="dashboard dashboard-premium"><div className="dashboard-welcome admin-welcome"><div><span className="eyebrow">CONTROL CENTER</span><h1>FixMate administration.</h1><p>Approve providers, manage service categories and oversee every booking.</p></div><div className="dashboard-orb">◆</div></div><nav className="tabbar"><NavLink to="/admin" end className="tab">⌂ <span>Overview</span></NavLink><NavLink to="/admin/categories" className="tab">▦ <span>Services</span></NavLink><NavLink to="/admin/providers" className="tab">◉ <span>Providers</span></NavLink><NavLink to="/admin/bookings" className="tab">◷ <span>Bookings</span></NavLink><NavLink to="/admin/customers" className="tab">♙ <span>Customers</span></NavLink></nav><div className="dashboard-content"><Routes><Route index element={<AdminOverview />} /><Route path="categories" element={<AdminCategories />} /><Route path="providers" element={<AdminProviders />} /><Route path="bookings" element={<AdminBookings />} /><Route path="customers" element={<AdminCustomers />} /></Routes></div></div>;
}
