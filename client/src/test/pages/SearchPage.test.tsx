import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import { type Recipe } from '../../models/Recipe';
import selectEvent from 'react-select-event';
import SearchPage from '../../pages/SearchPage';

import ingredientService from '../../services/ingredient-service';
import recipeService from '../../services/recipe-service';


const testRecipes: Recipe[] = [
  {id: 5,title: "Lasagna",summary: "Self-created meal",servings: 2,instructions: "Garfield",imageUrl: "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/",videoUrl: "https://www.youtube.com/watch?v=qvc4DMiioRc",ingredients: [  { ingredientId: 1, unitId: 1, quantity: 200, ingredientName: "Pasta", unitName: "g" },  { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Milk", unitName: "dl" },],tags: ["Italian"],likes: 0} as Recipe,
  {id: 1,title: "Tunisian Lamb Soup",summary: "Meal from MealDB",instructions: "Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.",servings: 2,imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",videoUrl: "https://www.youtube.com/watch?v=w1qgTQmLRe4",likes: 0,tags: ["Lamb", "Soup", "Tunisian"],ingredients: [  { ingredientId: 1, unitId: 1, quantity: 1, ingredientName: "Lamb Mince", unitName: "kg" },  { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Garlic", unitName: "cloves minced" },]} as Recipe,
  {id: 3,title: "Chicken Soup",summary: "SOUP",servings: 4,instructions: "Boil",imageUrl: "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/1:1/w_2240,c_limit/RoastChicken_RECIPE_080420_37993.jpg",videoUrl: "https://www.youtube.com/watch?v=rX184PQ1UMI",ingredients: [  { ingredientId: 1, unitId: 1, quantity: 1, ingredientName: "Chicken", unitName: "" },  { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Chicken Stock", unitName: "oz" },],tags: ["Chicken"],likes: 0} as Recipe,
]
const testIngredients = testRecipes.map(recipe => recipe.ingredients).flat().map(ingredient => {return {name: ingredient!.ingredientName, id: ingredient!.ingredientId}});

jest.mock('../../services/ingredient-service');
ingredientService.getIngredients = jest.fn().mockResolvedValue([testIngredients]);

jest.mock('../../services/recipe-service');
recipeService.getRecipesShort = jest.fn().mockResolvedValue([testRecipes]);
recipeService.searchRecipeByIngredients = jest.fn().mockImplementation((filterIds: number[]) => {
  return Promise.resolve(testRecipes.filter(recipe => recipe.ingredients!.map(ingredient => ingredient.ingredientId).some(id => filterIds.includes(id))));
});


describe('SearchPage stuff', () => {
  test('renders SearchPage', () => {
    act(() => {
      render(<Router><SearchPage /></Router>);
    });
    expect(screen.getByRole('heading', {name: "Search"})).toHaveTextContent('Search');
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "clearSearch"})).toHaveTextContent('Clear Search');
    expect(screen.getByRole('combobox', {name: "Ingredients"})).toBeInTheDocument();
    expect(screen.getByRole('combobox', {name: "Tags"})).toBeInTheDocument();
  });

  test('Filter by query', async () => {
    act(() => {
      render(<Router><SearchPage /></Router>);
    });

    const searchInput = screen.getByRole('textbox', {name: "Search"});
    act(() => {
      fireEvent.change(searchInput, {target: {value: 'Chicken'}});
    });

    await waitFor(() => {
      expect(screen.getByText('Chicken Soup')).toBeInTheDocument();
      expect(screen.queryByText('Tunisian Lamb Soup')).not.toBeInTheDocument();
      expect(screen.queryByText('Lasagna')).not.toBeInTheDocument();
    });
  });

  test.skip('Filter by tag', async () => {
    render(<Router><SearchPage /></Router>);
    const tagInput = screen.getByRole('combobox', {name: "Tags"});
    await selectEvent.select(tagInput, 'Lamb');
    await waitFor(() => {
      expect(screen.getByText('Tunisian Lamb Soup')).toBeInTheDocument();
      expect(screen.queryByText('Chicken Soup')).not.toBeInTheDocument();
      expect(screen.queryByText('Lasagna')).not.toBeInTheDocument();
    });
  });

  test.skip('Filter by ingredient', async () => {
  });

  test.skip("Fuzzy search works", async () => {
  });

});