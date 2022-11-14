import axios from 'axios';
import type { Recipe } from '../models/Recipe';
import type { NewRecipe } from '../models/NewRecipe';
import type { RecipeIngredient } from '../models/RecipeIngredient';

/**
 * @module
 * @name recipeService
 * @description
 * This module is a service for recipes from recipe.feal.no/api
 */

class RecipeService {
  /**
   * @function
   * @name getRecipesShort
   * @returns {Promise<Recipe[]>}
   * @description
   * This function will fetch all the recipes from recipe.feal.no/api/recipes and return them as an array
   */

  getRecipesShort(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_API_URL + '/recipes')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @function
   * @name getRecipesShort
   * @argument {number} id
   * @returns {Promise<Recipe[]>}
   * @description
   * This function will fetch one recipe from recipe.feal.no/api/recipes and return a Recipe object
   */

  getRecipe(id: number): Promise<Recipe> {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_API_URL + '/recipes/' + id)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @function
   * @name search
   * @argument {string | undefined} query
   * @returns {Promise<Recipe[]>}
   * @description
   * This function will fetch recipes where the recipe name contains the query and return them as an array
   */

  search(query : string | undefined): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_API_URL + '/search?q=' + query)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  searchRecipeByIngredients(ingredientIds: number[], mode='all'): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      if (mode !== "all" && mode !== "any") {
        return reject("Invalid mode");
      }

      axios.get(process.env.REACT_APP_API_URL + '/recipes', {
        params: {
          ingredients: ingredientIds.join(","),
          mode: mode
        }
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 
   * @function
   * @name createRecipe 
   * @argument {NewRecipe} recipe
   * @description
   * This function will post a new recipe to recipe.feal.no/api/recipes
   */

  createRecipe(recipe: NewRecipe): Promise<NewRecipe> {
    return new Promise((resolve, reject) => {
      axios.post(process.env.REACT_APP_API_URL + '/recipes', recipe)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 
   * @function
   * @name updateRecipe
   * @argument {NewRecipe} recipe
   * @description
   * This function will patch a recipe to recipe.feal.no/api/recipes/{id}
   */

  updateRecipe(recipe: NewRecipe): Promise<NewRecipe> {
    return new Promise((resolve, reject) => {
      axios.put(process.env.REACT_APP_API_URL + '/recipes/' + recipe.id, recipe)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @function
   * @name deleteRecipe
   * @argument {number} id
   * @description
   * This function will delete a recipe from recipe.feal.no/api/recipes/{id}
   */

  deleteRecipe(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      axios.delete(process.env.REACT_APP_API_URL + '/recipes/' + id)
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @function
   * @name addLike
   * @argument {number} id
   * @description
   * This function will add a like to a recipe on recipe.feal.no/api/likes/{id}
   */

  addLike(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      axios.post(process.env.REACT_APP_API_URL + '/likes/' + id)
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @function
   * @name removeLike
   * @argument {number} id
   * @description
   * This function will remove a like from a recipe on recipe.feal.no/api/likes/{id}
   */

  removeLike(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      axios.delete(process.env.REACT_APP_API_URL + '/likes/' + id)
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

const recipeService = new RecipeService();
export default recipeService;

