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
import DeleteRecipe from "../components/DeleteRecipe";

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

  // Fetch recipes function
  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/recipe/display-all/${dogId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setRecipes(data.recipes);

      // Adjust `value` after setting recipes
      if (value >= data.recipes.length) {
        setValue(data.recipes.length > 0 ? data.recipes.length - 1 : 0);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recipes on mount
  useEffect(() => {
    fetchRecipes();
  }, [dogId]);

  const handleNewRecipe = (fetchedRecipe) => {
    setNewRecipe(fetchedRecipe);
    setSelectedRecipe(fetchedRecipe);
    setRecipeTitle(fetchedRecipe.recipe_title);
    setIngredients(fetchedRecipe.ingredients);
    setRecipeContent(fetchedRecipe.recipe_content);
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
      recipe_title: recipe.recipe_title,
      recipe_content: recipe.recipe_content,
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

  const updateRecipesAfterSave = (newRecipe) => {
    fetchRecipes(); // re-fetch recipes
    setNewRecipe(null);
    setValue(0);
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
        {newRecipe && (
          <Box
            p={3}
            mt={2}
            mb={2}
            style={{ backgroundColor: "var(--color-tertiary)" }}
          >
            <h2>{newRecipe.recipe_title}</h2>
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
                newRecipe={newRecipe}
                setRecipes={setRecipes}
                onSave={updateRecipesAfterSave}
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
      </Tabs>
      {recipes.length > 0 ? (
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ ".Mui-selected": { color: "darkcyan !important" } }}
          >
            {recipes.map((recipe, index) => (
              <Tab key={index} label={recipe.recipe_title} />
            ))}
          </Tabs>
          {recipes.map((recipe, index) => (
            <div role="tabpanel" hidden={value !== index} key={index}>
              {value === index && (
                <Box p={3}>
                  <h2>{recipe.recipe_title}</h2>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Ingredients:
                  </Typography>
                  <RecipeList
                    listData={recipe.ingredients}
                    delimiter={/-/} // Adjust if needed
                    listType="disc"
                  />
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Instructions:
                  </Typography>
                  <RecipeList
                    listData={recipe.recipe_content}
                    delimiter={/\d+\.\s/} // Adjust if needed
                    listType="decimal"
                  />
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
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
                    <DeleteRecipe
                      dogId={dogId}
                      recipeTitle={recipe.recipe_title}
                      fetchRecipes={fetchRecipes}
                    />
                  </div>
                </Box>
              )}
            </div>
          ))}
        </>
      ) : (
        <Typography
          variant="h6"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          You don't have any recipes yet! 🍓🥒🥩🥦
        </Typography>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CreateRecipe
          onNewRecipe={handleNewRecipe}
          setIsLoading={setIsLoading}
        />
      </div>

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
