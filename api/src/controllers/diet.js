const { Diet } = require('../db');
const axios = require ('axios');
require('dotenv').config();
const { v4: uuidv4 } = require("uuid");
const {
    API_KEY
  } = process.env;

const dietController = {
    getAll: async (req,res)=>{
        //pregunto en la tabla de diets si existen las diets
       try{
        const count = await Diet.count();
        //si no existen creo las 11 diets
        if(count===0){
            /*
        "gluten free",
        "dairy free" -----

        "gluten free",
        "dairy free",
        "paleolithic",
        "primal",
        "whole 30",
        "pescatarian",
        "ketogenic"------

        gluten free",
        "dairy free",
        "paleolithic",
        "primal",
        "fodmap friendly",
        "whole 30"
        */
            const arrayDiets = [
                {name:"gluten free"},
                {name:"ketogenic"},
                {name:"vegetarian"},
                {name:"lacto ovo vegetarian"},
                {name:"dairy free"},
                {name:"vegan"},
                {name:"pescetarian"},
                {name:"paleolithic"},
                {name:"primal"},
                {name:"fodmap friendly"},
                {name:"whole 30"}
            ];
            for (let i = 0; i<arrayDiets.length;i++){
                const newId= uuidv4();
                arrayDiets[i].id=newId;
                await Diet.create( arrayDiets[i])
            };
        } ;
        const dietsCreate = await Diet.findAll();
        //por ultimo respondo con todas las diets
        return res.status(200).send({allDiets:dietsCreate})
       } catch(error){
            res.status(500).send({error:message})
       }
        
    }
}






  module.exports = dietController;