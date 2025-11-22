import React, { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { getCurrentUser } from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Optionally fetch more user data from server:
          try {
            const fresh = await getCurrentUser();
            setUser(fresh);
          } catch (_) {
            setUser({ user_id: decoded.sub || decoded.user_id, username: decoded.sub || decoded.username, role: decoded.role });
          }
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    init();
  }, [token]);

  const login = (tkn) => {
    localStorage.setItem("token", tkn);
    setToken(tkn);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
