import pool from './mysql-pool';
import { RowDataPacket } from 'mysql2';
import type { Meal } from './mealdb-service';

/**
 * Ingredient
 * @alias Ingredient
 */
export type Ingredient = {
  id: number;
  ingredientName: string;

  /**
   * Number of units of the ingredient
   * @example 1
   */
  amount: number;
  /**
   * Unit ID from the table recipe_ingredient 
   */
  unitId: number;
  /**
   * Name of unit (dl, g, tbsp. etc.)
   */
  unitName: string;
};

/**
 * Unit
 * @alias Unit
 */
export type Unit = {
  id: number;
  name: string;
};

/**
 * Recipe
 * @alias Recipe
 */
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

/*
TODO:
  - Add likes to recipe-getters
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

  getRecipesShort(): Promise<{id: number; title: string; summary: string; imageUrl: string;}[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT `id`,`title`,`summary`, `imageUrl` FROM recipe', (err, results: {id: number; title: string; summary: string; imageUrl: string;}[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
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
  
  getRecipesWithIngredients(ingredientIds: number[]): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query(`
        SELECT recipe.id, recipe.title, recipe.summary
        FROM recipe_ingredient
        LEFT JOIN recipe ON recipe_ingredient.recipeId = recipe.id
        WHERE recipe_ingredient.ingredientId IN (?)
        GROUP BY recipe.id;`, [ingredientIds], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Recipe[]);
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

  getUnitByName(name: string): Promise<Unit> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM unit WHERE name = ?', [name], (err, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Unit);
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


  addIngredient(name: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO ingredient (name) VALUES (?)', [name], (err, results) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted ingredient
        // TODO: mysql returns some combination of RowDataPacket and OkPacket, fix the ts-ignore
        //@ts-ignore
        resolve(results.insertId);
      });
    });
  }

  addUnit(name: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO unit (name) VALUES (?)', [name], (err, results) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted unit
        // TODO: mysql returns some combination of RowDataPacket and OkPacket, fix the ts-ignore
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  // Returns a list of ids, given a list of names. If a name is not found, it is added to the database.
  getIngredientIds(names: string[]): Promise<number[]> {
    return new Promise(async (resolve, reject) => {
      let addCount = 0;
      let ids = names.map(async (name) => {
        let ingredient = await this.getIngredientByName(name);
        if (ingredient) {
          return ingredient.id;
        } else {
          addCount += 1;
          return await this.addIngredient(name);
        }
      });
      // console.log(`Added ${addCount} ingredients`);
      // resolve(Promise.all(ids));
      await Promise.all(ids);
      console.log(`Added ${addCount} units`);
      resolve(Promise.all(ids));
    });
  }

  // Returns a list of ids, given a list of names. If a name is not found, it is added to the database.
  getUnitIds(names: string[]): Promise<number[]> {
    return new Promise(async (resolve, reject) => {
      let addCount = 0;
      let ids = names.map(async (name) => {
        let unit = await this.getUnitByName(name);
        if (unit) {
          return unit.id;
        } else {
          addCount += 1;
          return await this.addUnit(name);
        }
      });
      await Promise.all(ids);
      console.log(`Added ${addCount} units`);
      resolve(Promise.all(ids));
    });
  }

  addRecipe(title: string, summary: string, instructions: string, servings: number, imageUrl: string, videoUrl: string): Promise<number> {
    
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO recipe (title, summary, instructions, servings, imageUrl, videoUrl) VALUES (?, ?, ?, ?, ?, ?)', [title, summary, instructions, servings, imageUrl, videoUrl], (err, results) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted recipe
        // TODO: mysql returns some combination of RowDataPacket and OkPacket, fix the ts-ignore
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  addRecipeIngredient(recipeId: number, ingredientId: number, unitId: number, quantity: number): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO recipe_ingredient (recipeId, ingredientId, unitId, quantity) VALUES (?, ?, ?, ?)', [recipeId, ingredientId, unitId, quantity], (err, results) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted recipe_ingredient
        // TODO: mysql returns some combination of RowDataPacket and OkPacket, fix the ts-ignore
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  addRecipeTag(recipeId: number, tag: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO recipe_tag (recipeId, name) VALUES (?, ?)', [recipeId, tag], (err, results) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted recipe_tag
        // TODO: mysql returns some combination of RowDataPacket and OkPacket, fix the ts-ignore
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  async saveMeal(meal: Meal): Promise<number> {
    //TODO: Use transactions to avoid partial saves
    return new Promise(async (resolve, reject) => {
      // Find ingredient and unit details
      const ingredientNames = meal.ingredients;
      const quantities = meal.measures.map((measure) => parseFloat(measure.substring(0, measure.indexOf(' ')))); // Everything before first space
      const unitNames = meal.measures.map((measure) => measure.substring(measure.indexOf(' ') + 1)); // Everything after first space


      let ingredientIds: number[];
      let unitIds: number[];
      try {
        // Get ids for ingredients and units, create them if they don't exist
        ingredientIds = await this.getIngredientIds(ingredientNames);
        unitIds = await this.getUnitIds(unitNames);

        // Wait for all promises to resolve
        await Promise.all([ingredientIds, unitIds]);

      } catch (err) {
        return reject(err);
      }

      let recipeId: number;
      try {
        // Insert the actual recipe
        recipeId = await this.addRecipe(meal.title, "Meal from MealDB", meal.instructions, 2, meal.imgurl, meal.youtubeurl || "");
      } catch (err) {
        return reject(err);
      }

      try {
        // Insert the ingredient-unit-recipe relationships
        let ingredientUnitRecipeIds = ingredientIds.map(async (ingredientId, index) => {
          return await this.addRecipeIngredient(recipeId, ingredientId, unitIds[index], quantities[index]);
        });
        await Promise.all(ingredientUnitRecipeIds);
        console.log(`Added ${ingredientUnitRecipeIds.length} recipe_ingredient relationships`);
      } catch (err) {
        return reject(err);
      }
      
      // Insert the tags
      for (let tag of meal.tags) {
        this.addRecipeTag(recipeId, tag)
          .catch((err) => reject(err));
      }

      return resolve(recipeId);
    });
  }
}


let recipeService = new RecipeService();
export default recipeService;
