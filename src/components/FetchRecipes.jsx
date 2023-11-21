import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FetchRecipes({ onRecipesFetched }) {
    const { dogId } = useParams();
    const [recipes, setRecipes] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
          try {
            const response = await fetch(`/recipe/display-all/${dogId}`, {
              method: "GET",
              credentials: "include",
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            onRecipesFetched(data.recipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
          }
        };
        fetchRecipes();
      }, [dogId, onRecipesFetched]);

      const handleViewRecipesClick = () => {
        console.log('recipes:', recipes);
      };

      return (
        <>
            <button onClick={handleViewRecipesClick} className="edit-button">
                View All Recipes
            </button>
        </>
      )
}