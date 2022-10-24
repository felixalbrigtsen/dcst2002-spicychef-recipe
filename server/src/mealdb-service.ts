import axios from 'axios';

/**
 * @typedef {Object} Meal
 * @property {string} idMeal
 * @property {string} title
 * @property {string} instructions
 * @property {string} imgrurl
 * @property {string} youtubeurl
 * @property {string[]} tags
 * @property {string[]} ingredients
 * @property {string[]} measures
 */
export type Meal = {
  idMeal: string;
  title: string;
  instructions: string;
  imgurl: string;
  youtubeurl: string | null;
  tags: string[];

  ingredients: string[];
  measures: string[];
};
//TODO: generate a summary using the data from the meal
//TODO: Find or guess number of servings


/**
 * @function
 * @name normalizeMeasures
 * @argument {string[]} measures
 * @returns {string[]}
 * @description
 * This function will normalize the measures array, so each measure is in the format "'number' 'unit'"
 *
 * The function does not care if the unit is registered in the database or not.
 *
 * If "measure" is empty or just whitespace, will return an empty string
 * If "measure" is a number, will return "'number' unit(s)"
 * If "measure" is a number and a unit, will return "'number' 'unit'"
 * If "measure" is a unit, will return "1 'unit'"
 *
 * @example
 * normalizeMeasures(['Dash', '2Cups', '1 tbsp', '2']) // Returns  ['1 Dash', '2 Cups', '1 tbsp', '2 units']
 */
function normalizeMeasures(measures: string[]): string[] {
  return measures.map(measure => {
    measure = measure.trim();

    // Regex to match integers, floats, fractions: /(([0-9]*[.|\/])?[0-9]+)/

    // If the measure is just a number
    if (/^(([0-9]*[.|\/])?[0-9]+)$/.test(measure)) {
      if (measure === '1' || measure === '1/2') {
        return `${measure} unit`;
      } else {
        return `${measure} units`;
      }
    }
    
    // If the measure starts with a number(int, fraction or float) followed by a space
    if (measure.match(/^(([0-9]*[.|\/])?[0-9])\s/)) {
      return measure;
    }

    // If the measure starts with a number(int, fraction or float), but not a space, add a space
    if (measure.match(/^(([0-9]*[.|\/])?[0-9])/)) {
      return measure.replace(/^(([0-9]*[.|\/])?[0-9]+)/, '$1 ');
    }

    //TODO: Detect and handle  other fraction-like forms, examples: "1 1/2 dl", "½ cup"

    // None of the other patterns matched, prepend "1 "
    return '1 ' + measure;

  });
}

/**
 * @module
 * @name mealdbService
 * @description
 * This module is a service for the MealDB API
 * @see https://www.themealdb.com/api.php
 * @see https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
 */

export class MealDBService {

    /**
     * @function
     * @name getMeal
     * @argument {number} id
     * @returns {Promise<Meal>}
     * @description
     * This function will fetch a meal from the MealDB API, and return a normalized Meal object
     * @see https://www.themealdb.com/api.php
     * @see https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
     */
    getMeal(mealId: number): Promise<Meal> {
      return new Promise(async (resolve, reject) => {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId.toString()}`);

          if (response.status !== 200) {
          return reject(response);
        }

        if (response.data.meals === null) {
          return reject('Meal not found');
        }

        const mealObj = response.data.meals[0];
      
        // Include ALL data: const meal = mealObj as Meal;

        // Cast to Meal type, but only include the properties we want
        const meal: Meal = {
          idMeal: mealObj.idMeal,
          title: mealObj.strMeal,
          instructions: mealObj.strInstructions,
          imgurl: mealObj.strMealThumb,
          tags: mealObj.strTags ? mealObj.strTags.split(','): [],
          youtubeurl: mealObj.strYoutube,
          ingredients: [],
          measures: [],
        };

        // Parse ingredients and their measures
        for (let i = 1; i <= 20; i++) {
          const ingredient = mealObj[`strIngredient${i}`];
          const measure = mealObj[`strMeasure${i}`];
          if (ingredient) {
            meal.ingredients.push(ingredient);
            meal.measures.push(measure);
          }
        }

        meal.measures = normalizeMeasures(meal.measures);

        resolve(meal);
      });
    }

    getRandomMeal(): Promise<Meal> {
      return new Promise(async (resolve, reject) => {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');

        if (response.status !== 200) {
          return reject(response);
        }

        if (response.data.meals === null) {
          return reject('Meal not found');
        }

        const mealObj = response.data.meals[0];
      

        this.getMeal(parseInt(mealObj.idMeal))
          .then(meal => resolve(meal))
          .catch(err => reject(err));

      });
    }

  }

  const mealdbService = new MealDBService();
  export default mealdbService;
