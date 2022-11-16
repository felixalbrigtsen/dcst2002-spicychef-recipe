import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import {NewRecipe} from '../../models/NewRecipe';
import RecipeCard from '../../components/RecipeCard';
import RecipeListPage from '../../pages/RecipeListPage';

jest.mock('../../services/recipe-service', () => {
  class recipeService {
    getRecipesShort() {
      return Promise.resolve([
      {
      id: 1,
      title: "Tunisian Lamb Soup",
      summary: "Meal from MealDB",
      imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",
      created_at: "2022-11-02T19:23:43.000Z",
      likes: 1,
      tags: [
        "Lamb",
        "Soup",
        "Tunisian"
      ]
    },
    {
      id: 2,
      title: "Choc Chip Pecan Pie",
      summary: "Meal from MealDB",
      imageUrl: "https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg",
      created_at: "2022-11-02T19:23:51.000Z",
      likes: 2,
      tags: ["American","Desert","Dessert","Nutty","Pie","Sweet"]
    },
    ])}

    getRecipe(id: number) {
      return Promise.resolve()
    }
  
    search(query: string | undefined) {
      return Promise.resolve()
    }

    searchRecipeByIngredients(ingredientIds: number[], mode='all') {
      return Promise.resolve()
    }

    createRecipe(recipe: NewRecipe) {
      return Promise.resolve()
    }

    updateRecipe(recipe: NewRecipe) {
      return Promise.resolve()
    }

    deleteRecipe(id: number) {
      return Promise.resolve()
    }

    addLike(id: number) {
      return Promise.resolve()
    }

    removeLike(id: number) {
      return Promise.resolve()
    }
  }
  return new recipeService()
})

describe('RecipeListPage test', () => {
    test('RecipeListPage renders', () => {
      render(<Router><RecipeListPage/></Router>)
    })
    test('RecipeListPage renders with recipes', async () => {
      render(<Router><RecipeListPage/></Router>)
      await waitFor(() => screen.getByText('Tunisian Lamb Soup'))
      await waitFor(() => screen.getByText('Choc Chip Pecan Pie'))
    })
});