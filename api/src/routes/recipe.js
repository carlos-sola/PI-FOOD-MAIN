const { Router } = require('express');
const recipeController = require ('../controllers/recipe');

const router = Router();

router.get('/',recipeController.getAll);


module.exports = router;