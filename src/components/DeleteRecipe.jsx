import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function DeleteRecipe({ dogId, fetchRecipes, recipeTitle }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/recipe/delete/${dogId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ recipe_title: recipeTitle }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        fetchRecipes();
      }, 1500);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <button onClick={handleDelete} className="delete-button">
        Delete Recipe
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"Recipe Deleted Successfully!"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "var(--color-dark)" }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
