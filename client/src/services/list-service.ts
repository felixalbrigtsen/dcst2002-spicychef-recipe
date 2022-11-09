import axios from 'axios';
import { Ingredient } from '../models/Ingredient';
import ingredientService from './ingredient-service';
import { useLogin } from '../hooks/Login';

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

  getIngredients(): Promise<[Ingredient][]> {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_API_URL + '/auth/profile')
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
    });
  };

  /**
   * @function
   * @name addIngredients
   * @argument {number} id
   * @returns {Promise<number>}
   * @description
   * This function will add ingredients to the list
   */

  addIngredient(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      axios.post(process.env.REACT_APP_API_URL + `/list/${id}`)
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

  removeIngredient(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      axios.delete(process.env.REACT_APP_API_URL +  `/list/${id}`)
        .then((response) => {
          resolve(response.status);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // removeAllIngredients(): Promise<undefined> {
  //   return new Promise((resolve, reject) => {
  //     axios.delete(process.env.REACT_APP_API_URL + '/api/list')
  //       .then((response) => {
  //         resolve(response.data);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // }

  getShoppingListItems(): Promise<{id: number, name: string}[]> {
    // const { user } = useLogin();
    const user = {
      "googleId": "112735525170884590260",
      "name": "Felix Albrigtsen",
      "email": "felixalbrigtsen@gmail.com",
      "picture": "https://lh3.googleusercontent.com/a/ALm5wu3PBPSF3_U2gA9xouT_Hpe1E6HR4GWmmswlYT1o=s96-c",
      "isadmin": true,
      "likes": [
          2
      ],
      "shoppingList": [
          1,
          3,
          24
      ]
    }

    return new Promise(async (resolve, reject) => {
      const ingredients = await ingredientService.getIngredients();

      const shoppingList = ingredients.filter((ingredient) => {
        return user.shoppingList.includes(ingredient.id);
      });

      console.log(shoppingList);

      resolve(shoppingList.map(ingredient => {return {id: ingredient.id, name: ingredient.name}}));
    });
    

  }
}

const listService = new ListService();
export default listService;
