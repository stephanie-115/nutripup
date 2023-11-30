import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const StyledButton = styled(Button)({
  backgroundColor: "#031926",
  color: "#f4e9cd",
  "&:hover": {
    backgroundColor: "#468189",
  },
});

export default function EditRecipe({
  recipe,
  onRecipeUpdate,
  onClose,
  dogId
}) {
  const [editedRecipe, setEditedRecipe] = useState(
    recipe || {
      title: "",
      ingredients: "",
      recipe: "",
      nutrition: "",
    }
  )

  // Update state when the recipe prop changes
  useEffect(() => {
    if (recipe) {
      setEditedRecipe(recipe);
    }
  }, [recipe]);

  const handleInputChange = (e) => {
    setEditedRecipe({ ...editedRecipe, [e.target.name]: e.target.value });
  };

  const handleEdit = (dogId, editedRecipe) => {
    const editRecipe = async () => {
      try {
        const response = await fetch(`/recipe/${dogId}/${recipeId}`, {
          method: "PUT",
          body: JSON.stringify(editedRecipe),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        //update local state with edited details
        onRecipeUpdate(editedRecipe);
      } catch(error) {
        console.error('Error updating dog data', error)
      }
    }
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      PaperProps={{
        style: {
          backgroundColor: "#9dbebb",
        },
      }}
    >
      <DialogTitle id="form-dialog-title">Edit Recipe</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="recipe_title"
          label="Recipe Title"
          type="text"
          fullWidth
          value={editedRecipe.title}
          onChange={handleInputChange}
        />

        <TextField
          margin="dense"
          name="ingredients"
          label="Ingredients"
          type="text"
          fullwidth
          value={editedRecipe.ingredients}
          onChange={handleInputChange}
        />

        <TextField
          margin="dense"
          name="recipe_content"
          label="Recipe Content"
          type="text"
          fullwidth
          value={editedRecipe.recipe}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="nutrition"
          label="Nutrition"
          type="text"
          fullwidth
          value={editedRecipe.nutrition}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          Cancel
        </StyledButton>
        <StyledButton onClick={handleSave} color="primary">
          Save Changes
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
}
