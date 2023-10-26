const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");
const db = require("../database/dbConfig");
const path = require('path');

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

//if user is already signed in, redirect them
userController.signInPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'path', 'to', 'sign-in.html'));
};

//verify that email and pw are correct
userController.verifyUser = async (req, res, next) => {
  const { email, password } = req.body;

  //check if both email and password are provided
  if (!email || !password || (!email && !password))
    return res.status(400).json({ message: "Error in userController.verifyUser: not given all necessary inputs." });

  try {
    const sqlCommand = `
      SELECT * FROM users WHERE email = $1
    `;
    const values = [email];
    const result = await db.query(sqlCommand, values);

    //if user doesn't exist, sign-in is unsuccessful, move to next middleware
    if (!result.rows[0]) {
      return res.status(401).json({ signIn: false, message: 'Incorrect email or password.'})
    }

    //if user exists, verify correct pw
    const matched = await bcrypt.compare(password, result.rows[0].password);
    if (matched) {
      return res.status(200).json({ signIn: true, email: result.rows[0].email })
    }
    else {
      //if pw doesn't match, sign-in is unsccessful
      return res.status(401).json({ signIn: false, message: 'Incorrect email or password.' })
    }
  } catch (err) {
    console.error('Error in userController.verifyUser:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

//view all dogs associated with the user
userController.viewAllDogs = async (req, res, next) => {
  const { id } = req.params;

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

module.exports = userController;
