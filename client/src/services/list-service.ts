import axios from 'axios';
import { Ingredient } from '../models/Ingredient';

/**
 * @module
 * @name ListService
 * @description
 * This module is a service for the shooping list using recipe.feal.no/api/list
 */

class ListService {

  /**
   * @function
   * @name addIngredients
   * @argument {number} id
   * @returns {Promise<undefined>}
   * @description
   * This function will add ingredients to the list
   */

  addIngredient(id: number): Promise<undefined> {
    return new Promise((resolve, reject) => {
      axios.post(process.env.REACT_APP_API_URL + '/list/' + id)
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
   * @name removeIngredient
   * @argument {number} id
   * @returns {Promise<undefined>}
   * @description
   * This function will remove an ingredient from a users shopping list
   */

  removeIngredient(id: number): Promise<undefined> {
    return new Promise((resolve, reject) => {
      axios.delete(process.env.REACT_APP_API_URL + '/list/' + id)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

const listService = new ListService();
export default listService;