import { createContext, useContext, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fixmate_user");
    try { return stored ? JSON.parse(stored) : null; } catch { return null; }
  });

  const persist = (data) => {
    localStorage.setItem("fixmate_token", data.token);
    const userInfo = { userId: data.userId, fullName: data.fullName, email: data.email, phone: data.phone || "", role: data.role };
    localStorage.setItem("fixmate_user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const login = async (email, password) => { const res = await client.post("/api/auth/login", { email, password }); persist(res.data); return res.data; };
  const registerCustomer = async (payload) => { const res = await client.post("/api/auth/register/customer", payload); persist(res.data); return res.data; };
  const updateUser = (patch) => { setUser((current) => { const next = { ...current, ...patch }; localStorage.setItem("fixmate_user", JSON.stringify(next)); return next; }); };
  const logout = () => { localStorage.removeItem("fixmate_token"); localStorage.removeItem("fixmate_user"); setUser(null); };

  return <AuthContext.Provider value={{ user, login, registerCustomer, updateUser, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
