import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function SaveRecipe({
  recipeTitle,
  ingredients,
  recipeContent,
  nutrition,
}) {
  const { dogId } = useParams();

  const handleSaveClick = async () => {
    try {
      // forming recipe data from props
      const recipeData = {
        recipe_title: recipeTitle,
        ingredients: ingredients,
        recipe_content: recipeContent,
        nutrition: nutrition,
      };

      const response = await fetch(
        `http://localhost:8080/recipe/save/${dogId}`,
        {
          method: "POST",
          body: JSON.stringify(recipeData),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      // check if http response isn't successful
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const responseData = await response.json();
    // Refresh the page on successful save
    window.location.reload();
    } catch (error) {
      console.error("Error in SaveRecipe Component,", error);
    }
  };
  return (
    <>
      <button onClick={handleSaveClick} className="edit-button">
        Save
      </button>
    </>
  );
}
