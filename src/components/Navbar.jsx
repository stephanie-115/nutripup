import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SignOutButton from './SignOutButton';

export default function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSignOutClick = () => {
    logout();
    //navigate to the home page after logging out
    navigate('/'); 
  }

  return (
    <nav className='nav-bar'>
      {isAuthenticated ? (
        <>
          <button onClick={() => navigate('/')} className='navbar-button'>Home</button>
          <button onClick={() => navigate('/puppy-portal')} className="navbar-button">Puppy Portal</button>
          <SignOutButton />
        </>
      ) : (
        <>
          <button onClick={() => navigate('/')} className='navbar-button'>Home</button>
          <button onClick={() => navigate('/sign-in')} className="navbar-button">Sign In</button>
          <button onClick={() => navigate('/sign-up')} className="navbar-button">Sign Up</button>
        </>
      )}
    </nav>
  )
}
