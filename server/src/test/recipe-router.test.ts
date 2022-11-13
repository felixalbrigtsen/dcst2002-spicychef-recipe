import axios from 'axios';
import pool from '../mysql-pool';
import app from '..';
import { Recipe } from '../models/Recipe';
import { Ingredient } from '../models/Ingredient';
import recipeService from '../services/recipe-service';
import { NewRecipe } from '../models/NewRecipe';

const port = Number(process.env.PORT)

const testRecipes: Recipe[] = [
    {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients": [{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]}
];

const testNewRecipes: NewRecipe[] = [
    {"id": -1, "title": "Lasagna","summary": "","servings": 2,"instructions": "Garfield","imageUrl": "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/","videoUrl": "https://www.youtube.com/watch?v=qvc4DMiioRc","ingredients": [{"ingredientName": "Onion","quantity": 0.5,"unitName": "units"},{"ingredientName": "Tomato Puree","quantity": 2,"unitName": "g"},{"ingredientName": "Garlic","quantity": 1,"unitName": "clove"}],"tags": ["Italian"]},
    {
        "id": -1,
        "title": "Chicken Soup",
        "summary": "",
        "servings": 4,
        "instructions": "Boil",
        "imageUrl": "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/1:1/w_2240,c_limit/RoastChicken_RECIPE_080420_37993.jpg",
        "videoUrl": "https://www.youtube.com/watch?v=rX184PQ1UMI",
        "ingredients": [
          {
            "ingredientName": "Chicken Stock",
            "quantity": 0,
            "unitName": ""
          },
          {
            "ingredientName": "Chicken",
            "quantity": 0,
            "unitName": ""
          }
        ],
        "tags": [
          "Chicken"
        ]
      }
    ]



// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(port, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Recipes', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    recipeService
      .addRecipe(testNewRecipes[0].title, testNewRecipes[0].summary, testNewRecipes[0].instructions, testNewRecipes[0].servings, testNewRecipes[0].imageUrl, testNewRecipes[0].videoUrl)
      .then(() => recipeService.addRecipe(testNewRecipes[1].title, testNewRecipes[1].summary, testNewRecipes[1].instructions, testNewRecipes[1].servings, testNewRecipes[1].imageUrl, testNewRecipes[1].videoUrl) // Create testTask[1] after testTask[0] has been created
      .then(() => recipeService.addRecipe(testNewRecipes[2].title, testNewRecipes[2].summary, testNewRecipes[2].instructions, testNewRecipes[2].servings, testNewRecipes[2].imageUrl, testNewRecipes[2].videoUrl) // Create testTask[2] after testTask[1] has been created
      .then(() => done())));
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});