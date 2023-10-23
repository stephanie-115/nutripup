const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

//user sign-up route:
router.post('/sign-up', userController.createdUser, (req, res) => {
  res.status(200).json(res.locals.createdUser);
});

//user sign-in route:
router.post('/sign-in', userController.verifyUser, (req, res) => {
  res.status(200).json({
    signIn: res.locals.signIn,
    email: res.locals.email
  })
});

  //display all user's dogs route:
  router.get('/all-dogs/:id', userController.viewAllDogs, (req, res) => {
    res.status(200).json(res.locals.displayDogs)
  });

