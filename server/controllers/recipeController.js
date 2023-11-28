const db = require("../database/dbConfig");
const recipeService = require("../services/recipeService");
const { getCompletion } = require("../services/openaiService");
const dogModel = require('../models/userModel')

const recipeController = {};

// Generate/Get recipe from OpenAI
recipeController.getDogRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const dogId = req.params.dogId;

    const dogDetails = await dogModel.getDogByIdAndUserId(dogId, userId);

    if (!dogDetails) return res.status(404).json({ error: "Dog not found" });

    const prompt = `
        Give me a dog recipe with a title that does not include any food that dogs can't eat.
        The recipe should have exact measurements for each ingredient and instructions on how to prepare.
        Create a semantic title and easy to follow recipe. Your response should be constructed like this: 
        Title: -insert title here-
        Recipe: -insert recipe here- 
        The recipe should hit the following macros: 
        Protein: ${dogDetails.protein}g, Fat: ${dogDetails.fat}g, Carbs: ${dogDetails.carbs}g 
        with a maximum calorie count of ${dogDetails.totalCals} calories. 
        Also, do not include the following ingredients: ${dogDetails.allergies}.
        `;

      const response = await getCompletion(prompt);
      console.log("OpenAI API Response:", response);
  
      if (!response || !response.choices || response.choices.length === 0 || !response.choices[0].message || !response.choices[0].message.content) {
        console.error("Invalid structure in response from OpenAI:", response);
        return res.status(500).json({ error: "Failed to generate recipe. Please try again later." });
      }
    
      const content = response.choices[0].message.content;
      console.log("Response Content:", content);
  
      // Parse the response
      const titleMatch = content.match(/Title: (.+?)(?:\n|$)/);
      const recipeMatch = content.match(/Recipe:\n([\s\S]+)/);
      
      console.log('Title Match:', titleMatch);
      console.log('Recipe Match:', recipeMatch);
      
      if (!titleMatch || !recipeMatch) {
        console.error('Failed to parse response:', content);
        return res.status(500).json({ error: 'Failed to generate recipe. Please try again later.' });
      }
      
      const parsedResponse = {
        title: titleMatch[1].trim(),
        recipe: recipeMatch[1].trim(),
      };
      
      console.log('Parsed Response:', parsedResponse);
      
      res.json({ message: 'Recipe generated successfully.', data: parsedResponse });
} catch (err) {
  console.error("Error in recipeController.getDogRecipe", err);
  res.status(500).send("Error creating recipe.");
}
};

//Save recipe to profile
recipeController.saveRecipe = async (req,res) => {
  const { title, recipe } = req.body;
  const { dogId } = req.params;
  const userId = req.user.id;

  try {
    //validate data
    if (!dogId || !title || !recipe) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    console.log('line 73')
    const savedRecipe = await recipeService.storeRecipe(dogId, title, recipe);

    if (savedRecipe) {
      res.json({ message: 'Recipe saved successfully!', savedRecipe });
    } else {
      res.status(400).json({ error: 'Failed to save recipe.' });
    }
  } catch (err) {
    console.error('Error in recipeController.saveRecipe.', err);
    res.status(500).send('Error saving recipe');
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

    if (result.rows.length > 0) res.json({ recipes: result.rows })
    else res.status(404).json({ message: "No recipes found for this pup." });
  } catch (err) {
    console.error("Error in recipeController.displayAllRecipes", err);
    res.status(500).send("Error retrieving recipes.");
  }
};

// Allows user to make any changes to a stored recipe
recipeController.editRecipe = async (req, res) => {
  const { dogId, recipeId } = req.params;
  const { recipe_title, recipe_content } = req.body;
  const userId = req.user.id;

  //check if dog belongs to user:
  const ownershipCheckSql = `SELECT user_id FROM dogs WHERE id = $1`;
  const dog = await db.query(ownershipCheckSql, [dogId]);

  if (!dog.rows[0] || dog.rows[0].user_id !== userId) {
    return res
      .status(403)
      .json({
        message: "You do not have permission to edit recipes for this dog.",
      });
  }
  console.log(req.body)
  try {
    const sqlCommand = `
          UPDATE recipes
          SET recipe_title =  COALESCE($1, recipe_title),
              recipe_content = COALESCE($2, recipe_content)
          WHERE dog_id = $3 AND id = $4
        `;
    const values = [
      recipe_title !== undefined ? recipe_title : null,
      recipe_content !== undefined ? recipe_content : null,
      dogId,
      recipeId,
    ];
    console.log('SQL Command:', sqlCommand);
    console.log('Values:', values);

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
  const userId = req.user.id;

  // First check if the dog belongs to the user
  const ownershipCheckSql = `SELECT user_id FROM dogs WHERE id = $1`;
  const dog = await db.query(ownershipCheckSql, [dogId]);

  if (!dog.rows[0] || dog.rows[0].user_id !== userId) {
    return res
      .status(403)
      .json({
        message:
          "You do not have permission to delete recipes from this dog's profile.",
      });
  }

  // If the dog belongs to the user, proceed with recipe deletion
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
