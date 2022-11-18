/** Express router providing recipe related routes and dispatching 
 * @module recipe-router
 */

import express from 'express';
import recipeService from '../services/recipe-service';
import mealdbService from '../services/mealdb-service';
import authRouter from './auth-router';

import type { Recipe } from '../models/Recipe';
import { requireLogin, requireAdmin, refreshLogin } from './auth-router';

const router = express.Router();
export default router;

const ignoredErrors = ['ER_DUP_ENTRY', 'ER_NO_REFERENCED_ROW_2'];

router.use('/auth', authRouter);

router.use(express.json());

router.get('/' , (req, res) => {
  res.send('Hello World! You have reached the Recipe API server. Did you mean to go <a href="/">home</a>?');
});

function handleServerError(res: any, err: any) {
  if (!err.code || !ignoredErrors.includes(err.code)) {
    console.error(err);
  }
  
  if (process.env.DEBUG === 'true') {
    res.status(500).send(err);
    return;
  }

  if (err.code && err.code === 'ER_DUP_ENTRY') {
    res.status(400).send('Entry already exists');
    return;
  }
  res.status(500).send('Internal server error');
}

/**
 * @name GET /recipes
 * @function
 * @memberof module:recipe-router
 *
 * @description 
 * Get all recipes, optionally filtered by ingredient.
 *
 * @param {string} [mode] - 'all' or 'any' (default: 'all')
 * @param {string} [ingredients] - comma-separated list of ingredient ids
 *
 * @returns {Recipe[]} Array of Recipes in short form (no instructions or ingredients)
 * @throws {Error} 500 If there is a database error
 * @example
 * GET /recipes
 * 
 */
router.get('/recipes' , (req, res) => {
  const mode = req.query.mode as string || 'all';
  const ingredients = req.query.ingredients as string || '';

  if (ingredients !== '') {
    const ingredientList = [ ...new Set(ingredients.split(',')) ].map((id: string) => parseInt(id));

    // Verify that all ingredients are valid numbers
    if (ingredientList.some((id: number) => isNaN(id))) {
      res.status(400).send('Invalid ingredient id');
      return;
    }
    
    if (mode !== 'all' && mode !== 'any') {
      res.status(400).send('Invalid mode');
      return;
    }

    if (mode === 'all') {
      recipeService.getRecipesWithAllIngredients(ingredientList)
        .then((recipes) => res.send(recipes))
        .catch((err: any) => handleServerError(res, err));
    } else {
      recipeService.getRecipesWithAnyIngredients(ingredientList)
        .then((recipes) => res.send(recipes))
        .catch((err: any) => handleServerError(res, err));
    }

    return;
  }

  recipeService.getAllRecipesShort()
    .then((recipes) => {
      res.send(recipes);
    })
    .catch((err) => handleServerError(res, err));
  
});

/**
 * Get a recipe by ID
 * @name Get /recipes/:id
 * @function
 * @memberof module:recipe-router
 *
 * @param {number} id - The ID of the recipe to get
 * @returns {Recipe} The recipe with the given ID
 * @throws {Error} 404 If the recipe with the given ID does not exist
 * @throws {Error} 400 If the ID is not a number
 * @throws {Error} 500 If there is a database error
 * @example
 * GET /recipes/1
 */
router.get('/recipes/:id' , (req, res) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).send('Bad request');
    return;
  }
  
  recipeService.getRecipeFull(id)
    .then((recipe) => {
      if (recipe) {
        res.json(recipe);
      } else {
        res.status(404).send('Recipe not found');
      }

    })
    .catch((err) => {
      handleServerError(res, err);
    });
});

/**
 * @name GET /ingredients
 * @function
 * @memberof module:recipe-router
 *
 * @throws {error} 500 if there is a database error
 *
 * @description
 * Returns a json formatted list of all ingredients
 * @returns {Ingredient[]}
 */
router.get('/ingredients' , (req, res) => {
  recipeService.getIngredients().then((ingredients) => {
    res.json(ingredients);
  })
  .catch((err) => {
    handleServerError(res, err);
  });
});

/**
 * @name GET /tags
 * @function
 * @memberof module:recipe-router
 *
 * @throws {error} 500 if there is a database error
 *
 * @description
 * Returns a json formatted list of all ingredients
 * @returns {string[]}
 */
 router.get('/tags' , (req, res) => {
  recipeService.getTags().then((tags) => {
    res.json(tags);
  })
  .catch((err) => {
    handleServerError(res, err);
  });
});

