import axios from 'axios';
import type { Meal } from '../models/Meal';

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
    measure = measure.trim().normalize('NFKC').replace(/[\u2044]/, '/');

    // If the first character is not a digit, prepend 1
    if (!(/^([0-9])/.test(measure))) {
      return '1 ' + measure;
    }

    // Parse and normalize mixed numbers into fractions, examples: "1 1/2 dl" => "3/2 dl"
    if (measure.match(/^([0-9]+ [0-9]+\/[0-9]+)/)) {
      const mixedNum = measure.match(/^([0-9]+) ([0-9]+\/[0-9]+)/);
      if (mixedNum) {
        const [_, wholeNum, fraction] = mixedNum;
        const [numerator, denominator] = fraction.split('/');
        const newNumerator = (parseInt(wholeNum) * parseInt(denominator)) + parseInt(numerator);
        measure = measure.replace(/^([0-9]+ [0-9]+\/[0-9]+)/, `${newNumerator}/${denominator}`);
      }
    }

    // Parse and normalize fractions
    if (measure.match(/^([0-9]*\/[0-9]*)/)) {
      let fraction = measure.match(/^([0-9]*\/[0-9]*)/);
      if (fraction) {
        let numbers = fraction[0].split('/');
        let value = Number(numbers[0]) / Number(numbers[1]);
        measure = measure.replace(/^([0-9]*\/[0-9]*)/, value.toFixed(3));
      }
    }
    
    // If the number starts with a number followed by text, but no space, add a space
    let missingSpaceCheck = measure.match(/^([0-9]*[\.]?[0-9]+)(\S)/);
    if (missingSpaceCheck) {
      if (!missingSpaceCheck[2].match(/[0-9]/)) { // If the second match group(ending) is not a number, add a space between them
        measure = measure.replace(/^([0-9]*[\.]?[0-9]+)(\S)/, '$1 $2');
      }
    }

    // If the measure is just a number, or a number with a space, add " units"
    if (/^(([0-9]*[\.])?[0-9]+ ?)$/.test(measure)) {
      return measure + ' units';
    }

    return measure;
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

        if (mealObj.strArea) {
          meal.tags.push(mealObj.strArea);
        }

        if (mealObj.strCategory) {
          meal.tags.push(mealObj.strCategory);
        }

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
