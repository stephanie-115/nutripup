import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateDogProfile() {
  const [dogName, setDogName] = useState("");
  const [selectedNum, setSelectedNum] = useState(0);
  const [yesNoChoice, setYesNoChoice] = useState(null);
  const [activityLevel, setActivityLevel] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [allergies, setAllergies] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [newDogId, setNewDogId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDogName, setModalDogName] = useState("");

  const handleDogNameChange = (e) => {
    setDogName(e.target.value);
  };

  const handleNumChange = (e) => {
    setSelectedNum(e.target.value);
  };

  const handleYesNoChange = (e) => {
    setYesNoChoice(e.target.value === "Yes");
  };

  const handleActivityLevelChange = (e) => {
    setActivityLevel(e.target.value);
  };

  const handleDogBreedChange = (e) => {
    setDogBreed(e.target.value);
  };

  const handleAllergyChange = (e) => {
    setAllergies(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dogName || !selectedNum || !activityLevel || !dogBreed) {
      console.error("Please fill in all fields");
      return;
    }
    const dogDetails = {
      dogName,
      ideal_weight: parseInt(selectedNum, 10),
      neutered: yesNoChoice,
      activityLevel,
      dogBreed,
      allergies,
    };
    console.log("dogDetails:", dogDetails);
    try {
      const response = await fetch("/dog/add", {
        method: "POST",
        body: JSON.stringify(dogDetails),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      //check if http response isn't successful
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData && responseData.newDog) {
        setModalDogName(dogName);
        setNewDogId(responseData.newDog.id);
        setShowSuccess(true);
        setDogName("");
        setSelectedNum(0);
        setYesNoChoice("");
        setActivityLevel("");
        setDogBreed("");
        setAllergies("");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error in AddNewPup / handleSubmit", error);
    }
  };
  const navigate = useNavigate();

  const viewProfile = (dogId) => {
    navigate(`/dog/view-profile/${dogId}`);
  };
  //modal logic
  function SuccessModal({ isOpen, onClose, dogName, viewProfile }) {
    if (!isOpen) return null;

    return (
      <div className="modal-backdrop">
        <div className="modal">
          <p>Success! {dogName}'s profile has been added.</p>
          <button onClick={() => viewProfile()} className="modal-button">
            View Profile
          </button>
          <button onClick={() => onClose()} className="modal-button">
            Add Another Dog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form className="form-style" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="nameInput">What is your pup's name? </label>
          <input
            id="nameInput"
            className="input"
            name="name"
            type="text"
            placeholder="Stanley"
            value={dogName}
            onChange={handleDogNameChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="numberSelect">Ideal Weight: </label>
          <select
            name="numberSelect"
            id="numberSelect"
            value={selectedNum}
            onChange={handleNumChange}
          >
            {Array.from({ length: 500 }, (_, i) => i + 1).map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>{" "}
          <label>lbs</label>
        </div>
        <div className="form-field">
          <label htmlFor="yesNoSelect">Has your pup been fixed? </label>
          <select
            name="yesNoSelect"
            id="yesNoSelect"
            value={yesNoChoice}
            onChange={handleYesNoChange}
          >
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="activityLevelSelect">How active is your pup? </label>
          <select
            name="activityLevelSelect"
            id="activityLevelSelect"
            value={activityLevel}
            onChange={handleActivityLevelChange}
          >
            <option value="">Select...</option>
            <option value="Inactive">Inactive</option>
            <option value="Somewhat Active">Somewhat Active</option>
            <option value="Active">Active</option>
            <option value="Very Active">Very Active</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="breedInput">What breed is your pup? </label>
          <input
            id="breedInput"
            className="input"
            name="breed"
            type="text"
            placeholder="Potato"
            value={dogBreed}
            onChange={handleDogBreedChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="allergies">What food is your pup allergic to? </label>
          <input
            id="allergies"
            className="input"
            name="allergies"
            type="text"
            placeholder="Leave blank if none"
            value={allergies}
            onChange={handleAllergyChange}
          />
        </div>
        <div className="form-field">
          <button type="submit" className="navbar-button">
            Unleash Your Pup's Profile
          </button>
        </div>
      </form>
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dogName={modalDogName}
        viewProfile={() => viewProfile(newDogId)}
      />
    </>
  );
}
