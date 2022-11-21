import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';

import LikePage from '../../pages/LikePage';

const testRecipes = [
  {id: 1,title: "Tunisian Lamb Soup",summary: "Meal from MealDB",imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",created_at: "2022-11-02T19:23:43.000Z",likes: 1,tags: [  "Lamb",  "Soup",  "Tunisian"]},
  {id: 3,title: "Choc Chip Pecan Pie",summary: "Meal from MealDB",imageUrl: "https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg",created_at: "2022-11-02T19:23:51.000Z",likes: 2,tags: ["American","Desert","Dessert","Nutty","Pie","Sweet"]},
  {id: 5,title: "Lasagna",summary: "Self-created meal",servings: 2,instructions: "Garfield",imageUrl: "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/",videoUrl: "https://www.youtube.com/watch?v=qvc4DMiioRc",ingredients: [  { ingredientId: 1, unitId: 1, quantity: 200, ingredientName: "Pasta", unitName: "g" },  { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Milk", unitName: "dl" },],tags: ["Italian"],likes: 0,created_at: new Date()},
]

import recipeService from '../../services/recipe-service';
jest.mock('../../services/recipe-service');
recipeService.getRecipesShort = jest.fn().mockResolvedValue(testRecipes);

// Note: Actual functionality, like removing likes or opening cards, are handled by RecipeCard and is not needed here

describe('LikePage test', () => {
    test('LikePage renders', async () => {
      act(() => {
        renderWithLoginContext(<Router><LikePage /></Router>, sampleUsers.normal)
      });
      await waitFor(()=>{
        expect(screen.getByText('Your Liked Recipes')).toBeInTheDocument();
      });
    });

    test('LikePage requires login', async () => {
      act(() => {
        render(<Router><LikePage /></Router>);
      });

      await waitFor(()=>{
        expect(screen.getByText('You are not authorized to view this page')).toBeInTheDocument();
        expect(screen.queryByText('Your Liked Recipes')).not.toBeInTheDocument();
      });
    });

    test('LikePage renders correct recipes', async () => {
      act(() => {
        renderWithLoginContext(<Router><LikePage /></Router>, sampleUsers.normal)
      });

      await waitFor(()=>{
        for (const recipeId of sampleUsers.normal.likes) {
          const recipe = testRecipes.find(recipe => recipe.id === recipeId);
          expect(screen.getByText(recipe!.title)).toBeInTheDocument();
          expect(screen.getByText(recipe!.likes.toString())).toBeInTheDocument();
        }
      });
    });

});