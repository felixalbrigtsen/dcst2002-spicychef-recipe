import axios from 'axios';
import pool from '../mysql-pool';
import app from '..';
import { Recipe } from '../models/Recipe';
import { Ingredient } from '../models/Ingredient';
import recipeService from '../services/recipe-service';
import { NewRecipe } from '../models/NewRecipe';

const port = Number(process.env.PORT)

const testRecipes: Recipe[] = [
    {"id": 1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients": [{"id":1,"unitId":1,"amount":1,"ingredientName":"Lamb Mince","unitName":"kg"},{"id":2,"unitId":2,"amount":2,"ingredientName":"Garlic","unitName":"cloves minced"}]},
    {"id": 2,"title": "Lasagna","summary": "Self-created meal","servings": 2,"instructions": "Garfield","imageUrl": "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/","videoUrl": "https://www.youtube.com/watch?v=qvc4DMiioRc","ingredients": [{"id":1,"unitId":1,"amount":200,"ingredientName":"Pasta","unitName":"g"},{"id":2,"unitId":2,"amount":2,"ingredientName":"Milk","unitName":"dl"}],"tags": ["Italian"], "likes": 2, "created_at": "2022-11-09T15:22:30.000Z"},
    {"id": 3,"title": "Chicken Soup","summary": "SOUP","servings": 4,"instructions": "Boil","imageUrl": "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/1:1/w_2240,c_limit/RoastChicken_RECIPE_080420_37993.jpg","videoUrl": "https://www.youtube.com/watch?v=rX184PQ1UMI","ingredients": [{"id":1,"unitId":1,"amount":1,"ingredientName":"Chicken","unitName":""},{"id":2,"unitId":2,"amount":2,"ingredientName":"Chicken Stock","unitName":"oz"}],"tags": ["Chicken"], "likes": 7, "created_at": "2021-12-25T00:00:00.000Z"}
];

const testNewRecipes: NewRecipe[] = [
    {"id": -1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","tags":["Lamb","Soup","Tunisian"],"ingredients": [{"ingredientName":"Lamb Mince","quantity":500,"unitName":"g"},{"ingredientName":"Garlic","quantity":2,"unitName":"cloves minced"}]},
    {"id": -1, "title": "Lasagna","summary": "Self-created meal","servings": 2,"instructions": "Garfield","imageUrl": "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/","videoUrl": "https://www.youtube.com/watch?v=qvc4DMiioRc","ingredients": [{"ingredientName": "Onion","quantity": 0.5,"unitName": "units"},{"ingredientName": "Tomato Puree","quantity": 2,"unitName": "g"},{"ingredientName": "Garlic","quantity": 1,"unitName": "clove"}],"tags": ["Italian"]},
    {"id": -1,"title": "Chicken Soup","summary": "SOUP","servings": 4,"instructions": "Boil","imageUrl": "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/1:1/w_2240,c_limit/RoastChicken_RECIPE_080420_37993.jpg","videoUrl": "https://www.youtube.com/watch?v=rX184PQ1UMI","ingredients": [{"ingredientName": "Chicken Stock","quantity": 0,"unitName": ""},{"ingredientName": "Chicken","quantity": 0,"unitName": ""}],"tags": ["Chicken"]}
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
  pool.query('TRUNCATE TABLE recipe', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    recipeService
      .addRecipe(testNewRecipes[0].title, testNewRecipes[0].summary, testNewRecipes[0].instructions, testNewRecipes[0].servings, testNewRecipes[0].imageUrl, testNewRecipes[0].videoUrl)
      .then(() => recipeService.addRecipe(testNewRecipes[1].title, testNewRecipes[1].summary, testNewRecipes[1].instructions, testNewRecipes[1].servings, testNewRecipes[1].imageUrl, testNewRecipes[1].videoUrl) // Create testTask[1] after testTask[0] has been created
      .then(() => recipeService.addRecipe(testNewRecipes[2].title, testNewRecipes[2].summary, testNewRecipes[2].instructions, testNewRecipes[2].servings, testNewRecipes[2].imageUrl, testNewRecipes[2].videoUrl) // Create testTask[2] after testTask[1] has been created
      .then(() => done())));
  });

  pool.query('TRUNCATE TABLE recipe_tag', (error) => {
    if (error) return done(error);

    recipeService
      .addRecipeTag(1,testRecipes[0].tags[0])
      .then(() => recipeService.addRecipeTag(1,testRecipes[0].tags[1]))
      .then(() => recipeService.addRecipeTag(2,testRecipes[1].tags[0]))
      .then(() => recipeService.addRecipeTag(2,testRecipes[1].tags[1]))
      .then(() => recipeService.addRecipeTag(3,testRecipes[2].tags[0]))
      .then(() => recipeService.addRecipeTag(3,testRecipes[2].tags[1]))
  })

  pool.query('TRUNCATE TABLE ingredient', (error) => {
    if (error) return done(error);

    recipeService
      .addUnit(testRecipes[0].ingredients[0].ingredientName)
      .then(() => recipeService.addUnit(testRecipes[0].ingredients[1].ingredientName))
      .then(() => recipeService.addUnit(testRecipes[1].ingredients[0].ingredientName))
      .then(() => recipeService.addUnit(testRecipes[1].ingredients[1].ingredientName))
      .then(() => recipeService.addUnit(testRecipes[2].ingredients[0].ingredientName))
      .then(() => recipeService.addUnit(testRecipes[2].ingredients[1].ingredientName))
  })

  pool.query('TRUNCATE TABLE unit', (error) => {
    if (error) return done(error);

    recipeService
      .addUnit(testRecipes[0].ingredients[0].unitName)
      .then(() => recipeService.addUnit(testRecipes[0].ingredients[1].unitName))
      .then(() => recipeService.addUnit(testRecipes[1].ingredients[0].unitName))
      .then(() => recipeService.addUnit(testRecipes[1].ingredients[1].unitName))
      .then(() => recipeService.addUnit(testRecipes[2].ingredients[0].unitName))
      .then(() => recipeService.addUnit(testRecipes[2].ingredients[1].unitName))
  })

  pool.query('TRUNCATE TABLE recipe_ingredient', (error) => {
    if (error) return done(error);

    recipeService
      .addRecipeIngredient(testRecipes[0].id, 1, 1, testRecipes[0].ingredients[0].amount)
      .then(() => recipeService.addRecipeIngredient(testRecipes[0].id, 2, 2, testRecipes[0].ingredients[1].amount))
      .then(() => recipeService.addRecipeIngredient(testRecipes[1].id, 3, 3, testRecipes[1].ingredients[0].amount))
      .then(() => recipeService.addRecipeIngredient(testRecipes[1].id, 4, 4, testRecipes[1].ingredients[1].amount))
      .then(() => recipeService.addRecipeIngredient(testRecipes[2].id, 5, 5, testRecipes[2].ingredients[0].amount))
      .then(() => recipeService.addRecipeIngredient(testRecipes[2].id, 6, 6, testRecipes[2].ingredients[1].amount))
    })
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});