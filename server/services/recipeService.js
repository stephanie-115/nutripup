const db = require("../database/dbConfig");

const storeRecipe = async (
  dogId,
  recipe_title,
  recipe_content,
  ingredients,
  nutrition
) => {
  console.log("line 4");
  const insertQuery = `
        INSERT INTO recipes (dog_id, recipe_title, recipe_content, ingredients, nutrition)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
  console.log("in recipe service");
  const values = [dogId, recipe_title, recipe_content, ingredients, nutrition];

  try {
    const result = await db.query(insertQuery, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error storing recipe:", err);
    throw err;
  }
};

module.exports = {
  storeRecipe,
};
