import axios from 'axios';
import type { Recipe } from '../models/recipe';

const API_BASE_URL: string = process.env.REACT_APP_API_URL as string;

export class RecipeService {
  getRecipesShort(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      axios.get(API_BASE_URL + '/recipes')
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

