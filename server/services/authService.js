const db = require("../database/dbConfig");

const authService = {};

authService.authenticateUser = async (username, password) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (user && user.password === password) {
      return user;
    }
    return null;
  } catch (err) {
    console.error("Error in authenticateUser: ", err);
    throw err;
  }
};

module.exports = authService;
