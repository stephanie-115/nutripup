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
          <button onClick={() => navigate('/puppy-portal')}>Puppy Portal</button>
          <SignOutButton />
        </>
      ) : (
        <>
          <button onClick={() => navigate('/sign-in')}>Sign In</button>
          <button onClick={() => navigate('/sign-up')}>Sign Up</button>
        </>
      )}
    </nav>
  )
}
