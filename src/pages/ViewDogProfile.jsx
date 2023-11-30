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
    <div className="parent-container">
      <div className="dog-card">
        <h2>{dog.dog_name}</h2>
        <p>
          <span className="dog-label">Breed: </span>{" "}
          <span className="dog-value">{dog.dog_breed}</span>
        </p>
        <p>
          <span className="dog-label">Ideal Weight: </span>{" "}
          <span className="dog-value">{dog.ideal_weight}</span>
        </p>
        <p>
          <span className="dog-label">Activity Level: </span>{" "}
          <span className="dog-value">{dog.activity_level}</span>
        </p>
        <p>
          <span className="dog-label">Fixed: </span>{" "}
          <span className="dog-value">{dog.neutered ? "Yes" : "No"}</span>
        </p>
        <p>
          <span className="dog-label">Allergies: </span>{" "}
          <span className="dog-value">{dog.allergies}</span>
        </p>
        <p>
          <span className="dog-label">Total Daily Recommended Calories: </span>{" "}
          <span className="dog-value">{dog.total_calories}</span>
        </p>
        <p>
          <span className="dog-label">Total Daily Protein: </span>{" "}
          <span className="dog-value">{dog.protein}</span>
        </p>
        <p>
          <span className="dog-label">Total Daily Fat: </span>{" "}
          <span className="dog-value">{dog.fat}</span>
        </p>
        <p>
          <span className="dog-label">Total Daily Carbs: </span>{" "}
          <span className="dog-value">{dog.carbs}</span>
        </p>
    <div className="dog-button-container">
        <button onClick={handleEditClick} className="edit-button">
          Edit
        </button>
        <button
          onClick={() => navigate(`/dog/view-recipes/${dogId}`)}
          className="edit-button"
        >
          View Recipes
        </button>
        </div>
        {showEditModal && (
          <EditDogModal
            dog={dog}
            onClose={() => setShowEditModal(false)}
            onSave={handleEdit}
          />
        )}
      </div>
    </div>
  );
}
