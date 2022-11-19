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

interface BadRecipe {
    id: any;
    title: any;
    summary: any;
    instructions: any;
    servings: any;
    imageUrl: any; 
    videoUrl: any; 
    created_at:any; 
    ingredients: any; 
    tags: any;
    likes: any;
}

const testBadRecipe: BadRecipe = {"id": 1,"title":"Bad Recipe","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":new Date(),"likes":0,"tags":["Lamb","Soup","Tunisian","bad"],"ingredients": [{"ingredientName":"Lamb Mince","quantity":1,"unitName":"kg"},{"ingredientName":"Garlic","quantity":2,"unitName":"cloves minced"},{"ingredientName":"Bad Ingredient","quantity":1,"unitName":"units"}]}

const testRecipeIngredients: RecipeIngredient[] = [
  testRecipes[0].ingredients[0],
  testRecipes[0].ingredients[1],
]

const testLikes: {recipeId: number, userId: string}[] = [
  {"recipeId": 1, "userId": testUsers[1].googleId},
]

axs.defaults.baseURL = `http://localhost:${PORT}/api/`;
axs.defaults.withCredentials = true;

beforeAll((done) => {
    userService.findOrCreate(testUserProfiles[1])
      .then(() => userService.setAdmin(testUserProfiles[1].id, true))
      .then(() => loginUser(testUserProfiles[1]))
      .then(() => done())
})

beforeEach((done) => {
  initTest().then(() => {
    userService.findOrCreate(testUserProfiles[1])
      .then(() => userService.setAdmin(testUserProfiles[1].id, true))

      //Add recipes
      .then(() => recipeService.addRecipe(testRecipes[0].title, testRecipes[0].summary, testRecipes[0].instructions, testRecipes[0].servings, testRecipes[0].imageUrl, testRecipes[0].videoUrl))
      .then(() => recipeService.addRecipe(testRecipes[1].title, testRecipes[1].summary, testRecipes[1].instructions, testRecipes[1].servings, testRecipes[1].imageUrl, testRecipes[1].videoUrl))

      //Add ingredients
      .then(() => recipeService.addIngredient(testRecipeIngredients[0].ingredientName))
      .then(() => recipeService.addIngredient(testRecipeIngredients[1].ingredientName))

      //Add like (to delete)
      .then(() => recipeService.addLike(2, testUsers[1].googleId))
      //Add ingredient to list (to delete)
      .then(() => recipeService.addIngredientToList(2, testUsers[1].googleId))
      .then(() => done())
  })
})

// Stop web server and close connection to MySQL server
afterAll((done) => {
  server.close()
  pool.end();
  done()
});

describe("Edit a recipe", () => {
    test("Edit a recipe (200)", (done) => {
        axs.put("/recipes/1", testRecipes[1]).then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual("OK")
            done()
          })
          .catch((error) => console.log(error))
    })

    test("Edit recipe with text as id (400)", (done) =>{
        axs.put('/recipes/text').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request');
            done();
        });
    })

    test("Edit recipe that doesnt exist (404)", (done) =>{
        axs.put('/recipes/8').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data).toEqual('Recipe not found');
            done();
        });
    })

    test("Edit recipe missing a property (400)", (done) =>{
        testBadRecipe.title = ""
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, missing property');
            done();
        })
        .then(() => testBadRecipe.title = "Bad Recipe")
    })    

    test("Edit recipe with too short title (400)", (done) =>{
        testBadRecipe.title = "a"
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, title must be between 3 and 100 characters');
            done();
        })
        .then(() => testBadRecipe.title = "Bad Recipe")
    })   

    test("Edit recipe with too short instructions (400)", (done) =>{
        testBadRecipe.instructions="b"
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, instructions must be between 3 and 10000 characters');
            done();
        })
        .then(() => testBadRecipe.instructions="Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.")
    })   

    test("Edit recipe with ingredientitem missing property (400)", (done) =>{
        testBadRecipe.ingredients[2].ingredientName=""
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, missing ingredient property');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].ingredientName="Bad ingredient")
    })  
    
    test("Edit recipe with ingredientitem with text as quantity (400)", (done) => {
        testBadRecipe.ingredients[2].quantity="text"
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, quantity must be a number');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].quantity=1)
    })   

    test("Edit recipe with ingredientitem with negative quantity (400)", (done) =>{
        testBadRecipe.ingredients[2].quantity=-1
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, quantity must be positive');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].quantity=1)
    })   

    test("Edit recipe with ingredientitem with unitname longer than 20 characters (400)", (done) =>{
        testBadRecipe.ingredients[2].unitName="This is more than 20 characters"
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, unit name must be less than 20 characters');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].unitName="units")
    })   

    test("Edit recipe with ingredientitem with ingredient name longer than 20 characters (400)", (done) =>{
        testBadRecipe.ingredients[2].ingredientName="This is more than 100 characters, i dont know how useful this test is, but I am doing it anyway, because I can. If you read this, I hope you have a great day!"
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, ingredient name must be less than 100 characters');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].ingredientName="units")
    })   

    test("Edit recipe with tag with more than 20 characters (400)", (done) =>{
        testBadRecipe.tags[3]="This is more than 20 characters"
        axs.put('/recipes/1', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, ingredient tag must be less than 20 characters');
            done();
        })
        .then(() => testBadRecipe.tags[0]="bad")
    })   
})

