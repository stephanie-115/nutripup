import React from "react";
import { Link } from "react-router-dom";

export default function IntroDogCard({ dog, onDelete }) {
  return (
    <div className="intro-dog-card">
      <h3>{dog.dog_name}</h3>
      <p>{dog.dog_breed}</p>
      <div className="intro-button-container">
      <Link to={`/dog/view-profile/${dog.id}`} className="view-profile-button">View Full Profile</Link>
      <button onClick={() => onDelete(dog.id)} className="delete-button">Delete</button>
      </div>
    </div>
  );
}
