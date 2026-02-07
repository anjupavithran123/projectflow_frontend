// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      setCurrentUser({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role, // 🔥 ADMIN COMES FROM JWT
      });
    } catch (err) {
      console.error("Invalid token");
      logout();
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
