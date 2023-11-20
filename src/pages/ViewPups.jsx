import React, { useState, useEffect } from "react";
import DogCard from "../components/DogCard";
import EditDogModal from "../components/EditDogModal";

export default function ViewPups() {
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

  const handleEdit = (dogId, editedDogDetails) => {
    const editDog = async () => {
      try {
        const response = await fetch(`/dog/edit/${dogId}`, {
          method: 'PUT',
          body: JSON.stringify(editedDogDetails),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`)
        }
        // fetch dogs after successful edit
        fetchDogs();
      } catch (error) {
        console.error('Error updating dog data', error)
      }
    }
    editDog();
  };

  const handleDelete = (dogId) => {
    const deleteDogs = async () => {
      try {
        const response = await fetch(`/dog/delete/${dogId}`, {
          method: 'DELETE',
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        // fetch dogs after successful edit
        fetchDogs();
      } catch(error) {
        console.error('Error deleting dog:', error)
      }
    };
    deleteDogs();
  };

  const onEditClick = (dog) => {
    console.log("Editing dog:", dog);
    setEditingDog(dog);
    setShowEditModal(true);
  };
  
  return(
    <div>
      <h1>Puppy Portal</h1>
      <div className="dog-container">
        {dogs.map(dog => (
          <DogCard 
            key={dog.id} 
            dog={dog}
            onEdit={() => onEditClick(dog)}
            onDelete={handleDelete}
            />
        ))}
      </div>
      {showEditModal && (
        <EditDogModal 
          dog={editingDog}
          onClose={() => setShowEditModal(false)}
          onSave={handleEdit}
        />
      )}
    </div>
  )
}