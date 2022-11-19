import { type RecipeIngredient } from "./RecipeIngredient";

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
  imageUrl: string | undefined;
  videoUrl: string | undefined;
  created_at: string | undefined;
  ingredients: RecipeIngredient[];
  tags: string[];
  likes: number;
};
