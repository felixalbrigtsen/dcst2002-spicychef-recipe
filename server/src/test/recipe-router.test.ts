import axios from "axios";
import app from "..";
import pool from "../mysql-pool";
import { Recipe } from "../models/Recipe";
import { Ingredient } from "../models/Ingredient";
import recipeService from "../services/recipe-service";
import { initTest } from "../utils/initdb";
import { RecipeIngredient } from "../models/RecipeIngredient";
import { server } from "..";
import mealdbService from "../services/mealdb-service";

const PORT = Number(process.env.PORT) || 3000;

const testRecipes: Recipe[] = [
  {
    id: 1,
    title: "Tunisian Lamb Soup",
    summary: "Meal from MealDB",
    instructions: "Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.",
    servings: 2,
    imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",
    videoUrl: "https://www.youtube.com/watch?v=w1qgTQmLRe4",
    created_at: new Date(),
    likes: 0,
    tags: ["Lamb", "Soup", "Tunisian"],
    ingredients: [
      { ingredientId: 1, unitId: 1, quantity: 1, ingredientName: "Lamb Mince", unitName: "kg" },
      { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Garlic", unitName: "cloves minced" },
    ],
  },
  {
    id: 2,
    title: "Lasagna",
    summary: "Self-created meal",
    servings: 2,
    instructions: "Garfield",
    imageUrl: "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/",
    videoUrl: "https://www.youtube.com/watch?v=qvc4DMiioRc",
    ingredients: [
      { ingredientId: 1, unitId: 1, quantity: 200, ingredientName: "Pasta", unitName: "g" },
      { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Milk", unitName: "dl" },
    ],
    tags: ["Italian"],
    likes: 0,
    created_at: new Date(),
  },
  {
    id: 3,
    title: "Chicken Soup",
    summary: "SOUP",
    servings: 4,
    instructions: "Boil",
    imageUrl: "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/1:1/w_2240,c_limit/RoastChicken_RECIPE_080420_37993.jpg",
    videoUrl: "https://www.youtube.com/watch?v=rX184PQ1UMI",
    ingredients: [
      { ingredientId: 1, unitId: 1, quantity: 1, ingredientName: "Chicken", unitName: "" },
      { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Chicken Stock", unitName: "oz" },
    ],
    tags: ["Chicken"],
    likes: 0,
    created_at: new Date(),
  },
];

const testRecipesShort = testRecipes.map(({ id, title, summary, imageUrl, likes, tags, created_at }: Recipe) => ({ id, title, summary, imageUrl, likes, tags, created_at }));

const testRecipeIngredients: RecipeIngredient[] = testRecipes.map((recipe) => recipe.ingredients).flat();

// All tags as an array of objects
const testTags = testRecipes
  .map((recipe) => recipe.tags)
  .flat()
  .map((tag) => ({ name: tag }));

const testIngredients: Ingredient[] = [
  { id: 1, name: testRecipes[0].ingredients[0].ingredientName },
  { id: 2, name: testRecipes[0].ingredients[1].ingredientName },
  { id: 3, name: testRecipes[1].ingredients[0].ingredientName },
  { id: 4, name: testRecipes[1].ingredients[1].ingredientName },
  { id: 5, name: testRecipes[2].ingredients[0].ingredientName },
  { id: 6, name: testRecipes[2].ingredients[1].ingredientName },
];

axios.defaults.baseURL = `http://localhost:${PORT}/api/`;

beforeEach((done) => {
  initTest().then(() => {
    recipeService
      .addRecipe(testRecipes[0].title, testRecipes[0].summary, testRecipes[0].instructions, testRecipes[0].servings, testRecipes[0].imageUrl, testRecipes[0].videoUrl)
      .then(() => recipeService.addRecipe(testRecipes[1].title, testRecipes[1].summary, testRecipes[1].instructions, testRecipes[1].servings, testRecipes[1].imageUrl, testRecipes[1].videoUrl))
      .then(() => recipeService.addRecipe(testRecipes[2].title, testRecipes[2].summary, testRecipes[2].instructions, testRecipes[2].servings, testRecipes[2].imageUrl, testRecipes[2].videoUrl))

      //Add recipe tags
      .then(() => recipeService.addRecipeTag(1, testTags[0].name))
      .then(() => recipeService.addRecipeTag(1, testTags[1].name))
      .then(() => recipeService.addRecipeTag(1, testTags[2].name))
      .then(() => recipeService.addRecipeTag(2, testTags[3].name))
      .then(() => recipeService.addRecipeTag(3, testTags[4].name))

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
      .then(() => done());
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  server.close();
  pool.end();
  done();
});

test("Default message works (GET)", () => {
  axios.get("/").then((response) => {
    response.data = 'Hello World! You have reached the Recipe API server. Did you mean to go <a href="/">home</a>?';
  });
});

describe("Get recipes (GET)", () => {
  test("Get all recipes (200)", (done) => {
    axios.get("/recipes").then((response) => {
      expect(response.status).toEqual(200);
      let expected = testRecipesShort;
      for (let i = 0; i < response.data.length; i++) {
        expected[`${i}`].created_at = response.data[i].created_at;
      }
      expect(response.data).toEqual(expected);
      for (let i = 0; i < response.data.length; i++) {
        // @ts-expect-error
        delete expected[i].created_at;
      }
      done();
    });
  });

  test("Get recipe (200)", (done) => {
    axios.get("/recipes/1").then((response) => {
      expect(response.status).toEqual(200);
      response.data.created_at = testRecipes[0].created_at;
      expect(response.data).toEqual(testRecipes[0]);
      done();
    });
  });

  test("Get recipe that is not a number (400)", (done) => {
    axios
      .get('/recipes/"text"')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual("Bad request");
        done();
      });
  });

  test("Get recipe that doesnt exist (404)", (done) => {
    axios
      .get("/recipes/4")
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(404);
        expect(error.response.data).toEqual("Recipe not found");
        done();
      });
  });
});

describe("Get recipes with specified parameters (200)", () => {
  test("Get recipe with all of certain ingredients (200)", (done) => {
    axios.get(`/recipes/?ingredients=${encodeURIComponent("3,4")}&mode=all`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipesShort[1]]);
      done();
    });
  })

  test("Get recipes with any of certain ingredients (200)", (done) => {
    axios.get(`/recipes/?ingredients=${encodeURIComponent("1")}&mode=any`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipesShort[0]]);
      done();
    });
  })

  test("Get recipes with invalid ingredient id (400)", (done) => {
    axios
      .get(`/recipes/?ingredients=${encodeURIComponent("1,text")}&mode=any`)
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual("Invalid ingredient id");
        done();
      });
  });

  test("Get recipes with invalid mode (400)", (done) => {
    axios
      .get(`/recipes/?ingredients=${encodeURIComponent("1,2")}&mode=wrong`)
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual("Invalid mode");
        done();
      });
  });
})

