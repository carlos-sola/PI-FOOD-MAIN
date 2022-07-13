const { Router } = require('express');
const recipeController = require ('../controllers/recipe');

const router = Router();

// router.get('/',recipeController.getByName);
router.get('/',recipeController.getAll);
router.post('/',recipeController.createRecipe);

module.exports = router;