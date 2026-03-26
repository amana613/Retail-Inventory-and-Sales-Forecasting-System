import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      setAuthToken(null);
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    setUser(response.data);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    setUser(response.data);
    return response.data;
  };

  const updateProfile = async (payload) => {
    const response = await api.put("/auth/me", payload);
    setUser(response.data);
    return response.data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const response = await api.patch("/auth/change-password", {
      currentPassword,
      newPassword
    });
    return response.data;
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      updateProfile,
      changePassword,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
