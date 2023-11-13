import React, { useState } from "react";

export default function CreateDogProfile() {
  const [dogName, setDogName] = useState("");
  const [selectedNum, setSelectedNum] = useState("0");
  const [yesNoChoice, setYesNoChoice] = useState("");
  const [activityLevel, setActivityLevel] = useState('');
  const [dogBreed, setDogBreed] = useState('');

  const handleDogNameChange = (e) => {
    setDogName(e.target.value);
  };

  const handleNumChange = (e) => {
    setSelectedNum(e.target.value);
  };

  const handleYesNoChange = (e) => {
    setYesNoChoice(e.target.value);
  };

  const handleActivityLevelChange = (e) => {
    setActivityLevel(e.target.value);
  };

  const handleDogBreedChange = (e) => {
    setDogBreed(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dogDetails = {
      dogName,
      idealWeight: selectedNum,
      neutered: yesNoChoice,
      activityLevel,
      dogBreed
    }
      console.log('dogDetails:', dogDetails)
    try {
      const response = await fetch('/dog/add', {
        method: 'POST',
        body: JSON.stringify(dogDetails),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      //check if http response isn't successful
      if (!response.ok) {
        throw new Error(`HTTP error1 status: ${response.status}`);
      }
    } catch (error) {
        console.error('Error in AddNewPup / handleSubmit', error);
    }
  };

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
        <label htmlFor="yesNoSelect">
          Has your pup been neutered or spade? {" "}
        </label>
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
        <label htmlFor="activityLevelSelect">How active is your pup?</label>
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
        <button
          type="submit"
          className="signup-button"
        >
            Unleash Your Pup's Profile
        </button>
        </div>
      </form>
    </>
  );
}
