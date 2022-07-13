
require('dotenv').config();
const { Recipe,Diet } = require('../db');
const axios = require ('axios');
const { v4: uuidv4 } = require("uuid");
const {
    API_KEY,API_KEY1,API_KEY2,API_KEY3,API_KEY4
  } = process.env;



const recipeController = {
    getAll: async (req,res)=>{
        try {
            const { name } = req.query;
            //PIDO INFO A LA DATABASE
             const dbInfo = await Recipe.findAll({ include: Diet })
            
            //PIDO INFO A LA API
            const apiUrl = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`);
            //accedo al obj results, meto el array q contiene en la variable apiId
            const apiId = apiUrl.data.results ;
            // itero cada elemento del array realizando una peticion de axios por cada uno y guardando la data en arrayId 
            //mapeo arrayId creando un objeto con los atributos del modelo Recipe
            let arrayId =[];
            for(let i = 0; i < apiId.length ;i++ ){
                const recipe = await axios.get(`https://api.spoonacular.com/recipes/${apiId[i].id}/information?apiKey=${API_KEY}`);
                arrayId.push(recipe.data);
            };
             const apiInfo = arrayId.map(e=>{
                 return{
                     id: e.id,
                     name: e.title,
                     summary: e.summary,
                     healthScore: e.healthScore,
                     instructions: e.instructions,
                     image: e.image,
                     diets: e.diets.map(d=>{
                         return {
                             name:d
                         }
                     })
                 }
             });
    
            //CONCATENO LA INFO DE DATABASE Y DE LA API
            let infoTotal = dbInfo.concat(apiInfo);

            // si me llegó un name por query, filtro por name antes de devolver
            if (name){
                   info = infoTotal.filter(p=>{
                   infoTotal = p.name.toLowerCase().includes(name.toLowerCase())
                })
            }
            return res.send({ recipes: infoTotal});
    

        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
    createRecipe:async(req, res)=>{
        const {name,summary,healthScore,instructions,image,diets} = req.body;
        try {
            if(!name||!summary){
               return res.status(400).send("Faltan campos obligatorios")
            }
            const id= uuidv4();
            const newRecipe = await Recipe.create({
                id:id,
                name: name,
                summary:summary,
                healthScore:healthScore,
                instructions:instructions,
                image:image,
            }) 
            if (diets&&diets.length){
                var dietsDb = [];
                for (let i = 0; i<diets.length;i++){
                    const dietFound = await Diet.findOne({where :{
                        name : diets[i]
                    }})
                    dietsDb.push(dietFound)
                }
                await newRecipe.addDiets(dietsDb)
            }
            return res.status(200).send(newRecipe);
        }catch(error){
            return res.status(500).send(error.message)
        }
    }
}

module.exports = recipeController;