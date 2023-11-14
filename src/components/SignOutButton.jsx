import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignOutButton = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); 

    const handleSignOut = () => {
      logout(); 
      navigate('/');
    };

    return (
      <button onClick={handleSignOut} className="signup-button">Sign Out</button>
    );
};

export default SignOutButton;