describe("Add a recipe", () => {
    test("Add a recipe (200)", (done) => {
        axs.post("/recipes", testRecipes[1]).then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual("OK")
            done()
          })
          .catch((error) => console.log(error))
    })

    test("Add recipe missing a property (400)", (done) =>{
        testBadRecipe.title = ""
        axs.post('/recipes', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, missing property');
            done();
        })
        .then(() => testBadRecipe.title = "Bad Recipe")
    })    

    test("Add recipe with too short title (400)", (done) =>{
        testBadRecipe.title = "a"
        axs.post('/recipes', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, title must be between 3 and 100 characters');
            done();
        })
        .then(() => testBadRecipe.title = "Bad Recipe")
    })

    test("Add recipe with too short instructions (400)", (done) =>{
        testBadRecipe.instructions="b"
        axs.post('/recipes', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, instructions must be between 3 and 10000 characters');
            done();
        })
        .then(() => testBadRecipe.instructions="Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.")
    })   

    test("Add recipe with ingredientitem missing property (400)", (done) =>{
        testBadRecipe.ingredients[2].ingredientName=""
        axs.post('/recipes', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, missing ingredient property');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].ingredientName="Bad ingredient")
    })  
    
    test("Add recipe with ingredientitem with text as quantity (400)", (done) => {
        testBadRecipe.ingredients[2].quantity="text"
        axs.post('/recipes', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, quantity must be a number');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].quantity=1)
    })   

    test("Add recipe with ingredientitem with negative quantity (400)", (done) =>{
        testBadRecipe.ingredients[2].quantity=-1
        axs.post('/recipes', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, quantity must be positive');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].quantity=1)
    })   

    test("Add recipe with ingredientitem with unitname longer than 20 characters (400)", (done) =>{
        testBadRecipe.ingredients[2].unitName="This is more than 20 characters"
        axs.post('/recipes', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, unit name must be less than 20 characters');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].unitName="units")
    })   

    test("Add recipe with ingredientitem with ingredient name longer than 20 characters (400)", (done) =>{
        testBadRecipe.ingredients[2].ingredientName="This is more than 100 characters, i dont know how useful this test is, but I am doing it anyway, because I can. If you read this, I hope you have a great day!"
        axs.post('/recipes', testBadRecipe).then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, ingredient name must be less than 100 characters');
            done();
        })
        .then(() => testBadRecipe.ingredients[2].ingredientName="units")
    })   
})

describe("Delete a recipe", () => {
    test("Delete a recipe (200)", (done) => {
        axs.delete("/recipes/2").then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual("OK")
            done()
          })
    })

    test("Delete recipe with text as id (400)", (done) =>{
        axs.delete('/recipes/text').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            console.log
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request');
            done();
        });
    })

    test("Like recipe that doesnt exist (404)", (done) =>{
        axs.delete('/recipes/8').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data).toEqual('Recipe not found');
            done();
        });
    })
})

describe("Import mealdb recipes", () => {
    test("Import recipe (200)", (done) => {
        axs.post(`/importrecipe/52772`).then((response) => {
            expect(response.status).toEqual(200)
            expect(response.data).toEqual("OK")
            done()
          })
          .catch((error) => console.log(error))
    })

    test("Import recipe text as id (400)", (done) => {
        axs.post('/importrecipe/text').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(400)
            expect(error.response.data).toEqual('Bad request, invalid ID');
            done();
        });
    })

    test("Import recipe that doesnt exist (404)", (done) => {
        axs.post('/importrecipe/999999').then(() => done(new Error()))
        .then((_response) => done(new Error()))
        .catch((error) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data).toEqual('Meal not found');
            done();
        });
    })
})

