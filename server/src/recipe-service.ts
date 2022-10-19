import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Ingredient = {
  id: number;
  name: string;
};

export type Unit = {
  id: number;
  name: string;
};

export type IngredientInstace = {
  ingredientId: number;
  amount: number;
  unitId: number;
};

export type Recipe = {
  id: number;
  title: string;
  summary: string;
  instructions: string;
  servings: number;
  imageurl: string;
  created_at: string;
  ingredients: IngredientInstace[];
};


class RecipeService {
  getRecipes(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipes', (err, results: RowDataPacket[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(results as Recipe[]);
        }
      });
    });
  }

  getRecipe(id: number): Promise<Recipe> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipes WHERE id = ?', [id], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Recipe);
      });
    });
  }

  getIngredients(): Promise<Ingredient[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredients', (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Ingredient[]);
        
      });
    });
  }

  getIngredient(id: number): Promise<Ingredient> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredients WHERE id = ?', [id], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        } 

        if (results.length > 0) {
          resolve(results[0] as Ingredient);
        } else {
          reject(undefined);
        }
      });
    });
  }

  getIngredientsInRecipe(recipeId: number): Promise<IngredientInstace[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredients_in_recipe WHERE recipe_id = ?', [recipeId], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results as IngredientInstace[]);
      });
    });
  }

  getUnits(): Promise<Unit[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM units', (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Unit[]);
      });
    });
  }

  getUnit(id: number): Promise<Unit> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM units WHERE id = ?', [id], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Unit);
      });
    });
  }

  getIngredientByName(name: string): Promise<Ingredient> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredients WHERE name = ?', [name], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Ingredient);
      });
    });
  }

  getRecipeByTitle(title: string): Promise<Recipe> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipes WHERE title = ?', [title], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Recipe);
      });
    });
  }

  getRecipeFull(id: number): Promise<Recipe> {
    return new Promise((resolve, reject) => {
      this.getRecipe(id)
      .then((recipe) => {
        this.getIngredientsInRecipe(id)
        .then((ingredients) => {
          recipe.ingredients = ingredients;
          resolve(recipe);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

}

let recipeService = new RecipeService();
export default recipeService;
