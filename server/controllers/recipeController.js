const db = require("../database/dbConfig");
const recipeService = require("../services/recipeService");
const { getCompletion } = require("../services/openaiService");
const { getDogByIdAndUserId } = require("../models/userModel");

const recipeController = {};

// Generate/Get recipe from OpenAI
recipeController.getDogRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const dogId = req.params.dogId;

    const dogDetails = await getDogByIdAndUserId(dogId, userId);

    if (!dogDetails) return res.status(404).json({ error: "Dog not found" });

    const prompt = `
  Create a dog recipe with a clear title, precise ingredient measurements, and easy-to-follow preparation instructions. Please adhere strictly to this structure:

  Title: -insert title here-

  Ingredients: 
  - Insert each ingredient with its exact measurement on a new line.
  -At the top of the ingredients section, please include how many servings this makes.

  Recipe Instructions: 
  - Provide step-by-step cooking instructions here.
  - Ensure that this section contains only the preparation steps without any nutritional information.
  - Each recipe you provide should cover the nutritional needs of the dog as much as possible.
  - Please use pounds, cups, ounces, tablespoons, teaspoons when you include measurements.

  Nutrition Values per Serving: 
  - Detail only the macro nutritional values here: Protein, Fat, and Carbs.
  - Please match these macros values as close as possible in the generation of the recipe per serving-- This particular dog needs these daily values hit: Protein: ${dogDetails.protein}g, Fat: ${dogDetails.fat}g, Carbs: ${dogDetails.carbs}g. Do not include the total macros for the recipe as a whole. Include the macros per serving.
  - Do not include total calorie count or any other nutritional details apart from the specified macros.

  Exclude any ingredients that are harmful to dogs and this as well: ${dogDetails.allergies}.
`;

    const response = await getCompletion(prompt);
    console.log("OpenAI API Response:", response);

    if (
      !response ||
      !response.choices ||
      response.choices.length === 0 ||
      !response.choices[0].message ||
      !response.choices[0].message.content
    ) {
      console.error("Invalid structure in response from OpenAI:", response);
      return res
        .status(500)
        .json({ error: "Failed to generate recipe. Please try again later." });
    }

    const content = response.choices[0].message.content;
    console.log("Response Content:", content);

    // Parse the response
    const titleMatch = content.match(/Title: (.+?)(?:\n|$)/);
    const ingredientsMatch = content.match(
      /Ingredients:\n([\s\S]+?)\n(?=Recipe Instructions:)/
    );
    const recipeMatch = content.match(
      /Recipe Instructions:\n([\s\S]+?)\n(?=Nutrition Values per Serving:)/
    );
    const nutritionMatch = content.match(
      /Nutrition Values per Serving:\n([\s\S]+)/
    );

    console.log("Title Match:", titleMatch);
    console.log("Ingredients Match:", ingredientsMatch);
    console.log("Recipe Match:", recipeMatch);
    console.log("Nutrition Match:", ingredientsMatch);

    if (!titleMatch || !ingredientsMatch || !recipeMatch || !nutritionMatch) {
      console.error("Failed to parse response:", content);
      return res
        .status(500)
        .json({ error: "Failed to generate recipe. Please try again later." });
    }

    const parsedResponse = {
      title: titleMatch[1].trim(),
      ingredients: ingredientsMatch[1].trim(),
      recipe: recipeMatch[1].trim(),
      nutrition: nutritionMatch[1].trim(),
    };

    console.log("Parsed Response:", parsedResponse);

    res.json({
      message: "Recipe generated successfully.",
      data: parsedResponse,
    });
  } catch (err) {
    console.error("Error in recipeController.getDogRecipe", err);
    res.status(500).send("Error creating recipe.");
  }
};

//Save recipe to profile
recipeController.saveRecipe = async (req, res) => {
  const { recipe_title, recipe_content, ingredients, nutrition } = req.body;
  const { dogId } = req.params;

  try {
    //validate data
    if (
      !dogId ||
      !recipe_title ||
      !recipe_content ||
      !ingredients ||
      !nutrition
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    console.log("line 73");
    const savedRecipe = await recipeService.storeRecipe(
      dogId,
      recipe_title,
      recipe_content,
      ingredients,
      nutrition
    );

    if (savedRecipe) {
      res.json({ message: "Recipe saved successfully!", savedRecipe });
    } else {
      res.status(400).json({ error: "Failed to save recipe." });
    }
  } catch (err) {
    console.error("Error in recipeController.saveRecipe.", err);
    res.status(500).send("Error saving recipe");
  }
};

//Display all recipes for a dog
recipeController.displayAllRecipes = async (req, res) => {
  const { dogId } = req.params;
  const userId = req.user.id;

  try {
    const sqlCommand = `
    SELECT * from recipes WHERE dog_id = $1
    `;
    const values = [dogId];
    const result = await db.query(sqlCommand, values);
    console.log("SQL Query Result:", result.rows);

    res.json({ recipes: result.rows });
  } catch (err) {
    console.error("Error in recipeController.displayAllRecipes", err);
    res.status(500).send("Error retrieving recipes.");
  }
};

// Allows user to make any changes to a stored recipe
recipeController.editRecipe = async (req, res) => {
  const { dogId, recipeId } = req.params;
  const { recipe_title, recipe_content, ingredients, nutrition } = req.body;

  try {
    const sqlCommand = `
          UPDATE recipes
          SET recipe_title =  COALESCE($1, recipe_title),
              recipe_content = COALESCE($2, recipe_content),
              ingredients = COALESCE($3, ingredients),
              nutrition = COALESCE($4, nutrition)
          WHERE dog_id = $5 AND id = $6
        `;
    const values = [
      recipe_title !== undefined ? recipe_title : null,
      recipe_content !== undefined ? recipe_content : null,
      ingredients !== undefined ? ingredients : null,
      nutrition !== undefined ? nutrition : null,
      dogId,
      recipeId,
    ];
    // console.log('SQL Command:', sqlCommand);
    // console.log('Values:', values);

    const result = await db.query(sqlCommand, values);

    if (!result.rowCount) {
      return res.status(404).json({ error: "Recipe not found." });
    }
    res.json({ message: "Recipe updated successfully" });
  } catch (err) {
    console.error("Error in recipeController.editRecipe", err);
    res.status(500).send("Error changing recipe.");
  }
};

// Delete any recipe from a dog's profile
recipeController.deleteRecipe = async (req, res) => {
  const { recipe_title } = req.body;
  const { dogId } = req.params;

  const deleteRecipeSql = `
      DELETE FROM recipes
      WHERE dog_id = $1 AND recipe_title = $2
    `;
  const values = [dogId, recipe_title];

  try {
    const result = await db.query(deleteRecipeSql, values);
    if (!result.rowCount) {
      return res
        .status(404)
        .json({ message: "Recipe not found or already deleted." });
    }
    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (err) {
    console.error("Error in recipeController.deleteRecipe", err);
    res.status(500).send("Error deleting recipe.");
  }
};

module.exports = recipeController;
