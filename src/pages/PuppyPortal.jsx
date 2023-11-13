import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PuppyPortal() {
  const navigate = useNavigate();
    return (
      <>
        <button onClick={() => navigate('/puppy-portal/add')}>Add New Pup</button>
        <button onClick={() => navigate('/puppy-portal/view')}>View Your Pups</button>
      </>
    )
}