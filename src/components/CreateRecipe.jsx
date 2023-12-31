import React from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateRecipe({ onNewRecipe, setIsCreatingRecipe }) {
  const { dogId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreatingRecipe(true);
    try {
      const response = await fetch(
        `http://localhost:8080/recipe/create/${dogId}`,
        {
          method: "GET",
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

      const data = await response.json();
      onNewRecipe(data.data);
    } catch (error) {
      toast.error("Error: Unable to create recipe");
      console.error("Error in CreateRecipe component", error);
    } finally {
      setIsCreatingRecipe(false);
    }
  };
  return (
    <>
      <ToastContainer />
      <button className="create-recipe-button" onClick={handleSubmit}>
        Create New Recipe
      </button>
    </>
  );
}
