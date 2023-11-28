const express = require('express');
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

const router = express.Router();

//generate recipe using api
router.get('/create/:dogId', recipeController.getDogRecipe);

//save recipe to profile
router.post('/save/:dogId', auth.isAuthenticated, recipeController.saveRecipe);

//display all recipes
router.get('/display-all/:dogId', auth.isAuthenticated, recipeController.displayAllRecipes);

// router.get('/display-all/:dogId', auth.isAuthenticated, async (req, res) => {
//     const dogId = parseInt(req.params.dogId, 10); // Convert to integer
//     if (isNaN(dogId)) {
//         return res.status(400).send("Invalid dog ID");
//     }
// });

//edit saved recipe
router.put('/edit/:dogId/:recipeId', auth.isAuthenticated, recipeController.editRecipe);

//delete saved recipe
router.delete('/delete/:dogId', auth.isAuthenticated, recipeController.deleteRecipe);

module.exports = router;
