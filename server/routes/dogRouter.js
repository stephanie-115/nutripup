const express = require ('express');
const dogController = require('../controllers/dogController');
const auth = require('../middleware/auth');

const router = express.Router();

//add dog to profile
router.post('/add', auth.setTestUser, auth.isAuthenticated, dogController.addDog);

//updating dog info
router.put('/edit/:dogId', auth.setTestUser, auth.isAuthenticated, dogController.updateDog);

//delete dog from profile
router.delete('/delete/:dogId',auth.setTestUser, auth.isAuthenticated, dogController.deleteDog);

module.exports = router;   