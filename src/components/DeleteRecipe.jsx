import React from "react";

export default function DeleteRecipe({ dogId, fetchRecipes, recipeTitle }) {
  const handleDelete = async() => {
    try {
      const response = await fetch(`http://localhost:8080/recipe/delete/${dogId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
          },
        credentials: "include",
        body: JSON.stringify({ recipe_title: recipeTitle }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      //refresh recipe list after deletion
      fetchRecipes();
    } catch(error) {
      console.error('Error deleting recipe:', error);
    }
  }
    return(
        <>
        <button onClick={handleDelete} className="delete-button">Delete Recipe</button>
        </>
    )
}