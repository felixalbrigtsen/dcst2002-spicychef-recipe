import pool from '../mysql-pool';
import { RowDataPacket, QueryError } from 'mysql2';
import type { Meal } from '../models/Meal';
import type { RecipeIngredient } from '../models/RecipeIngredient';
import type { Ingredient } from '../models/Ingredient';
import type { Recipe } from '../models/Recipe';
import type { Unit } from '../models/Unit';

class RecipeService {
  getAllRecipesShort(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT recipe.id, recipe.title, recipe.summary, recipe.imageUrl, recipe.created_at, likes.likes
                  FROM recipe 
                  LEFT JOIN ( 
                            SELECT recipeId, COUNT(*) AS likes FROM user_like GROUP BY recipeId
                      ) likes 
                  ON recipe.id = likes.recipeId`, (err: QueryError | null, results: {id: number; title: string; summary: string; imageUrl: string; created_at: Date; likes: number}[]) => {
        if (err) {
          return reject(err);
        } 

        if (results.length === 0) {
          return resolve([]);
        }

        const recipes = results.map(async (recipe) => {
          return {
            id: recipe.id,
            title: recipe.title,
            summary: recipe.summary,
            imageUrl: recipe.imageUrl,
            created_at: recipe.created_at,
            likes: recipe.likes || 0,
            tags: await this.getTagsInRecipe(recipe.id),
          } as Recipe;
        });

        resolve(Promise.all(recipes));
      });
    });
  }

  getRecipesShort(recipeIds: number[]): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT recipe.id, recipe.title, recipe.summary, recipe.imageUrl, likes.likes
                  FROM recipe 
                  LEFT JOIN ( 
                            SELECT recipeId, COUNT(*) AS likes FROM user_like GROUP BY recipeId
                      ) likes 
                  ON recipe.id = likes.recipeId
                  WHERE recipe.id IN (?)`, [recipeIds], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          reject(err);
        } 

        if (results.length === 0) {
          return resolve([]);
        }

        const recipes = results.map(async (recipe) => {
          return {
            id: recipe.id,
            title: recipe.title,
            summary: recipe.summary,
            imageUrl: recipe.imageUrl,
            likes: recipe.likes || 0,
            tags: await this.getTagsInRecipe(recipe.id),
          } as Recipe;
        });

