import axios from 'axios';
import pool from '../mysql-pool';
import app from '..';
import { Recipe } from '../models/Recipe';
import { Ingredient } from '../models/Ingredient';
import recipeService from '../services/recipe-service';
import { NewRecipe } from '../models/NewRecipe';
import { initTest } from '../utils/initdb'
import { RecipeIngredient } from '../models/RecipeIngredient';

const PORT = Number(process.env.PORT) || 3000;
const DUMMY_PORT = Number(process.env.DUMMY_PORT) || 3001;

const testRecipes: Recipe[] = [
    {"id": 1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":new Date(),"likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients": [{"ingredientId":1,"unitId":1,"quantity":1,"ingredientName":"Lamb Mince","unitName":"kg"},{"ingredientId":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]},
    {"id": 2,"title": "Lasagna","summary": "Self-created meal","servings": 2,"instructions": "Garfield","imageUrl": "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/","videoUrl": "https://www.youtube.com/watch?v=qvc4DMiioRc","ingredients": [{"ingredientId":1,"unitId":1,"quantity":200,"ingredientName":"Pasta","unitName":"g"},{"ingredientId":2,"unitId":2,"quantity":2,"ingredientName":"Milk","unitName":"dl"}],"tags": ["Italian"], "likes": 0, "created_at": new Date()},
    {"id": 3,"title": "Chicken Soup","summary": "SOUP","servings": 4,"instructions": "Boil","imageUrl": "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/1:1/w_2240,c_limit/RoastChicken_RECIPE_080420_37993.jpg","videoUrl": "https://www.youtube.com/watch?v=rX184PQ1UMI","ingredients": [{"ingredientId":1,"unitId":1,"quantity":1,"ingredientName":"Chicken","unitName":""},{"ingredientId":2,"unitId":2,"quantity":2,"ingredientName":"Chicken Stock","unitName":"oz"}],"tags": ["Chicken"], "likes": 0, "created_at": new Date()}
];

const testRecipesShort: { id: number, title: string, summary: string, imageUrl: string | null, likes: number, tags: string[], created_at?: Date | null}[] = [
  {"id": testRecipes[0].id, "title": testRecipes[0].title, "summary": testRecipes[0].summary, "imageUrl": testRecipes[0].imageUrl, "likes": testRecipes[0].likes, "tags": testRecipes[0].tags},
  {"id": testRecipes[1].id, "title": testRecipes[1].title, "summary": testRecipes[1].summary, "imageUrl": testRecipes[1].imageUrl, "likes": testRecipes[1].likes, "tags": testRecipes[1].tags},
  {"id": testRecipes[2].id, "title": testRecipes[2].title, "summary": testRecipes[2].summary, "imageUrl": testRecipes[2].imageUrl, "likes": testRecipes[2].likes, "tags": testRecipes[2].tags}
]

const testIngredients: RecipeIngredient[] = [
  testRecipes[0].ingredients[0],
  testRecipes[0].ingredients[1],
  testRecipes[1].ingredients[0],
  testRecipes[1].ingredients[1],
  testRecipes[2].ingredients[0],
  testRecipes[2].ingredients[1],
]

const testLikes: {userId: number, recipeId: number}[] = [
  {"recipeId": 2, "userId": 1293912030989},
  {"recipeId": 2, "userId": 8912830912312},
  {"recipeId": 3, "userId": 2091380123092},
  {"recipeId": 3, "userId": 2190301293890},
  {"recipeId": 3, "userId": 3248329048093},
]

axios.defaults.baseURL = `http://localhost:${PORT}/api/`;

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(DUMMY_PORT, () => done());
});

