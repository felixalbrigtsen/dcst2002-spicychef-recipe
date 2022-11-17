/**
 * NewRecipe
 * @alias NewRecipe
 *
 */
export type NewRecipe = {
  id: number;
  title: string;
  summary: string;
  servings: number;
  instructions: string;
  imageUrl: string;
  videoUrl: string;
  ingredients: { ingredientName: string; quantity: number; unitName: string }[];
  tags: string[];
};

// TODO: JsDoc this
