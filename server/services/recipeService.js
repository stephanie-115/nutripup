const db = require("../database/dbConfig");

const storeRecipe = async (dogId, recipeTitle, recipeContent) => {
  const insertQuery = `
        INSERT INTO recipes (dog_id, recipe_title, recipe_content)
    `;

  const values = [dogId, recipeTitle, recipeContent];

  try {
    const result = await db.query(storeRecipe, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error storing recipe:", err);
    throw err;
  }
};

module.exports = storeRecipe;