describe("Get ingredients (GET)", () => {
  test("Get all ingredients (200)", (done) => {
    axios.get("/ingredients").then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testIngredients);
      // expect(response.data).toEqual(testRecipes.map(r => r.ingredients).flat().map(i => {return {name: i.ingredientName, id: i.ingredientId}}));
      done();
    });
  });
});

describe("Search recipes (GET)", () => {
  test("Search for chicken (200)", (done) => {
    axios.get("/search?q=chicken").then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipesShort[2]]);
      done();
    });
  });

  test("Empty query (400)", (done) => {
    axios
      .get("/search?q=")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual("Bad request");
        done();
      });
  });

  test("Short query (400)", (done) => {
    axios
      .get("/search?q=ca")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual("Bad query");
        done();
      });
  });
});

describe("Get tags (GET)", () => {
  test("Get all tags (200)", (done) => {
    axios.get("/tags").then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTags);
      done();
    });
  });
});

/* 
The below tests test the endpoints requiring authorization (either login or admin).
These are expected to fail without authorization.
Tests of the services working WITH authorization can be found in router-user.test.ts and router-admin.test.ts
*/

describe("Endpoints requiring authorization handle unauthorized requests", () => {
  test("Post like (403)", (done) => {
    axios
      .post("/likes/1")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data).toEqual("Forbidden");
        done();
      });
  });

  test("Post like (403)", (done) => {
    axios
      .delete("/likes/1")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data).toEqual("Forbidden");
        done();
      });
  });

  test("Post shopping list item (403)", (done) => {
    axios
      .post("/list/1")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data).toEqual("Forbidden");
        done();
      });
  });

  test("Delete item from shopping list (403)", (done) => {
    axios
      .delete("/list/1")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data).toEqual("Forbidden");
        done();
      });
  });

  test("PUT edit a recipe (403)", (done) => {
    axios
      .put("/recipes/1")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data).toEqual("Forbidden");
        done();
      });
  });

  test("POST create new recipe (403)", (done) => {
    axios
      .post("/recipes")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data).toEqual("Forbidden");
        done();
      });
  });

  test("DELETE delete a recipe (403)", (done) => {
    axios
      .delete("/recipes/1")
      .then(() => done(new Error()))
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data).toEqual("Forbidden");
        done();
      });
  });
});

test("Test the one service used in utils, but not in any endpoints", (done) => {
  mealdbService.getRandomMeal().then((result) => {
    expect(result).toHaveProperty("idMeal")
    expect(Number(result.idMeal)).toBeGreaterThan(0)
    expect(result).toHaveProperty("title")
    expect(result.title.length).toBeGreaterThan(0)
    done()
  })
})

test("Server error handling from prod (500)", (done) => {
  pool.end()
  axios.get("/recipes")
    .then(() => done(new Error()))
    .then((_response) => done(new Error()))
    .catch((error) => {
      expect(error.response.status).toEqual(500);
      expect(error.response.data).toEqual("Internal server error");
      done();
    });
})


