import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import EditDogModal from "../components/EditDogModal";

export default function ViewDogProfile() {
  const navigate = useNavigate();
  const { dogId } = useParams();
  const [dog, setDog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await fetch(`/dog/view-profile/${dogId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDog(data.dog);
      } catch (error) {
        console.error("Error fetching dog data:", error);
      }
    };
    fetchDog();
  }, [dogId]);

  if (!dog) {
    return <p>Loading...</p>;
  }

  const handleEdit = (dogId, editedDogDetails) => {
    const editDog = async () => {
      try {
        const response = await fetch(`/dog/edit/${dogId}`, {
          method: "PUT",
          body: JSON.stringify(editedDogDetails),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        // Update the local state with the edited details
        setDog(editedDogDetails);
      } catch (error) {
        console.error("Error updating dog data", error);
      }
    };
    editDog();
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // const handleRecipesFetched = (fetchedRecipes) => {
  //   setRecipes(fetchedRecipes);
  // };
  return (
    <div className="dog-card">
      <h3>{dog.dog_name}</h3>
      <p>Breed: {dog.dog_breed}</p>
      <p>Ideal Weight: {dog.ideal_weight}</p>
      <p>Activity Level: {dog.activity_level}</p>
      <p>Fixed: {dog.neutered ? 'Yes' : 'No'}</p>
      <p>Allergies: {dog.allergies}</p>
      <p>Total Daily Recommended Calories: {dog.total_calories}</p>
      <p>Total Daily Protein: {dog.protein}</p>
      <p>Total Daily Fat: {dog.fat}</p>
      <p>Total Daily Carbs: {dog.carbs}</p>

      <button onClick={handleEditClick} className="edit-button">
        Edit
      </button>
     <button onClick={() => navigate(`/dog/view-recipes/${dogId}`)}className="edit-button">View Recipes</button>
      {showEditModal && (
        <EditDogModal
          dog={dog}
          onClose={() => setShowEditModal(false)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}
