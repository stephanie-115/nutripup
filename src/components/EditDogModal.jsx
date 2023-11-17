import React, { useState, useEffect } from "react";

export default function EditDogModal({ dog, onClose, onSave }) {
  const [editedDog, setEditedDog] = useState(dog);

  // Update state when the dog prop changes
  useEffect(() => {
    setEditedDog(dog);
  }, [dog]);

  const handleInputChange = (e) => {
    setEditedDog({ ...editedDog, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(dog.id, editedDog);
    onClose();
  };

  return (
    <div className="modal">
      <input
        name="dog_name"
        value={editedDog.dog_name}
        onChange={handleInputChange}
      />
      <input
        name="dog_breed"
        value={editedDog.dog_breed}
        onChange={handleInputChange}
      />
      <input
        name="ideal_weight"
        value={editedDog.ideal_weight}
        onChange={handleInputChange}
      />
      <input
        name="activity_level"
        value={editedDog.activity_level}
        onChange={handleInputChange}
      />
      <input
        name="neutered"
        value={editedDog.neutered}
        onChange={handleInputChange}
      />
       <input
        name="allergies"
        value={editedDog.allergies}
        onChange={handleInputChange}
      />

      <button onClick={handleSave}>Save Changes</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
