const db = require('../database/model');
const recipeService = require('../services/recipeService');
const { getCompletion } = require('../services/openaiService');

const recipeController = {};

recipeController.getDogRecipe = async (req, res) => {
    try {
        const dogId = req.params.id;
        const dogDetails = await db.findById(dogId);

        if(!dogDetails) return res.status(404).json({error: "Dog not found"});

        const prompt = `
        Give me a dog recipe with a title that does not include any food that dogs can't eat.
        The recipe should have exact measurements for each ingredient and instructions on how to prepare.
        Create a semantic title and easy to follow recipe. Your response should be constructed like this: 
        Title: -insert title here-
        Recipe: -insert recipe here- 
        The recipe should hit the following macros: 
        Protein: ${dogDetails.protein}g, Fat: ${dogDetails.fat}g, Carbs: ${dogDetails.carbs}g 
        with a maximum calorie count of ${dogDetails.totalCals} calories. 
        Also, do not include the following ingredients: ${dogDetails.allergies}.
        `;

        const response = await getCompletion(prompt);

        // Parse the response
        const parsedResponse = {
            title: response.content.split('\n')[0].replace('Title: ', ''),
            recipe: response.content.split('\n')[1].replace('Recipe: ', '')
        };

        //store fetched recipe in db
        await recipeService.storeRecipe(dogId, parsedResponse.title, parsedResponse.recipe);

        res.json(parsedResponse);
    
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
};

recipeController.deleteRecipe = async (req,res) => {
        const { recipeTitle } = req.body;
        const { id } = req.params;

        const sqlCommand = `
          DELETE from recipes
          WHERE id = $1 and recipe_title = $2
        `;
        const values = [id, recipeTitle];

        try {
            const result = await db.query(sqlCommand, values);
            res.status(201).json({ message: "Recipe deleted successfully." });
        } catch (err) {
            console.error("Error during recipe DELETE operation:", err);
            res.status(500).send('Error deleting recipe in database.');
          };
    };

module.exports = recipeController;