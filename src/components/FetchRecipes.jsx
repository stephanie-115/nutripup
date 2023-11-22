import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function FetchRecipes(props) {
    const { dogId } = useParams();

const handleViewRecipesClick = async () => {
  try {
    const response = await fetch(`/recipe/display-all/${dogId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    props.onRecipesFetched(data.recipes);
  } catch (error) {
      console.error('Error fetching recipes:', error);
  }
};

    return (
        <>
            <button onClick={handleViewRecipesClick} className="edit-button">
                View All Recipes
            </button>
        </>
    )
}