/**
 * @name Get /search?q=
 * @function
 * @memberof module:recipe-router
 *
 * @param {string} q - URI encoded search term, length 3-100
 * @returns {Recipe[]} Array of recipes, which names contain q
 * @throws {error} 400 If q is not a string
 * @throws {error} 400 If q is not between 3 and 100 characters long
 * @throws {error} 500 If there is a database error
 *
 * @example
 * GET /search?q=chicken
 */
router.get('/search' , (req, res) => {
  let query = req.query.q;
  if (!query || typeof query != "string" ) {
    res.status(400).send('Bad request');
    return;
  }
  if (query.length < 3 || query.length > 100) {
    res.status(400).send('Bad query');
    return;
  }

  query = query.toLowerCase();

  recipeService.getRecipesLikeTitle(query).then((recipes) => {
    res.json(recipes);
  })
  .catch((err) => {
    handleServerError(res, err);
  });
});

/**
 * @name POST /like/:recipeId
 * @function
 * @memberof module:recipe-router
 * @param {number} recipeId - The ID of the recipe to like
 *
 * @requires {User} req.user - The user who is liking the recipe
 * @description Adds a like to the recipe with the given ID, with the user who is logged in
 *
 * @throws {Error} 400 If the recipe ID is not a number
 * @throws {Error} 404 If the recipe with the given ID does not exist
 * @throws {Error} 500 If there is a database error
 */
router.post('/likes/:recipeId', requireLogin , async (req, res) => {
  let recipeId = parseInt(req.params.recipeId);
  if (isNaN(recipeId)) {
    res.status(400).send('Bad request');
    return;
  }

  let userId = req.session.user!.googleId;

  const recipe = await recipeService.getRecipeFull(recipeId);
  if (!recipe) {
    return res.status(404).send('Recipe not found');
  }

  recipeService.addLike(recipeId, userId).then(async (insertedId) => {
    await refreshLogin(req, res);
    res.send("OK");
  })
  .catch((err) => {
    handleServerError(res, err);
  });
});

/**
 * @name DELETE /like/:recipeId
 * @function
 * @memberof module:recipe-router
 * @param {number} recipeId - The ID of the recipe to like
 *
 * @requires {User} req.user - The user who is unliking the recipe
 * @description Removes a like from the recipe with the given ID, with the user who is logged in
 *
 * @throws {Error} 400 If the recipe ID is not a number
 * @throws {Error} 404 If the recipe with the given ID does not exist
 * @throws {Error} 500 If there is a database error
 */
router.delete('/likes/:recipeId', requireLogin , async (req, res) => {
  let recipeId = parseInt(req.params.recipeId);
  if (isNaN(recipeId)) {
    res.status(400).send('Bad request');
    return;
  }
  let userId = req.session.user!.googleId;

  const recipe = await recipeService.getRecipeFull(recipeId);
  if (!recipe) {
    return res.status(404).send('Recipe not found');
  }

  recipeService.removeLike(recipeId, userId).then(async (insertedId) => {
    await refreshLogin(req, res);
    res.send("OK");
  })
  .catch((err) => {
    handleServerError(res, err);
  });
});


/**
 * @name POST /list/:ingredientId
 * @function
 * @memberof module:recipe-router
 * @param {number} ingredientId - The ID of the ingredient to add to the shopping list
 *
 * @requires {User} req.user - The user who is liking the recipe
 * @description Adds an ingredient to the shopping list of the user who is logged in
 *
 * @throws {Error} 400 If the ingredient ID is not a number
 * @throws {Error} 404 If the ingredient with the given ID does not exist
 * @throws {Error} 500 If there is a database error
 */
router.post('/list/:ingredientId', requireLogin , async (req, res) => {
  let ingredientId = parseInt(req.params.ingredientId);
  if (isNaN(ingredientId)) {
    res.status(400).send('Bad request');
    return;
  }

  let userId = req.session.user!.googleId;

  const ingredient = await recipeService.getIngredient(ingredientId);
  if (!ingredient) {
    return res.status(404).send('Ingredient not found');
  }

  recipeService.addIngredientToList(ingredientId, userId).then(async (insertedId) => {
    await refreshLogin(req, res);
    res.send("OK");
  })
  .catch((err) => {
    handleServerError(res, err);
  });
});

/**
 * @name DELETE /list/:ingredientId
 * @function
 * @memberof module:recipe-router
 * @param {number} ingredientId - The ID of the ingredient to remove from the shopping list
 *
 * @requires {User} req.user - The user who is unliking the recipe
 * @description Removes an ingredient from the shopping list of the user who is logged in
 *
 * @throws {Error} 400 If the ingredient ID is not a number
 * @throws {Error} 404 If the ingredient with the given ID does not exist
 * @throws {Error} 500 If there is a database error
 */
