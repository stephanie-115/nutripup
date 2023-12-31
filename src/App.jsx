import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import PuppyPortal from "./pages/PuppyPortal";
import AddPup from "./pages/AddNewPup";
import ViewAllPups from "./pages/ViewAllPups";
import ViewDogProfile from "./pages/ViewDogProfile";
import ViewRecipes from "./pages/ViewRecipes";
import { SignUp } from "./pages/SignUp";
import SignIn from "./pages/SignIn";

export default function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <NavBar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/puppy-portal" element={<PuppyPortal />} />
              <Route path="/puppy-portal/add" element={<AddPup />} />
              <Route path="/puppy-portal/view" element={<ViewAllPups />} />
              <Route
                path="/dog/view-profile/:dogId"
                element={<ViewDogProfile />}
              />
              <Route path="dog/view-recipes/:dogId" element={<ViewRecipes />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}
//<Route path="/dogs/:dogId" element={<CreateDogProfile />} />
