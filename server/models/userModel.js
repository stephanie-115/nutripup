const db = require('../database/dbConfig');

const dogModel = {};

dogModel.getDogByIdAndUserId = async (dogId, userId) => {
  try {
    const result = await db.query('SELECT * FROM dogs WHERE id = $1 AND user_id = $2', [dogId, userId]);
    console.log('userid', userId)
    console.log('dogid', dogId)
    return result.rows[0];
  } catch (err) {
    console.error('Error in getDogByIdAndUserId: ', err);
    throw err;
  }
};

const userModel = {}

userModel.getUserById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error in getUserById:', err);
    throw err;
  }
};

module.exports = { getDogByIdAndUserId: dogModel.getDogByIdAndUserId, userModel };


