import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreateRecipe from "../components/CreateRecipe";
import SaveRecipe from "../components/SaveRecipe";
import LoadingCarousel from "../components/LoadingCarousel";
import EditRecipe from "../components/EditRecipe";
import { NewReleases } from "@mui/icons-material";

export default function ViewRecipes(props) {
  const [value, setValue] = useState(0);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipeContent, setRecipeContent] = useState("");
  const [nutrition, setNutrition] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState(null);
  const { dogId } = useParams();
  console.log('Dog ID:', dogId);

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
        console.log(recipes);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, [dogId]);

  const handleNewRecipe = (fetchedRecipe) => {
    console.log("Fetched Recipe:", fetchedRecipe);
    setNewRecipe(fetchedRecipe);
    setSelectedRecipe(fetchedRecipe);
    setRecipeTitle(fetchedRecipe.title);
    setIngredients(fetchedRecipe.ingredients);
    setRecipeContent(fetchedRecipe.recipe);
    setNutrition(fetchedRecipe.nutrition);
  };

  const handleDiscardNewRecipe = () => {
    setNewRecipe(null);
  };

  const handleEditClick = (recipe) => {
    // determine if recipe is saved...
    const isSaved = recipe.id !== undefined;

    const normalizedRecipe = {
      id: recipe.id,
      recipe_title: recipe.title || recipe.recipe_title,
      recipe_content: recipe.recipe || recipe.recipe_content,
      ingredients: recipe.ingredients,
      nutrition: recipe.nutrition,
      isSaved: isSaved,
    };
    setSelectedRecipe(normalizedRecipe);
    setShowEditModal(true);
  };

  //update a recipe in state
  const handleRecipeUpdate = (updatedRecipe) => {
  if (updatedRecipe.isSaved) {
    const updatedRecipes = recipes.map((recipe) => 
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );
    setRecipes(updatedRecipes);
  } else {
    //for new recipes, update newRecipe state only
    setNewRecipe(updatedRecipe);
  }
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
            <p key={index} className="nutrition">
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
    <Box
      sx={{
        bgcolor: "var(--color-light)",
        marginX: "auto",
        maxWidth: "lg",
        padding: 1,
        width: "auto",
        boxSizing: "border-box",
      }}
    >
      <LoadingCarousel isLoading={isLoading} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <CreateRecipe
          onNewRecipe={handleNewRecipe}
          setIsLoading={setIsLoading}
        />
        {newRecipe && (
          <Box
            p={3}
            mt={2}
            mb={2}
            style={{ backgroundColor: "var(--color-tertiary)" }}
          >
            <h2>{newRecipe.title}</h2>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Ingredients:
            </Typography>
            <RecipeList
              listData={ingredients}
              delimiter={/-/}
              listType="disc"
            />
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Instructions:
            </Typography>
            <RecipeList
              listData={recipeContent}
              delimiter={/\d+\.\s/}
              listType="decimal"
            />
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Nutrition Values per Serving:
            </Typography>
            <RecipeList
              listData={nutrition}
              delimiter="\n" // Each nutrition fact is on a new line
              listType="none"
            />
            <div
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <SaveRecipe
                recipeTitle={recipeTitle}
                ingredients={ingredients}
                recipeContent={recipeContent}
                nutrition={nutrition}
              />
              <button
                className="edit-button"
                onClick={() => handleEditClick(newRecipe)}
              >
                Edit Recipe
              </button>
              {showEditModal && selectedRecipe && (
                <EditRecipe
                  recipe={selectedRecipe}
                  onRecipeUpdate={handleRecipeUpdate}
                  onClose={() => setShowEditModal(false)}
                  dogId={dogId}
                />
              )}
              <button
                className="delete-button"
                onClick={handleDiscardNewRecipe}
              >
                Discard
              </button>
            </div>
          </Box>
        )}
      </div>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ ".Mui-selected": { color: "darkcyan !important" } }}
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
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Ingredients:
                </Typography>
                <RecipeList
                  listData={recipe.ingredients}
                  delimiter={/-/} // Adjust if needed
                  listType="disc"
                />
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Instructions:
                </Typography>
                <RecipeList
                  listData={recipe.recipe_content}
                  delimiter={/\d+\.\s/} // Adjust if needed
                  listType="decimal"
                />
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Nutrition Values per Serving:
                </Typography>
                <RecipeList
                  listData={recipe.nutrition}
                  delimiter="\n"
                  listType="none"
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(recipe)}
                  >
                    Edit Recipe
                  </button>
                  <button className="delete-button">Delete Recipe</button>
                </div>
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
      {showEditModal && selectedRecipe && (
        <EditRecipe
          recipe={selectedRecipe}
          onRecipeUpdate={handleRecipeUpdate}
          onClose={() => setShowEditModal(false)}
          dogId={dogId}
        />
      )}
    </Box>
  );
}
