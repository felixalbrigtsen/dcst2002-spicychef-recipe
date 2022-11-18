import axios from 'axios';
import app from '..';
import pool from '../mysql-pool';
import { Recipe } from '../models/Recipe';
import { Ingredient } from '../models/Ingredient';
import recipeService from '../services/recipe-service';
import { initTest } from '../utils/initdb'
import { RecipeIngredient } from '../models/RecipeIngredient';
import { server } from '..';
import { loginUser,jar,testUsers,testUserProfiles,axs } from './mock-utils';
import userService from '../services/user-service';

const PORT = Number(process.env.PORT) || 3000;

const testRecipes: Recipe[] = [
    {"id": 1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":new Date(),"likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients": [{"ingredientId":1,"unitId":1,"quantity":1,"ingredientName":"Lamb Mince","unitName":"kg"},{"ingredientId":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]},
    {"id": 2,"title": "Lasagna","summary": "Self-created meal","servings": 2,"instructions": "Garfield","imageUrl": "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/","videoUrl": "https://www.youtube.com/watch?v=qvc4DMiioRc","ingredients": [{"ingredientId":1,"unitId":1,"quantity":200,"ingredientName":"Pasta","unitName":"g"},{"ingredientId":2,"unitId":2,"quantity":2,"ingredientName":"Milk","unitName":"dl"}],"tags": ["Italian"], "likes": 0, "created_at": new Date()},
];

const testRecipeIngredients: RecipeIngredient[] = [
  testRecipes[0].ingredients[0],
  testRecipes[0].ingredients[1],
]

const testLikes: {recipeId: number, userId: string}[] = [
  {"recipeId": 1, "userId": testUsers[0].googleId},
]

axs.defaults.baseURL = `http://localhost:${PORT}/api/`;
axs.defaults.withCredentials = true;

beforeEach((done) => {
  initTest().then(() => {
    userService.findOrCreate(testUserProfiles[0])
      .then(() => loginUser(testUserProfiles[0]))

      //Add recipes
      .then(() => recipeService.addRecipe(testRecipes[0].title, testRecipes[0].summary, testRecipes[0].instructions, testRecipes[0].servings, testRecipes[0].imageUrl, testRecipes[0].videoUrl))
      .then(() => recipeService.addRecipe(testRecipes[1].title, testRecipes[1].summary, testRecipes[1].instructions, testRecipes[1].servings, testRecipes[1].imageUrl, testRecipes[1].videoUrl))

      //Add ingredients
      .then(() => recipeService.addIngredient(testRecipeIngredients[0].ingredientName))
      .then(() => recipeService.addIngredient(testRecipeIngredients[1].ingredientName))

      //Add like (to delete)
      .then(() => recipeService.addLike(2, testUsers[0].googleId))
      //Add ingredient to list (to delete)
      .then(() => recipeService.addIngredientToList(2, testUsers[0].googleId))
      .then(() => done())
  })    
})

// Stop web server and close connection to MySQL server
afterAll((done) => {
  server.close()
  pool.end();
  done()
});

describe("Like recipes", () => {
    test("Like a recipe (200)", (done) => {
        axs.post(`/likes/${testLikes[0].recipeId}`).then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual("OK")
            done()
          })
    })

    test("Like recipe with text as id (400)", (done) =>{
        axs.post('/likes/text').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            console.log
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request');
            done();
        });
    })

    test("Like recipe that doesnt exist (400)", (done) =>{
        axs.post('/likes/8').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data).toEqual('Recipe not found');
            done();
        });
    })
})

describe("Delete likes", () => {
    test("Like a recipe (200)", (done) => {
        axs.delete(`/likes/2`).then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual("OK")
            done()
          })
    })

    test("Like recipe with text as id (400)", (done) =>{
        axs.delete('/likes/text').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            console.log
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request');
            done();
        });
    })

    test("Like recipe that doesnt exist (400)", (done) =>{
        axs.delete('/likes/8').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data).toEqual('Recipe not found');
            done();
        });
    })
})

describe("Add ingredients to shopping list", () => {
    test("Add ingredient (200)", (done) => {
        axs.post(`/list/1`).then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual("OK")
            done()
          })
    })

    test("Delete ingredient with text as id (400)", (done) =>{
        axs.post('/list/text').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            console.log
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request');
            done();
        });
    })

    test("Delete list item that doesnt exist (400)", (done) =>{
        axs.post('/list/8').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data).toEqual('Ingredient not found');
            done();
        });
    })
})

describe("Delete ingredients shopping list", () => {
    test("Delete ingredient (200)", (done) => {
        axs.delete(`/list/2`).then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual("OK")
            done()
          })
    })

    test("Delete ingredient with text as id (400)", (done) =>{
        axs.delete('/list/text').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            console.log
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request');
            done();
        });
    })

    test("Delete list item that doesnt exist (400)", (done) =>{
        axs.delete('/list/8').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data).toEqual('Ingredient not found');
            done();
        });
    })
})
