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
      ingredients: fetchedRecipe.ingredients,
      recipe_content: fetchedRecipe.recipe,
      nutrition: fetchedRecipe.nutrition,
    };
    setNewRecipe(formattedRecipe);
  };

  const handleDiscardRecipe = () => {
    setNewRecipe(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //formatting the recipes
  const formatList = (text, delimiter) => {
    // Ensure text is a string before trying to split it
    if (typeof text !== "string") {
      return [];
    }

    if (delimiter === "nutrition") {
      return text
        .split("\n")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim());
    }

    if (typeof delimiter === "string") {
      return text
        .split(delimiter)
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim());
    } else if (delimiter instanceof RegExp) {
      return text
        .split(delimiter)
        .slice(1)
        .map((item) => item.trim());
    }
  };

  const RecipeList = ({ listData, delimiter, listType }) => {
    const formattedList = formatList(listData, delimiter);

    if (delimiter === "nutrition") {
      return (
        <div>
          {formattedList.map((item, index) => (
            <p
              key={index}
              className="nutrition"
            >
              {item}
            </p> 
          ))}
        </div>
      );
    }

    return (
      <ul style={{ listStyleType: listType }}>
        {formattedList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <CreateRecipe onNewRecipe={handleNewRecipe} />
      {newRecipe && (
        <Box p={3} mt={2} mb={2} bgcolor={"#f0f0f0"}>
          <h2>{newRecipe.recipe_title}</h2>
          <Typography variant="subtitle1">Ingredients:</Typography>
          <RecipeList
            listData={newRecipe.ingredients}
            delimiter="-"
            listType="disc"
          />
          <Typography variant="subtitle1">Instructions:</Typography>
          <RecipeList
            listData={newRecipe.recipe_content}
            delimiter={/\d+\.\s/}
            listType="decimal"
          />
          <Typography variant="subtitle1">Nutrition Values per Serving:</Typography>
          <RecipeList
            listData={newRecipe.nutrition}
            delimiter="nutrition"
            listType="disc"
          />
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
                <Typography variant="subtitle1">Ingredients:</Typography>
                <Typography variant="body2" paragraph>
                  {recipe.ingredients}
                </Typography>
                <Typography variant="subtitle1">Instructions:</Typography>
                <Typography variant="body2" paragraph>
                  {recipe.recipe_content}
                </Typography>
                <Typography variant="subtitle1">
                  Nutrition Values per Serving:
                </Typography>
                <RecipeList
                  listData={recipe.nutrition}
                  delimiter="nutrition"
                  listType="disc"
                />
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
