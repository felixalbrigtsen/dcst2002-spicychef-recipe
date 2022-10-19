import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Ingredient = {
  id: number;
  ingredientName: string;
  amount: number;
  unitId: number;
  unitName: string;
};

export type Unit = {
  id: number;
  name: string;
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
  ingredients: Ingredient[];
  tags: string[];
};


/*
Grunnleggende typer har hver sin "enkle" getter.
  feks: getRecipe(id: number): Promise<Recipe>
Disse gir BARE den rene dataen som er i databasen (Kun en SELECT, ingen JOINs)


For å hente ut data som er relatert til hverandre, har vi "komplekse" getters.
  feks getRecipeFull(id: number): Promise<Recipe>
Disse gjør en SELECT, og JOINer på alle tabeller som er relatert til hverandre.
I eksemplet utgjør det også alle ingrediensene med tilhørende enhet og antall, i tillegg til alle tags.

*/

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

  getRecipesLikeTitle(title: string): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipe WHERE title LIKE ?', [`%${title}%`], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Recipe[]);
      });
    });
  }

  getRecipesWithTag(tag: string): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query(`
        SELECT recipe.id, recipe.title, recipe.summary 
        FROM recipe_tag 
        LEFT JOIN recipe ON recipe_tag.recipeId = recipe.id 
        WHERE recipe_tag.name = "dinner" 
        GROUP BY recipe.id;`, [tag], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Recipe[]);
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

  getIngredientsInRecipe(recipeId: number): Promise<Ingredient[]> {
    return new Promise((resolve, reject) => {
      pool.query(`
        SELECT ingredientId as id, unitId, quantity, ingredient.name AS ingredientName, unit.name AS unitName 
        FROM recipe_ingredient 
        LEFT JOIN unit ON recipe_ingredient.unitId = unit.id 
        LEFT JOIN ingredient ON recipe_ingredient.ingredientId = ingredient.id 
        WHERE recipe_ingredient.recipeId = ?`, [recipeId], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Ingredient[]);
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

  getTagsInRecipe(recipeId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipe_tag WHERE recipeId = ?', [recipeId], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results.map((result) => result.name));
      });
    });
  }

  getRecipeFull(id: number): Promise<Recipe> {
    return new Promise((resolve, reject) => {
      this.getRecipe(id)
      .then(async (recipe) => {

        let tags = await this.getTagsInRecipe(id);
        recipe.tags = tags;

        let ingredients = await this.getIngredientsInRecipe(recipe.id);
        recipe.ingredients = ingredients;

        resolve(recipe);

      }).catch((err) => {
        reject(err);
      });
    });
  }

}

let recipeService = new RecipeService();
export default recipeService;
