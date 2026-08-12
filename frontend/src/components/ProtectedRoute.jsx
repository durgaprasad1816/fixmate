import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, loginPath = "/login", children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={loginPath} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={loginPath} replace />;
  return children;
}
