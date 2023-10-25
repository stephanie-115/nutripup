const express = require ('express');
const dogController = require('../controllers/dogController');

const router = express.Router();

// Route to add dog to user profile:
router.post('/:id/add', dogController.addDog);

// Route to update dog info:
router.put('/:id/update', dogController.updateDog);

// Route to delete dog from user profile:
router.delete('/:id/delete', dogController.deleteDog);


