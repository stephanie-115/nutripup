const db = require("../database/dbConfig");

const storeRecipe = async (dogId, title, recipe) => {
  console.log('line 4')
  const insertQuery = `
        INSERT INTO recipes (dog_id, recipe_title, recipe_content)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
console.log('in recipe service')
  const values = [dogId, title, recipe];

  try {
    const result = await db.query(insertQuery, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error storing recipe:", err);
    throw err;
  }
};

module.exports = {
  storeRecipe
};

