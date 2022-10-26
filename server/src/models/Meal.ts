/**
 * @typedef {Object} Meal
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
