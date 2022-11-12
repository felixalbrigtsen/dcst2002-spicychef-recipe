import axios from 'axios';
import pool from '../mysql-pool';
import app from '..';
import { Recipe } from '../models/Recipe';
import { Ingredient } from '../models/Ingredient';
import recipeService from '../services/recipe-service';

const port = Number(process.env.PORT)

const testData: Recipe[] = [
    {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients": [{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]}
];

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
      .addRecipe()
      .then(() => recipeService.addRecipe() // Create testTask[1] after testTask[0] has been created
      .then(() => recipeService.addRecipe() // Create testTask[2] after testTask[1] has been created
      .then(() => done()); // Call done() after testTask[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});