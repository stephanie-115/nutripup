import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/Navbar";
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import PuppyPortal from './pages/PuppyPortal';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/puppyportal" element={<PuppyPortal />}  />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
