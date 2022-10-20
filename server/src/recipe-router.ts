/** Express router providing recipe related routes
 * @module recipe-router
 */

import express from 'express';
import recipeService from './recipe-service';

const router = express.Router();
export default router;

router.get('/' , (req, res) => {
  res.send('Hello World! You have reached the Recipe API server. Did you mean to go <a href="/">home</a>?');
});

/**
 * @name GET /recipes
 * @function
 * @memberof module:recipe-router
 *
 * @returns {Recipe[]} Array of Recipes in short form (no instructions or ingredients)
 * @throws {Error} 500 If there is a database error
 * @example
 * GET /recipes
 * 
 */
router.get('/recipes' , (req, res) => {
  recipeService.getRecipesShort().then((recipes) => {
    res.json(recipes);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

/**
 * Get a recipe by ID
 * @name Get /recipe/:id
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

router.get('/recipe/:id' , (req, res) => {
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
      res.status(500).send(err);
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
    res.status(500).send(err);
  });
});



