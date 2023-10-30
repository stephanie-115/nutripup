const express = require('express');
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

const router = express.Router();

//generate recipe using api
router.get('/create/:dogId', auth.setTestUser, recipeController.getDogRecipe);

//save recipe to profile
router.post('/save/:dogId', auth.setTestUser, auth.isAuthenticated, recipeController.saveRecipe);

//display all recipes
router.get('/display-all/:dogId', auth.setTestUser, auth.isAuthenticated, recipeController.displayAllRecipes);

//edit saved recipe
router.put('/edit/:dogId/:recipeId', auth.setTestUser, auth.isAuthenticated, recipeController.editRecipe);

//delete saved recipe
router.delete('/delete/:dogId', auth.setTestUser, auth.isAuthenticated, recipeController.deleteRecipe);

module.exports = router;
