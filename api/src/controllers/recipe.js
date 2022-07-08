const { Recipe } = require('../db');

const recipeController = {
    getAll: async (req,res)=>{
        const allRecipes = await Recipe.findAll()
        return res.send(allRecipes)
    }
}

module.exports = recipeController;