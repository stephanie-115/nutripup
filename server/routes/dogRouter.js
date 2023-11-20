const express = require ('express');
const dogController = require('../controllers/dogController');
const auth = require('../middleware/auth');

const router = express.Router();

//add dog to profile
router.post('/add', auth.isAuthenticated, dogController.addDog);

//updating dog info
router.put('/edit/:dogId', auth.isAuthenticated, dogController.updateDog);

//display specific dog's profile:
router.get("/view-profile/:dogId", auth.isAuthenticated, dogController.displayProfile);

//delete dog from profile
router.delete('/delete/:dogId', auth.isAuthenticated, dogController.deleteDog);

module.exports = router;   