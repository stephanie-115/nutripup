const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/isAuthenticated');
const path = require('path');

const router = express.Router();

//user sign-up route:
router.post('/sign-up', userController.createdUser, (req, res) => {
  res.status(200).json(res.locals.createdUser);
});

//re-direct if user is already authenticated:
router.get('/sign-in', auth.redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'path', 'to', 'sign-in.html'));
});

//user sign-in route:
router.post('/sign-in', userController.verifyUser, (req, res) => {
  res.status(200).json({
    signIn: res.locals.signIn,
    email: res.locals.email
  })
});

  //display all user's dogs route:
  router.get('/all-dogs/:id', auth.isAuthenticated, userController.viewAllDogs, (req, res) => {
    res.status(200).json(res.locals.displayDogs)
  });

