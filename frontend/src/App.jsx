import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import RegisterCustomer from "./pages/auth/RegisterCustomer";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, message: "" }; }
  static getDerivedStateFromError(error) { return { hasError: true, message: error?.message || "Unexpected application error." }; }
  render() {
    if (this.state.hasError) return <div className="app-error"><img className="auth-brand-logo" src="/fixmate-logo.png" alt="FixMate" /><h2>FixMate could not load this page</h2><p>{this.state.message}</p><button className="btn btn-primary" onClick={() => window.location.reload()}>Reload page</button></div>;
    return this.props.children;
  }
}

export default function App() {
  return <BrowserRouter><AuthProvider><Navbar /><main className="app-main"><AppErrorBoundary><Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
    <Route path="/login/customer" element={<Login />} />
    <Route path="/login/provider" element={<Login />} />
    <Route path="/login/admin" element={<Login />} />
    <Route path="/register/customer" element={<RegisterCustomer />} />
    <Route path="/register/provider" element={<About />} />
    <Route path="/customer/*" element={<ProtectedRoute allowedRoles={["CUSTOMER"]} loginPath="/login"><CustomerDashboard /></ProtectedRoute>} />
    <Route path="/provider/*" element={<ProtectedRoute allowedRoles={["PROVIDER"]} loginPath="/login"><ProviderDashboard /></ProtectedRoute>} />
    <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["ADMIN"]} loginPath="/login"><AdminDashboard /></ProtectedRoute>} />
  </Routes></AppErrorBoundary></main></AuthProvider></BrowserRouter>;
}
