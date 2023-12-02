import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children, signOut }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Fetch auth status from the server
    fetch("http://localhost:8080/api/auth/check", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          // If user is authenticated, update user state
          setUser(data.user);
        }
        // Set loading to false regardless of auth status
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error checking auth status", error);
        setLoading(false);
      });
  }, []);
  //user login:
  const login = (userData) => {
    //set user data when user successfully logs in
    setUser(userData);
  };
  //user logout:
  const logout = () => {
    setUser(null);
    setShouldRedirect(true);
  };
  if (shouldRedirect) {
    //reset state
    setShouldRedirect(false);
    return <Navigate to="/" />;
  }
  // Render the context provider with the value prop containing user, isAuthenticated, and sign out
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {/* Only render children if not loading to prevent seeing unauthorized content */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
