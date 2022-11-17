import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import app, { server } from '..';
import userService from '../services/user-service';
import recipeService from '../services/recipe-service';
import { initTest } from '../utils/initdb'
import { strategy } from '../routers/auth-router';

import type { RecipeIngredient } from '../models/RecipeIngredient';
import type { Recipe } from '../models/Recipe';
import type { Ingredient } from '../models/Ingredient';
import type { User } from '../models/User';
import type { UserProfile } from '../models/UserProfile';

const PORT = Number(process.env.PORT) || 3000;

const jar = new CookieJar();
const axs = wrapper(axios.create({ jar }));

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

const testRecipeIngredients: RecipeIngredient[] = [
  testRecipes[0].ingredients[0],
  testRecipes[0].ingredients[1],
  testRecipes[1].ingredients[0],
  testRecipes[1].ingredients[1],
  testRecipes[2].ingredients[0],
  testRecipes[2].ingredients[1],
]

const testIngredients: Ingredient[] = [
  {"id": 1, "name": testRecipes[0].ingredients[0].ingredientName},
  {"id": 2, "name": testRecipes[0].ingredients[1].ingredientName},
  {"id": 3, "name": testRecipes[1].ingredients[0].ingredientName},
  {"id": 4, "name": testRecipes[1].ingredients[1].ingredientName},
  {"id": 5, "name": testRecipes[2].ingredients[0].ingredientName},
  {"id": 6, "name": testRecipes[2].ingredients[1].ingredientName},
]

const testUsers: User[] = [
    {"googleId": "29130921380099" , "name": "testUser", "email": "testuser@example.com", "picture": "image1.jpg", "isadmin": false, "likes": [], "shoppingList": []},
    {"googleId": "89327493284798" , "name": "testAdmin", "email": "testadmin@example.com", "picture": "image2.jpg", "isadmin": true, "likes": [], "shoppingList": []},
]

const testUserProfiles: UserProfile[] = testUsers.map(user =>
  ({
    id: user.googleId,
    displayName: user.name,
    emails: [{value: user.email}],
    photos: [{value: user.picture}]
  } as UserProfile)
);

axs.defaults.baseURL = `http://localhost:${PORT}/api/`;
axs.defaults.withCredentials = true;

beforeEach((done) => {
  initTest().then(() => {
    recipeService.addRecipe(testRecipes[0].title, testRecipes[0].summary, testRecipes[0].instructions, testRecipes[0].servings, testRecipes[0].imageUrl, testRecipes[0].videoUrl)
      .then(() => recipeService.addRecipe(testRecipes[1].title, testRecipes[1].summary, testRecipes[1].instructions, testRecipes[1].servings, testRecipes[1].imageUrl, testRecipes[1].videoUrl))
      .then(() => recipeService.addRecipe(testRecipes[2].title, testRecipes[2].summary, testRecipes[2].instructions, testRecipes[2].servings, testRecipes[2].imageUrl, testRecipes[2].videoUrl))
      
      //Add recipe tags
      .then(() => recipeService.addRecipeTag(1,testTags[0].name))
      .then(() => recipeService.addRecipeTag(1,testTags[1].name))
      .then(() => recipeService.addRecipeTag(1,testTags[2].name))
      .then(() => recipeService.addRecipeTag(2,testTags[3].name))
      .then(() => recipeService.addRecipeTag(3,testTags[4].name))

      //Add ingredients
      .then(() => recipeService.addIngredient(testRecipeIngredients[0].ingredientName))
      .then(() => recipeService.addIngredient(testRecipeIngredients[1].ingredientName))
      .then(() => recipeService.addIngredient(testRecipeIngredients[2].ingredientName))
      .then(() => recipeService.addIngredient(testRecipeIngredients[3].ingredientName))
      .then(() => recipeService.addIngredient(testRecipeIngredients[4].ingredientName))
      .then(() => recipeService.addIngredient(testRecipeIngredients[5].ingredientName))

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

      // Register the admin user
      .then(() => userService.findOrCreate(testUserProfiles[1]))
      .then(() => userService.setAdmin(testUserProfiles[1].id, true))
 
      .then(() => done())
  })    
})

// Stop web server and close connection to MySQL server
afterAll((done) => {
  server.close()
  done()
});

test("GET /api/auth/profile without login (200 OK)", (done) => {
    axs.get(`/auth/profile`, {withCredentials: true}).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(false);
        done();
    });
});

test("Register new test user", (done) => {
  // Test a user that is not registered
  strategy.setProfile(testUserProfiles[0]);

  axs.get(`/auth/google/callback`, {withCredentials: true}).then((cb_response) => {
    expect(cb_response.status).toEqual(200);

    axs.get("/auth/profile", {withCredentials: true}).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers[0]);
      done();
    });
  });
});

test("Sign in with existing admin user", (done) => {
  // Test an existing user and their admin status
  strategy.setProfile(testUserProfiles[1]);
  axs.get(`/auth/google/callback`, {withCredentials: true}).then((cb_response) => {
    expect(cb_response.status).toEqual(200);

    axs.get("/auth/profile", {withCredentials: true}).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers[1]);
      done();
    });
  });
});