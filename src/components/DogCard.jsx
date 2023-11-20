import React from "react";

export default function DogCard({ dog, onEdit, onDelete }) {
  const handleEditClick = () => {
    console.log("Edit clicked for dog:", dog);
    onEdit();
  };
  return(
    <div className="dog-card">
      <h3>{dog.dog_name}</h3>
      <p>Breed: {dog.dog_breed}</p>
      <p>Ideal Weight: {dog.ideal_weight}</p>
      <p>Activity Level: {dog.activity_level}</p>
      <p>Fixed: {dog.neutered}</p>
      <p>Allergies: {dog.allergies}</p>
      <p>Total Daily Recommended Calories: {dog.total_calories}</p>
      <p>Total Daily Protein: {dog.protein}</p>
      <p>Total Daily Fat: {dog.fat}</p>
      <p>Total Daily Carbs: {dog.carbs}</p>

      <button onClick={handleEditClick} className="edit-button">Edit</button>
      <button onClick={() => onDelete(dog.id)} className="delete-button">Delete</button>
    </div>
  )
}