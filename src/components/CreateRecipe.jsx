import React from 'react';
import { useParams } from 'react-router-dom';


export default function CreateRecipe({ onNewRecipe, setIsLoading }) {
    const { dogId } = useParams();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/recipe/create/${dogId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
          });
          // check if http response isn't successful
          if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`)
          }

          const data = await response.json();
          onNewRecipe(data.data);
          setIsLoading(false);
        } catch (error) {
            console.error("Error in CreateRecipe component", error)
        }
      }
  return (
    <>
    <button className="edit-button" onClick={handleSubmit}>Create New Recipe</button>
    </>
  )
}