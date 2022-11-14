/**
 * RecipeIngredient
 * @alias RecipeIngredient
 *
 */
export type RecipeIngredient = {
  id: number;
  ingredientName: string;

  /**
   * Number of units of the ingredient
   * @example 1
   */
  quantity: number;
  /**
   * Unit ID from the table recipe_ingredient 
   */
  unitId: number;
  /**
   * Name of unit (dl, g, tbsp. etc.)
   */
  unitName: string;
};

