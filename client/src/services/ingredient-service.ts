import axios from "axios";
import { Ingredient } from "../models/Ingredient";

/**
 * @module
 * @name IngredientService
 * @description
 * This module is a service for the ingredients using recipe.feal.no/api/ingredients
 */

class IngredientService {
  /**
   * @function
   * @name getIngredients
   * @argument {string} query
   * @returns {Promise<Ingredient[]>}
   * @description
   * This function will get ingredients from the API
   */

  getIngredients(): Promise<Ingredient[]> {
    return new Promise((resolve, reject) => {
      axios
        .get(process.env.REACT_APP_API_URL + "/ingredients")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

const ingredientService = new IngredientService();
export default ingredientService;
