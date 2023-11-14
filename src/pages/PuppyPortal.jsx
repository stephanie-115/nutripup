import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PuppyPortal() {
  const navigate = useNavigate();
    return (
      <>
        <button onClick={() => navigate('/puppy-portal/add')} className="signup-button">Add New Pup</button>
        <button onClick={() => navigate('/puppy-portal/view')} className="signup-button">View Your Pups</button>
      </>
    )
}