import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function SaveRecipe({
  newRecipe,
  setRecipes,
  onSave,
}) {
  const [open, setOpen] = useState(false);
  const { dogId } = useParams();

  const handleSaveClick = async () => {
    setOpen(true);
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
        setTimeout(() => {
          onSave(savedRecipeData); // Call onSave after a delay
          setRecipes((prevRecipes) => [...prevRecipes, savedRecipeData]);
        }, 1000);
      }
    } catch (error) {
      console.error("Error in SaveRecipe Component,", error);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <button onClick={handleSaveClick} className="edit-button">
        Save
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"Recipe Saved Successfully!"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: 'var(--color-dark)' }} >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
