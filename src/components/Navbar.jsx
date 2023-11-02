import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, isAuthenticated } = useAuth();

  const pages = ['Home', 'About', 'Contact', 'Puppy Portal'];
  const settings = isAuthenticated ? ['Profile Settings', 'Sign Out'] : ['Sign In', 'Sign Up'];

}