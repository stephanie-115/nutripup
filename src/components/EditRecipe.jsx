import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
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

export default function EditRecipe({ recipe, onRecipeUpdate, onClose, dogId }) {
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });

  const handleInputChange = (e) => {
    setEditedRecipe({ ...editedRecipe, [e.target.name]: e.target.value });
  };

  // Update state when the recipe prop changes
  useEffect(() => {
    if (recipe) {
      setEditedRecipe(recipe);
      console.log("Updated editedRecipe:", recipe);
    }
  }, [recipe]);

  

  const handleEdit = async () => {
    if (editedRecipe.isSaved) {
    const recipeId = editedRecipe.id
      try {
        const response = await fetch(`http://localhost:8080/recipe/edit/${dogId}/${recipeId}`, {
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
        console.error('Error updating recipe', error)
      }
    onClose();
  } else {
    onRecipeUpdate(editedRecipe);
    onClose();
  }
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
          value={editedRecipe.recipe_title}
          onChange={handleInputChange}
        />

        <TextField
          margin="dense"
          name="ingredients"
          label="Ingredients"
          type="text"
          fullWidth
          multiline
          rows={8}
          value={editedRecipe.ingredients}
          onChange={handleInputChange}
        />

        <TextField
          margin="dense"
          name="recipe_content"
          label="Recipe Content"
          type="text"
          fullWidth
          multiline
          rows={8}
          value={editedRecipe.recipe_content}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="nutrition"
          label="Nutrition"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={editedRecipe.nutrition}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          Cancel
        </StyledButton>
        <StyledButton onClick={handleEdit} color="primary">
          Save Changes
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
}
