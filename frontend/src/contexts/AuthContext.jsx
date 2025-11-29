import { createContext, useContext, useEffect, useState } from "react";

// Authentication context
export const AuthContext = createContext();

// Provides authentication state and actions
export function AuthProvider({ children }) {
  // Controls initial loading state
  const [pageLoading, setPageLoading] = useState(true);

  // Stores authentication token
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Stores authenticated user data
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Loads persisted auth data on app start
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));

    setPageLoading(false);
  }, []);

  // Indicates whether the user is authenticated
  const isAuthenticated = !!token;

  // Saves token and user data on login
  const login = (tokenValue, userData = null) => {
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);

    if (userData) {
      const finalUser = { ...userData };
      setUser(finalUser);
      localStorage.setItem("user", JSON.stringify(finalUser));
    }
  };

  // Clears authentication data on logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
        pageLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access authentication context
export const useAuth = () => useContext(AuthContext);