router.delete('/list/:ingredientId', requireLogin , async (req, res) => {
  let ingredientId = parseInt(req.params.ingredientId);
  if (isNaN(ingredientId)) {
    res.status(400).send('Bad request');
    return;
  }
  let userId = req.session.user!.googleId;

  const ingredient = await recipeService.getIngredient(ingredientId);
  if (!ingredient) {
    return res.status(404).send('Ingredient not found');
  }

  recipeService.removeIngredientFromList(ingredientId, userId).then(async (insertedId) => {
    await refreshLogin(req, res);
    res.send("OK");
  })
  .catch((err) => {
    handleServerError(res, err);
  });
});


/**
 * @name PUT(/recipes/:recipeId)
 * @function
 * @memberof module:recipe-router
 * @param {number} recipeId - The ID of the recipe to edit
 * 
 * Takes the recipe with the given ID and updates it with the data in the request body
 */
router.put('/recipes/:recipeId', requireAdmin , async (req, res) => {
  let recipeId = parseInt(req.params.recipeId);
  if (isNaN(recipeId)) {
    res.status(400).send('Bad request');
    return;
  }

  try {
    let oldRecipe = await recipeService.getRecipe(recipeId);
    if (!oldRecipe) {
      return res.status(404).send('Recipe not found');
    }
  } catch (err) {
    handleServerError(res, err);
    return;
  }

  let recipe = req.body as Recipe;
  const ingredientItems = req.body.ingredients as {ingredientName: string, quantity: number, unitName: string}[];
  const ingredientTags = req.body.tags as string[] || ["other"];
  recipe.id = recipeId;

  if (!recipe.title || !recipe.summary || !recipe.instructions || !recipe.ingredients) {
    res.status(400).send('Bad request, missing property');
    return;
  }

  if (recipe.title.length < 3 || recipe.title.length > 100) {
    res.status(400).send('Bad request, title must be between 3 and 100 characters');
    return;
  }

  if (recipe.instructions.length < 3 || recipe.instructions.length > 10000) {
    res.status(400).send('Bad request, instructions must be between 3 and 10000 characters');
    return;
  }

  for (let ingredientItem of ingredientItems) {
    if (!ingredientItem.ingredientName || !ingredientItem.quantity || !ingredientItem.unitName) {
      res.status(400).send('Bad request, missing ingredient property');
      return;
    }
    if (isNaN(ingredientItem.quantity)) {
      res.status(400).send('Bad request, quantity must be a number');
      return;
    }
    if (ingredientItem.quantity <= 0) {
      res.status(400).send('Bad request, quantity must be positive');
      return;
    }
    if (ingredientItem.unitName.length > 20) {
      res.status(400).send('Bad request, unit name must be less than 20 characters');
      return;
    }
    if (ingredientItem.ingredientName.length > 100) {
      res.status(400).send('Bad request, ingredient name must be less than 100 characters');
      return;
    }
    if (ingredientItem.unitName.length == 0) {
      ingredientItem.unitName = "units";
    }
  }

  for (let ingredientTag of ingredientTags) {
    if (ingredientTag.length > 20) {
      res.status(400).send('Bad request, ingredient tag must be less than 20 characters');
      return;
    }
  }

  recipeService.updateRecipe(recipe.id, recipe.title, recipe.summary, recipe.instructions, recipe.servings, recipe.imageUrl || "https://recipe.feal.no/logo.png", recipe.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ").then(async (insertedId) => {

    recipeService.updateRecipeIngredients(recipe.id, ingredientItems).then(async (insertedId) => {
      recipeService.updateRecipeTags(recipe.id, ingredientTags).then(async (insertedId) => {
        await refreshLogin(req, res);
        return res.send("OK");
      });
    })
    .catch((err) => {
      handleServerError(res, err);
    });
  }).catch((err) => {
    handleServerError(res, err);
  });
});

/**
 * @name POST /recipes
 * @function
 * @memberof module:recipe-router
 * @param {string} title - The title of the recipe
 * @param {string} summary - A short summary of the recipe
 * @param {string} instructions - The instructions for the recipe
 * @param {number} servings - The number of servings the recipe makes
 * @param {string} imageUrl - The URL of the image for the recipe
 * @param {string} videoUrl - The URL of the video for the recipe
 * @param {string[]} ingredients - The ingredients for the recipe
 * @param {string[]} tags - The tags for the recipe
 *
 * @requires {User} req.user - The user who is creating the recipe
 * @description Creates a new recipe with the given data. Requires the user to be logged in and have admin privileges.
 */
