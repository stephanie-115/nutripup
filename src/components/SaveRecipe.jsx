import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function SaveRecipe({
  recipe_title,
  ingredients,
  recipeContent,
  nutrition,
  newRecipe,
  setRecipes,
  onSave,
}) {
  const { dogId } = useParams();

  const handleSaveClick = async () => {
    try {
      // forming recipe data from props
      const recipeData = {
        recipe_title: newRecipe.recipe_title,
        ingredients: newRecipe.ingredients,
        recipe_content: newRecipe.recipe_content,
        nutrition: newRecipe.nutrition,
      };      

      if (newRecipe && !newRecipe.id) {
        console.log("Saving Recipe Data:", recipeData);
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

        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        const savedRecipeData = await response.json();
        console.log("Saved Recipe Data:", savedRecipeData);
        onSave(savedRecipeData)
        // Update your state here with the new recipe data
        setRecipes((prevRecipes) => [...prevRecipes, savedRecipeData])
      }
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
