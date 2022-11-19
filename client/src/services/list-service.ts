import axios from "axios";
import { type Ingredient } from "../models/Ingredient";
import { type User } from "../models/User";
import ingredientService from "./ingredient-service";

/**
 * @module
 * @name ListService
 * @description
 * This module is a service for the shooping list using recipe.feal.no/api/list
 */

class ListService {
  /**
   * @function
   * @name getIngredients
   * @returns {Promise<undefined>}
   * @description
   * This function will get all ingredients for the current user from the API
   */

  async getIngredients(): Promise<Array<[Ingredient]>> {
    return new Promise((resolve, reject) => {
      axios
        .get(process.env.REACT_APP_API_URL + "/auth/profile")
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
   * @name addIngredients
   * @argument {number} id
   * @returns {Promise<number>}
   * @description
   * This function will add ingredients to the list
   */

  async addIngredient(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .post(process.env.REACT_APP_API_URL + `/list/${id}`)
        .then((response) => {
          resolve(response.status);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @function
   * @name removeIngredient
   * @argument {number} id
   * @returns {Promise<number>}
   * @description
   * This function will remove an ingredient from a users shopping list
   */

  async removeIngredient(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      axios
        .delete(process.env.REACT_APP_API_URL + `/list/${id}`)
        .then((response) => {
          resolve(response.status);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * @function
   * @name getShoppingList
   * @returns {Promise<undefined>}
   * @description
   * This function will get the shopping list for the current user
   */

  async getShoppingListItems(user: User): Promise<Array<{ id: number; name: string }>> {
    return new Promise(async (resolve, reject) => {
      const ingredients = await ingredientService.getIngredients();

      const shoppingList = ingredients.filter((ingredient) => {
        return user.shoppingList?.includes(ingredient.id);
      });
      resolve(
        shoppingList.map((ingredient) => {
          return { id: ingredient.id, name: ingredient.name };
        })
      );
    });
  }
}

const listService = new ListService();
export default listService;
