import type { Ingredient } from './RecipeIngredient';

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
  created_at: Date;
  ingredients: Ingredient[];
  tags: string[];
  likes: number;
};
