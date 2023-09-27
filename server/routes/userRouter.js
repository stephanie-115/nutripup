const express = require('express');
const userController = require('../controllers/userController');
const dogController = require('../controllers/dogController');

const router = express.Router();

//user sign-up route:
router.post('/sign-up', userController.createUser, (req, res) => {
  res.status(200).json(res.locals.createUser);
});

//user sign-in route:
router.post('sign-in', userController.verifyUser, (req, res) => {
  res.status(200).json({
    signIn: res.locals.signIn,
    email: res.locals.email
  });
});

