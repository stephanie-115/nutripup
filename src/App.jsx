import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import PuppyPortal from './pages/PuppyPortal';
import AddPup from './components/AddNewPup';
import ViewPups from './components/ViewPups';
import { SignUp } from './pages/SignUp';
import SignIn from "./pages/SignIn";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/puppy-portal" element={<PuppyPortal />} />
          <Route path="/puppy-portal/add" element={<AddPup />} />
          <Route path="/puppy-portal/view" element={<ViewPups />} />
          <Route path="/sign-up" element={<SignUp />}/>
          <Route path="/sign-in" element={<SignIn />}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
