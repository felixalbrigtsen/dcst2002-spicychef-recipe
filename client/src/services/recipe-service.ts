import axios from 'axios';
import { Recipe } from '../models/recipe';

export class RecipeService {
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

}

const recipeService = new RecipeService();
export default recipeService;

