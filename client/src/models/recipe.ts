import type { Ingredient } from './ingredient';

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
  
