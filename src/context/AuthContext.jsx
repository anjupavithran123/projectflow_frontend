// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,   // ✅ Add name
          role: decoded.role,   // optional if needed
        });
      } catch (err) {
        console.error("Invalid token");
        logout();
      }
    } else {
      setCurrentUser(null);
    }
  }, [token]);
  
  const login = (token, user) => {
    // 1️⃣ Save token
    localStorage.setItem("token", token);
  
    // 2️⃣ Save full user object
    localStorage.setItem("user", JSON.stringify(user));
  
    // 3️⃣ Update state
    setToken(token);
    setCurrentUser(user);
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
