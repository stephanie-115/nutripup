const express = require ('express');
const dogController = require('../controllers/dogController');

const router = express.Router();

// Route to add dog to user profile:
router.post('/users/:id/dogs', dogController.addDog);

