import React, { useState, useEffect } from "react";
import IntroDogCard from "../components/IntroDogCard";
import EditDogModal from "../components/EditDogModal";

export default function ViewAllPups() {
  const [dogs, setDogs] = useState([]);
  const [editingDog, setEditingDog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); 

  const fetchDogs = async () => {
    try {
      const response = await fetch('/user/all-dogs', {
        method: 'GET',
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const data = await response.json();
      setDogs(data.dogs);
    } catch(error) {
      console.error('Error fetching dog data:', error);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const handleDelete = async (dogId) => {
    try {
      const response = await fetch(`/dog/delete/${dogId}`, {
        method: 'DELETE',
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      // Refresh the dogs list after deletion
      fetchDogs();
    } catch(error) {
      console.error('Error deleting dog:', error);
    }
  };

  return(
    <div>
      <h1>Puppy Portal</h1>
      <div className="dogs-intro-container">
        {dogs.map(dog => (
          <IntroDogCard 
            key={dog.id} 
            dog={dog}
            onDelete={handleDelete}
            />
        ))}
      </div>
    </div>
  )
}