const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');
const db = require('../database/model');

const userController = {};

userController.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return next('Error in userController.createUser: not given all necessary inputs.');

  //find if user already exists?
  try {
    const sqlCommand1 = `
      SELECT * FROM users WHERE email = $1;
    `;
    const values1 = [ email ];
    const result = await db.query(sqlCommand1, values1);
    if(result.rows[0]) {
      res.locals.createdUser = false;
      return next();
    }
  } catch(err) {
    return next('Error in userController.createUser: verifying if user already exists.');
  }
    //if user doesn't already exist, create user
    try{
      const sqlCommand2 = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
      `;

      //hashing pw before saving to db
      const hashedPW = await bcrypt.hash(password, SALT_WORK_FACTOR);
      //save info to db
      const values2 = [ name, email, hashedPW ];
      const result = db.query(sqlCommand2, values2);
      res.locals.createdUser = true;
    } catch(err) {
      return next('Error in userController.createUser: could not add new user to database.')
    }
    return next();
};

userController.verifyUser = async (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password || !email && !password) return next('Error in userController.verifyUser: not given all necessary inputs.');
  try {
    const sqlCommand = `
      SELECT * FROM users WHERE email = $1
    `;
    const values = [ email ];
    const result = db.query(sqlCommand, values);
    //if user doesn't exist, sign-in is unsuccessful, move to next middleware
    if(!result.rows[0]) {
      res.locals.signIn = false;
      return next();
    }; 
    //if user exists, verify correct pw
    const matched = await bcrypt.compare(password, result.rows[0].password);
    if(matched) {
        res.locals.signIn = true;
        res.locals.email = result.rows[0].email;
      }
      //if pw doesn't match, sign-in is unsccessful
      else res.locals.signIn = false;
  } catch(err) {
    return next('Error in userController.verifyUser: verifying the user in the database.')
  };
  return next();
};

userController.viewAllDogs = async (req, res, next) => {
  const { id } = req.params;

  try {
    const sqlCommand = `
    SELECT * FROM dogs WHERE user_id = $1;
    `;
    const values = [id];
    const result = await db.query(sqlCommand, values);

    if (result.rows.length > 0) {
      res.locals.displayDogs = result.rows;
    } else {
      res.status(404).json({ message: 'No dogs found for this user.' });
    }
  } catch (err) {
    next(err);
  }
}


module.exports = userController;