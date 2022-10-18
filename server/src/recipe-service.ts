import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

// TODO: Fix types with https://stackoverflow.com/a/58208369

export type Ingredient = {
  id: number;
  name: string;
};

export type Recipe = {
  id: number;
  title: string;
  summary: string;
  instructions: string;
  servings: number;
  imageurl: string;
  created_at: string;
};

class RecipeService {
  getRecipes(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipes', (err, results) => {
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
      pool.query('SELECT * FROM recipes WHERE id = ?', [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0] as Recipe);
        }
      });
    });
  }

  getIngredients(): Promise<Ingredient[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredients', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results as Ingredient[]);
        }
      });
    });
  }

  getIngredient(id: number): Promise<Ingredient> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredients WHERE id = ?', [id], (err, results) => {
        if (err) {
          reject(err);
        } else {

          if (results.length > 0) {
            resolve(results[0] as Ingredient);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

}