        resolve(Promise.all(recipes));
      });
    });
  }

  deleteRecipe(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // First delete all ingredients in recipe
      pool.query('DELETE FROM recipe_ingredient WHERE recipeId = ?', [id], (err:QueryError| null, _results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Then delete all tags in recipe
        pool.query('DELETE FROM recipe_tag WHERE recipeId = ?', [id], (err: QueryError | null, _results: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }
          // Then delete recipe
          pool.query('DELETE FROM recipe WHERE id = ?', [id], async (err: QueryError | null, _results: RowDataPacket[]) => {
            if (err) {
              return reject(err);
            }

            await this.hoover();

            resolve();
          });
        });
      });
    });
  }

  getRecipe(id: number): Promise<Recipe> {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT recipe.*, likes.likes FROM recipe 
        LEFT JOIN ( SELECT recipeId, COUNT(*) as likes FROM user_like 
        GROUP BY recipeId) AS likes ON likes.recipeId = recipe.id 
        WHERE recipe.id = ?`, [id], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        if (results && results[0] && !results[0].likes) {
          results[0].likes = 0;
        }
        resolve(results[0] as Recipe);
      });
    });
  }

  getRecipesLikeTitle(title: string): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id FROM recipe WHERE title LIKE ?', [`%${title}%`], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return resolve([]);
        }

        const recipeIds = results.map((recipe) => recipe.id);
        this.getRecipesShort(recipeIds)
        .then((recipes) => {
          resolve(recipes);
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }
  
  getRecipeFull(id: number): Promise<Recipe | null> {
    return new Promise((resolve, reject) => {
      this.getRecipe(id)
      .then(async (recipe) => {

        if (!recipe) {
          return resolve(null);
        }

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

  getRecipesWithAnyIngredients(ingredientIds: number[]): Promise<Recipe[]> { 
    return new Promise((resolve, reject) => {
      pool.query('SELECT recipeId, COUNT(*) AS matchcount FROM recipe_ingredient WHERE ingredientId IN (?) GROUP BY recipeId', [ingredientIds], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }

        if (results.length === 0) {
          return resolve([]);
        }

        let recipeIds = results.map((result) => result.recipeId);
        recipeIds.sort((a, b) => b.matchcount - a.matchcount);

        this.getRecipesShort(recipeIds)
        .then((recipes) => {
          resolve(recipes);
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }

  getRecipesWithAllIngredients(ingredientIds: number[]): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT recipeId, COUNT(DISTINCT ingredientId) AS matchcount FROM recipe_ingredient WHERE ingredientId IN (?) GROUP BY recipeId HAVING matchcount = ?', [ingredientIds, ingredientIds.length], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }

        if (results.length === 0) {
          return resolve([]);
        }

        let recipeIds = results.map((result) => result.recipeId);
        this.getRecipesShort(recipeIds)
        .then((recipes) => {
          resolve(recipes as Recipe[]);
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }

  getIngredients(): Promise<Ingredient[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredient', (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results as Ingredient[]);
        
      });
    });
  }

  getIngredient(id: number): Promise<Ingredient> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredient WHERE id = ?', [id], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        } 

        resolve(results[0] as Ingredient);
      });
    });
  }

  getIngredientsInRecipe(recipeId: number): Promise<RecipeIngredient[]> {
    return new Promise((resolve, reject) => {
      pool.query(`
        SELECT ingredientId, unitId, quantity, ingredient.name AS ingredientName, unit.name AS unitName 
        FROM recipe_ingredient 
        LEFT JOIN unit ON recipe_ingredient.unitId = unit.id 
        LEFT JOIN ingredient ON recipe_ingredient.ingredientId = ingredient.id 
        WHERE recipe_ingredient.recipeId = ?`, [recipeId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results as RecipeIngredient[]);
      });
    });
  }

  getIngredientByName(name: string): Promise<Ingredient> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM ingredient WHERE name = ?', [name], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Ingredient);
      });
    });
  }

  getUnitByName(name: string): Promise<Unit> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM unit WHERE name = ?', [name], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] as Unit);
      });
    });
  }

  getTagsInRecipe(recipeId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipe_tag WHERE recipeId = ?', [recipeId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return resolve([]);
        }
        resolve(results.map((result) => result.name));
      });
    });
  }

  getTags(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT DISTINCT name FROM recipe_tag', (err: QueryError | null, results: string[]) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return resolve([]);
        }
        resolve(results);
      });
    })
  }

  addIngredient(name: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO ingredient (name) VALUES (?)', [name], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted ingredient
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  addUnit(name: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO unit (name) VALUES (?)', [name], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted unit
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  // Returns a list of ids, given a list of names. If a name is not found, it is added to the database.
  getIngredientIds(names: string[]): Promise<number[]> {
    return new Promise(async (resolve, reject) => {
      let addCount = 0;
      let ids: number[] = [];
      for (let name of names) {
        let ingredient = await this.getIngredientByName(name);
        if (ingredient) {
          ids.push(ingredient.id);
        } else {
          let id = await this.addIngredient(name);
          ids.push(id);
          addCount++;
        }
      }
      console.log(`Added ${addCount} ingredients`);
      resolve(ids);
    });
  }

  // Returns a list of ids, given a list of names. If a name is not found, it is added to the database.
  getUnitIds(names: string[]): Promise<number[]> {
    return new Promise(async (resolve, reject) => {
      let addCount = 0;
      let ids: number[] = [];
      for (let name of names) {
        let unit = await this.getUnitByName(name);
        if (unit) {
          ids.push(unit.id);
        } else {
          let id = await this.addUnit(name);
          ids.push(id);
          addCount++;
        }
      }
      console.log(`Added ${addCount} units`);
      resolve(ids);
    });
  }

  addRecipe(title: string, summary: string, instructions: string, servings: number, imageUrl: string | null, videoUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO recipe (title, summary, instructions, servings, imageUrl, videoUrl) VALUES (?, ?, ?, ?, ?, ?)', [title, summary, instructions, servings, imageUrl, videoUrl], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted recipe
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  addRecipeIngredient(recipeId: number, ingredientId: number, unitId: number, quantity: number): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO recipe_ingredient (recipeId, ingredientId, unitId, quantity) VALUES (?, ?, ?, ?)', [recipeId, ingredientId, unitId, quantity], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted recipe_ingredient
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  addRecipeTag(recipeId: number, tag: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO recipe_tag (recipeId, name) VALUES (?, ?)', [recipeId, tag], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted recipe_tag
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  async saveMeal(meal: Meal): Promise<number> {
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
        try {
          await this.addRecipeTag(recipeId, tag);
        } catch(err) {
          reject(err);
        }
      }

      await this.hoover();

      return resolve(recipeId);
    });
  }
  updateRecipe(id: number, title: string, summary: string, instructions: string, servings: number, imageUrl: string, videoUrl: string) {
    return new Promise((resolve, reject) => {
      pool.query('UPDATE recipe SET title = ?, summary = ?, instructions = ?, servings = ?, imageUrl = ?, videoUrl = ? WHERE id = ?', [title, summary, instructions, servings, imageUrl, videoUrl, id], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  updateRecipeIngredients(recipeId: number, ingredients: {ingredientName: string, quantity: number, unitName: string}[]) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM recipe_ingredient WHERE recipeId = ?', [recipeId], async (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        
        try {
          const ingredientIds = await this.getIngredientIds(ingredients.map((ingredient) => ingredient.ingredientName));
          const unitIds = await this.getUnitIds(ingredients.map((ingredient) => ingredient.unitName));
          for (let i = 0; i < ingredients.length; i++) {
            this.addRecipeIngredient(recipeId, ingredientIds[i], unitIds[i], ingredients[i].quantity);
          }

          await this.hoover();

          return resolve(results);
        } catch (err) {
          return reject(err);
        }
        
      });
    });
  }

  updateRecipeTags(recipeId: number, tags: string[]) {
    return new Promise((resolve, reject) => {
      // Delete tags that are no longer in the recipe
      // Deletes and inserts many rows in a single query
     
      pool.query('DELETE FROM recipe_tag WHERE recipeId = ? AND name NOT IN (?)', [recipeId, tags], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Add tags that are new to the recipe
        pool.query('INSERT IGNORE INTO recipe_tag(recipeId, name) VALUES ?', [tags.map((tag) => [recipeId, tag])], async (err: QueryError | null, results: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }

          await this.hoover();

          return resolve(results);
        });
      });
    });
  }


  addLike(recipeId: number, userId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO user_like (googleId, recipeId) VALUES (?, ?)', [userId, recipeId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }

        // Resolve id of inserted user_like
        // @ts-ignore
        resolve(results.insertId);

      });
    });
  }

  removeLike(recipeId: number, userId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM user_like WHERE googleId = ? AND recipeId = ?', [userId, recipeId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted user_like
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  addIngredientToList(ingredientId: number, userId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO list_ingredient (googleId, ingredientId) VALUES (?, ?)', [userId, ingredientId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted user_ingredient
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  removeIngredientFromList(ingredientId: number, userId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM list_ingredient WHERE googleId = ? AND ingredientId = ?', [userId, ingredientId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }
        // Resolve id of inserted user_ingredient
        // @ts-ignore
        resolve(results.insertId);
      });
    });
  }

  
  hooverIngredients(): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM ingredient WHERE id NOT IN (SELECT ingredientId FROM recipe_ingredient)', (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }

  hooverUnits(): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM unit WHERE id NOT IN (SELECT unitId FROM recipe_ingredient)', (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }

  hooverUserListIngredients(): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM list_ingredient WHERE ingredientId NOT IN (SELECT id FROM ingredient)', (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }

  hooverUserLikes(): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM user_like WHERE recipeId NOT IN (SELECT id FROM recipe)', (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }

  hoover(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.hooverIngredients()
        .then(() => this.hooverUnits())
        .then(() => this.hooverUserListIngredients())
        .then(() => this.hooverUserLikes())
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }
}

let recipeService = new RecipeService();
export default recipeService;
