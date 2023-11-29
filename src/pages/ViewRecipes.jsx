import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreateRecipe from "../components/CreateRecipe";

export default function ViewRecipes(props) {
  const [value, setValue] = useState(0);
  const [newRecipe, setNewRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const { dogId } = useParams();

  useEffect(() => {
    fetch(`/recipe/display-all/${dogId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 404) {
          return { recipes: [] };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      })
      .then((data) => {
        console.log("API Response:", data);
        setRecipes(data.recipes);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, [dogId]);

  console.log("Recipes State:", recipes);

  const handleNewRecipe = (fetchedRecipe) => {
    const formattedRecipe = {
      recipe_title: fetchedRecipe.title,
      recipe_content: fetchedRecipe.recipe
    }
    setNewRecipe(formattedRecipe);
  };

  const handleDiscardRecipe = () => {
    setNewRecipe(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <CreateRecipe onNewRecipe={handleNewRecipe} />
      {newRecipe && (
        <Box p={3} mt={2} mb={2} bgcolor={"#f0f0f0"}>
          <h2>{newRecipe.recipe_title}</h2>
          <Typography variant="body1">{newRecipe.recipe_content}</Typography>
          <button className="edit-button">Save</button>
          <button className="edit-button">Edit</button>
          <button className="delete-button">Discard</button>
        </Box>
      )}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <Tab key={index} label={recipe.recipe_title} />
          ))
        ) : (
          <Tab label="No Recipes Available" disabled />
        )}
      </Tabs>
      {recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <div role="tabpanel" hidden={value !== index} key={index}>
            {value === index && (
              <Box p={3}>
                <h2>{recipe.recipe_title}</h2>
                <Typography variant="body1">{recipe.recipe_content}</Typography>
              </Box>
            )}
          </div>
        ))
      ) : (
        <Typography
          variant="h6"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          You don't have any recipes yet! 🍓🥒🥩🥦
        </Typography>
      )}
    </Box>
  );
}
