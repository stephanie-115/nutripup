import React, { useEffect, useState, useContext } from "react";
import { SuccessModal } from "./SignUp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

export default function SignIn() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  //close modal and redirect user
  const closeAndRedirect = () => {
    navigate("/");
    setShowSuccessModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  //set a timeout to redirect
  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        navigate("/");
        setShowSuccessModal(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //reset error and loading states
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/user/sign-in", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      //check if http response isn't successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      login(data);
      setIsSuccess(true);
      setShowSuccessModal(true);
    } catch (error) {
      //if there's an error, set error state with error message
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container">
      {showSuccessModal ? (
        //render only the success modal when it's open
        <SuccessModal isOpen={showSuccessModal} onClose={closeAndRedirect} />
      ) : (
        <>
          <h1>Sign In Here</h1>
          {error && <p className="error">{error}</p>}
          {isSuccess && <p>Sign In successful!</p>}
          <form onSubmit={handleSubmit} className="form-container">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input"
              value={userData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input"
              value={userData.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Rejoin the Pack"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