router.post('/recipes', requireAdmin , async (req, res) => {
  let recipe = req.body as Recipe;
  let ingredientItems = {} as {ingredientName: string, quantity: number, unitName: string}[];
  let ingredientTags = {} as string[];
  try {
    ingredientItems = req.body.ingredients as {ingredientName: string, quantity: number, unitName: string}[];
    ingredientTags = req.body.tags as string[] || ["other"];
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad request, missing property');
    return;
  }

  if (!recipe.title || !recipe.summary || !recipe.instructions || !recipe.ingredients) {
    res.status(400).send('Bad request, missing property');
    return;
  }

  if (recipe.title.length < 3 || recipe.title.length > 100) {
    res.status(400).send('Bad request, title must be between 3 and 100 characters');
    return;
  }

  if (recipe.instructions.length < 3 || recipe.instructions.length > 10000) {
    res.status(400).send('Bad request, instructions must be between 3 and 10000 characters');
    return;
  }

  for (let ingredientItem of ingredientItems) {
    if (!ingredientItem.ingredientName || !ingredientItem.quantity || !ingredientItem.unitName) {
      res.status(400).send('Bad request, missing ingredient property');
      return;
    }
    if (isNaN(ingredientItem.quantity)) {
      res.status(400).send('Bad request, quantity must be a number');
      return;
    }
    if (ingredientItem.quantity <= 0) {
      res.status(400).send('Bad request, quantity must be positive');
      return;
    }
    if (ingredientItem.unitName.length > 20) {
      res.status(400).send('Bad request, unit name must be less than 20 characters');
      return;
    }
    if (ingredientItem.ingredientName.length > 100) {
      res.status(400).send('Bad request, ingredient name must be less than 100 characters');
      return;
    }
    if (ingredientItem.unitName.length == 0) {
      ingredientItem.unitName = "units";
    }
  }

  recipeService.addRecipe(recipe.title, recipe.summary, recipe.instructions, recipe.servings, recipe.imageUrl || "https://recipe.feal.no/logo.png", recipe.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ").then(async (recipeId) => {

    recipeService.updateRecipeIngredients(recipeId, ingredientItems).then(async (insertedId) => {
      recipeService.updateRecipeTags(recipeId, ingredientTags).then(async (insertedId) => {
        await refreshLogin(req, res);
        return res.send("OK");
      });
    })
    .catch((err) => {
      handleServerError(res, err);
    });
  }).catch((err) => {
    handleServerError(res, err);
  });
});

/**
 * @name DELETE /recipes/:id
 * @function
 * @memberof module:recipe-router
 * @param {number} id - The id of the recipe to delete
 * @requires {User} req.user - The user who is deleting the recipe
 * @description Deletes the recipe with the given id. Requires the user to be logged in and have admin privileges.
 * @returns {string} "OK" if the recipe was deleted successfully
 * @returns {string} "Not found" if the recipe was not found
 */
router.delete('/recipes/:recipeId', requireAdmin , async (req, res) => {
  let recipeId = parseInt(req.params.recipeId);
  if (isNaN(recipeId)) {
    res.status(400).send('Bad request');
    return;
  }

  try {
    let oldRecipe = await recipeService.getRecipe(recipeId);
    if (!oldRecipe) {
      return res.status(404).send('Recipe not found');
    }
  } catch (err) {
    handleServerError(res, err);
    return;
  }

  recipeService.deleteRecipe(recipeId).then(async (insertedId) => {
    await refreshLogin(req, res);
    res.send("OK");
  })
  .catch((err) => {
    handleServerError(res, err);
  });
});

/**
 * @name POST /importrecipe/:id
 * @function
 * @memberof module:recipe-router
 * @param {number} id - The MealDB id of the recipe to import
 * @requires {User} req.user - The user who is importing the recipe
 * @description Imports the recipe with the given MealDB id. Requires the user to be logged in and have admin privileges.
 * @returns {string} "OK" if the recipe was imported successfully
 * @returns {string} "Not found" if the recipe was not found
 *
 * @see https://www.themealdb.com/api.php
 */
router.post('/importrecipe/:mealdbid', requireAdmin , async (req, res) => {
  const idParam = req.params.mealdbid;
  if (!idParam) {
    res.status(400).send('Bad request, missing ID');
    return;
  }
  const mealId = Number(idParam);
  if (isNaN(mealId)) {
    res.status(400).send('Bad request, invalid ID');
    return;
  }

  mealdbService.getMeal(mealId).then(async (meal) => {
    recipeService.saveMeal(meal).then(async (insertedId) => {
      res.send("OK");
    })
    .catch((err) => {
      handleServerError(res, err);
    });
  }).catch((err) => {
    console.log(err);
    if (err === "Meal not found") {
      return res.status(404).send('Meal not found');
    }
    handleServerError(res, err);
  });
});
