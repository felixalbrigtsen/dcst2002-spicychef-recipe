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

  // Virtual fields
  ingredientName: Ingredient['name'];
  unitName: Unit['name'];
};

export type Recipe = {
  id: number;
  title: string;
  summary: string;
  instructions: string;
  servings: number;
  imageUrl: string | null;
  videoUrl: string | null;
  created_at: string | null;
  ingredients: IngredientInstace[];
};


class RecipeService {
  getRecipes(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipe', (err, results: RowDataPacket[]) => {
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
      pool.query('SELECT * FROM recipe WHERE id = ?', [id], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Recipe);
      });
    });
  }

  getIngredients(): Promise<Ingredient[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredient', (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Ingredient[]);
        
      });
    });
  }

  getIngredient(id: number): Promise<Ingredient> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredient WHERE id = ?', [id], (err, results: RowDataPacket[]) => {
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
      pool.query('SELECT * FROM recipe_ingredient WHERE recipeId = ?', [recipeId], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results as IngredientInstace[]);
      });
    });
  }

  getUnits(): Promise<Unit[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM unit', (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Unit[]);
      });
    });
  }

  getUnit(id: number): Promise<Unit> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM unit WHERE id = ?', [id], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Unit);
      });
    });
  }

  getIngredientByName(name: string): Promise<Ingredient> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredient WHERE name = ?', [name], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Ingredient);
      });
    });
  }

  getRecipeByTitle(title: string): Promise<Recipe> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipe WHERE title = ?', [title], (err, results: RowDataPacket[]) => {
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
      .then(async (recipe) => {

        recipe.ingredients = [];

        let ingredientEntries = await this.getIngredientsInRecipe(recipe.id);

        // TODO: Do SQL magic instead of this
        for (let ingredientEntry of ingredientEntries) {
          let entry = {...ingredientEntry};
          console.log(entry);

          let ingredient = await this.getIngredient(entry.ingredientId);
          let unit = await this.getUnit(entry.unitId);

          entry.ingredientName = ingredient.name;
          entry.unitName = unit.name;
          
          recipe.ingredients.push(entry);
        }

        resolve(recipe);

      }).catch((err) => {
        reject(err);
      });
    });
  }

}

let recipeService = new RecipeService();
export default recipeService;
