import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ViewRecipes(props) {
  const [value, setValue] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const { dogId } = useParams();

  useEffect(() => {
    fetch(`/recipe/display-all/${dogId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
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
  console.log('dogId:', dogId)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
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
                <Typography variant="body1">
                  Description: {recipe.recipe_content}
                </Typography>
              </Box>
            )}
          </div>
        ))
      ) : (
        <>
        <Typography
          variant="h6"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          You don't have any recipes yet! 🍓🥒🥩🥦
        </Typography>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button className="edit-button">Create New Recipe</button>
        </div>
      </>
      )}
    </Box>
  );
}
