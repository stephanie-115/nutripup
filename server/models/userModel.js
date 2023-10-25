const db = require('../database/dbConfig');

const userModel = {};

userModel.getUserById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error in getUserById: ', err);
    throw err;
  }
};

module.exports = userModel;
