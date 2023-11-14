const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");
const db = require("../database/dbConfig");
const path = require('path');
const passport = require('passport');

const userController = {};

//create user in the db
userController.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  //check if name, email and password are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Error in userController.createUser: not given all necessary inputs." });
  }

  try {
    //find if user already exists
    const sqlCommand1 = `
      SELECT * FROM users WHERE email = $1;
    `;
    const values1 = [email];
    const result1 = await db.query(sqlCommand1, values1);

    if (result1.rows[0] > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    //hashing pw before saving to db
    const hashedPW = await bcrypt.hash(password, SALT_WORK_FACTOR);

    //save info to db
    const values2 = [name, email, hashedPW];
    const sqlCommand2 = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
      `;
    const result2 = await db.query(sqlCommand2, values2);
    
    return res.status(201).json({ message: 'User created successfully.', user: result2.rows[0] });

  } catch (err) {
    console.error('Error in userController.createUser:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

//verify that email and pw are correct
userController.verifyUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error in userController.verifyUser:', err);
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.status(401).json({ signIn: false, message: 'Incorrect email or password.' });
    }

    // Passport exposes a login() function on req (also known as req.logIn()) that can be used to establish a login session
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error in userController.verifyUser during login:', err);
        return next(err);
      }
      // Successful authentication, send the response
      return res.status(200).json({ signIn: true, email: user.email });
    });
  })(req, res, next);
};

//view all dogs associated with the user
userController.viewAllDogs = async (req, res, next) => {
  const { id } = req.user.id;

//ownership check:
if (req.user && req.user.id !== parseInt(id)) {
  return res.status(403).json({ message: 'Unauthorized: You do not have permission to access this data.' });
}

  try {
    const sqlCommand = `
    SELECT * FROM dogs WHERE user_id = $1;
    `;
    const values = [id];
    const result = await db.query(sqlCommand, values);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    } else {
      return res.status(404).json({ message: "No dogs found for this user." });
    }
  } catch (err) {
    console.error('Error in userController.viewAllDogs:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
userController.signOut = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Successfully signed out.' });
    });
  });
};

module.exports = userController;