beforeEach((done) => {
  console.log(axios.defaults.baseURL)
  initTest().then(() => {
    recipeService
      .addRecipe(testRecipes[0].title, testRecipes[0].summary, testRecipes[0].instructions, testRecipes[0].servings, testRecipes[0].imageUrl, testRecipes[0].videoUrl)
      .then(() => recipeService.addRecipe(testRecipes[1].title, testRecipes[1].summary, testRecipes[1].instructions, testRecipes[1].servings, testRecipes[1].imageUrl, testRecipes[1].videoUrl))
      .then(() => recipeService.addRecipe(testRecipes[2].title, testRecipes[2].summary, testRecipes[2].instructions, testRecipes[2].servings, testRecipes[2].imageUrl, testRecipes[2].videoUrl))
      
      //Add recipe tags
      .then(() => recipeService.addRecipeTag(1,testRecipes[0].tags[0]))
      .then(() => recipeService.addRecipeTag(1,testRecipes[0].tags[1]))
      .then(() => recipeService.addRecipeTag(1,testRecipes[0].tags[2]))
      .then(() => recipeService.addRecipeTag(2,testRecipes[1].tags[0]))
      .then(() => recipeService.addRecipeTag(3,testRecipes[2].tags[0]))

      //Add ingredients
      .then(() => recipeService.addIngredient(testIngredients[0].ingredientName))
      .then(() => recipeService.addIngredient(testIngredients[1].ingredientName))
      .then(() => recipeService.addIngredient(testIngredients[2].ingredientName))
      .then(() => recipeService.addIngredient(testIngredients[3].ingredientName))
      .then(() => recipeService.addIngredient(testIngredients[4].ingredientName))
      .then(() => recipeService.addIngredient(testIngredients[5].ingredientName))

      //Add units
      .then(() => recipeService.addUnit(testRecipes[0].ingredients[0].unitName))
      .then(() => recipeService.addUnit(testRecipes[0].ingredients[1].unitName))
      .then(() => recipeService.addUnit(testRecipes[1].ingredients[0].unitName))
      .then(() => recipeService.addUnit(testRecipes[1].ingredients[1].unitName))
      .then(() => recipeService.addUnit(testRecipes[2].ingredients[0].unitName))
      .then(() => recipeService.addUnit(testRecipes[2].ingredients[1].unitName))

      //Add recipe ingredients
      .then(() => recipeService.addRecipeIngredient(testRecipes[0].id, 1, 1, testRecipes[0].ingredients[0].quantity))
      .then(() => recipeService.addRecipeIngredient(testRecipes[0].id, 2, 2, testRecipes[0].ingredients[1].quantity))
      .then(() => recipeService.addRecipeIngredient(testRecipes[1].id, 3, 3, testRecipes[1].ingredients[0].quantity))
      .then(() => recipeService.addRecipeIngredient(testRecipes[1].id, 4, 4, testRecipes[1].ingredients[1].quantity))
      .then(() => recipeService.addRecipeIngredient(testRecipes[2].id, 5, 5, testRecipes[2].ingredients[0].quantity))
      .then(() => recipeService.addRecipeIngredient(testRecipes[2].id, 6, 6, testRecipes[2].ingredients[1].quantity))

      // //Add likes
      // .then(() => recipeService.addLike(testLikes[0].recipeId, testLikes[0].userId))
      // .then(() => recipeService.addLike(testLikes[1].recipeId, testLikes[1].userId))
      // .then(() => recipeService.addLike(testLikes[2].recipeId, testLikes[2].userId))
      // .then(() => recipeService.addLike(testLikes[3].recipeId, testLikes[3].userId))
      // .then(() => recipeService.addLike(testLikes[4].recipeId, testLikes[4].userId))
      .then(() => done())
  })
  // Delete all tasks, and reset id auto-increment start value
  // TODO: use the existing "initdb" functions

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => done());
});

test('Default message works (GET)', () => {
  axios.get('/').then((response) => {
    response.data = 'Hello World! You have reached the Recipe API server. Did you mean to go <a href="/">home</a>?'
  })
})

describe('Fetch recipes (GET)', () => {
  test('Fetch all recipes (200 OK)', (done) => {
    axios.get('/recipes').then((response) => {
      expect(response.status).toEqual(200);
      let expected = testRecipesShort
      console.log(expected)
      for (let i = 0; i < response.data.length; i++) {expected[`${i}`].created_at = response.data[i].created_at}
      expect(response.data).toEqual(expected);
      for (let i = 0; i < response.data.length; i++) {delete(expected[`${i}`].created_at)}
      done();
    });
  });

  test('Fetch recipe (200 OK)', (done) => {
    axios.get('/recipes/1').then((response) => {
      expect(response.status).toEqual(200);
      response.data.created_at = testRecipes[0].created_at
      expect(response.data).toEqual(testRecipes[0]);
      done();
    });
  });

  test('Fetch task (404 Not Found)', (done) => {
    axios
      .get('/recipes/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        // expect(error.message).toEqual('Recipe not found');
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Fetch ingredients (GET)', () => {
  test('Fetch all ingredients (200 OK)', (done) => {
    axios.get('/ingredients').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testIngredients);
      done();
    });
  });
});

describe('Search recipes (GET)', () => {
  test('Search for chicken (200 OK)', (done) => {
    axios.get('/search?q=chicken').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipesShort[2]])
      done()
    })
  })

  test('Empty query (400 Bad request)', (done) => {
    axios.get('/search?q=').then((response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        // expect(error.message).toEqual('Bad request');
        done();
      });
  });

  test('Short query (400 Bad Request)', (done) => {
    axios.get('/search?q=ca').then((response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        // expect(error.message).toEqual('Bad query');
        done();
      });
  });
})

