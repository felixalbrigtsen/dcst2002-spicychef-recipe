import axios from 'axios';
import type { Recipe } from '../models/recipe';

/**
 * @module
 * @name recipeService
 * @description
 * This module is a service for recipes from recipe.feal.no/api
 */

export class RecipeService {
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
      axios.get(process.env.REACT_APP_API_URL + '/recipe/' + id)
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
   * @argument {string} query
   * @returns {Promise<Recipe[]>}
   * @description
   * This function will fetch recipes where the recipe name contains the query and return them as an array
   */

  search(query : string): Promise<Recipe[]> {
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
}

const recipeService = new RecipeService();
export default recipeService;

