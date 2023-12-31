import React, { useContext, useEffect, useState } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Sign In Successful</h2>
        <p>Welcome! You will now be redirected to the homepage.</p>
        <button onClick={onClose} className="modal-button">
          Close
        </button>
      </div>
    </div>
  );
};

function SignUp() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    //check if passwords match
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    //reset error and loading states
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/user/sign-up", {
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
      //if there is an error, set the error state with error message
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container">
      {showSuccessModal ? (
        // Render only the success modal when it is open
        <SuccessModal isOpen={showSuccessModal} onClose={closeAndRedirect} />
      ) : (
        <>
          <h1>Sign Up Here</h1>
          {error && <p className="error">{error}</p>}
          {isSuccess && <p>Signup successful!</p>}
          <form onSubmit={handleSubmit} className="form-container">
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="input"
              value={userData.name}
              onChange={handleChange}
            />
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
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="input"
              value={userData.confirmPassword}
              onChange={(e) =>
                setUserData({ ...userData, confirmPassword: e.target.value })
              }
            />
            <button
              type="submit"
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join the Pack"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export { SuccessModal, SignUp };
