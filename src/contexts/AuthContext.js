import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] =  useState(true);

  useEffect(() => {
    //fetch auth status from server
    fetch("http://localhost:3000/api/auth/check", { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        //if user is authenticated, update user state
        if (data.isAuthenticated) setUser(data.user);

        //set loading to false regardless of auth status
        setLoading(false);
      })
      .catch(error => {
        console.error('Error checking auth status', error);
        setLoading(false);
      });
  }, []);
  // render the context provider with the value prop containing user and isAuthenticated state
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      {/* Only render children if not loading-- to prevent flash of unauthorized content*/}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)
}