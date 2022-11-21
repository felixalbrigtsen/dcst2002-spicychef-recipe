import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import {NewRecipe} from '../../models/NewRecipe';
import RecipeCard from '../../components/RecipeCard';
import RecipeListPage from '../../pages/RecipeListPage';
import recipeService from '../../services/recipe-service'

const testRecipes = [
  {id: 1,title: "Tunisian Lamb Soup",summary: "Meal from MealDB",imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",created_at: "2022-11-02T19:23:43.000Z",likes: 1,tags: [  "Lamb",  "Soup",  "Tunisian"]},
  {id: 2,title: "Choc Chip Pecan Pie",summary: "Meal from MealDB",imageUrl: "https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg",created_at: "2022-11-02T19:23:51.000Z",likes: 2,tags: ["American","Desert","Dessert","Nutty","Pie","Sweet"]}
]
jest.mock('../../services/recipe-service');
recipeService.getRecipesShort = jest.fn().mockResolvedValue(testRecipes);

describe('RecipeListPage test', () => {
    test('RecipeListPage renders', () => {
      act(() => {
        render(<Router><RecipeListPage/></Router>);
      });
    });

    test('RecipeListPage renders with recipes', async () => {
      act(() => {
        render(<Router><RecipeListPage/></Router>);
      });
      await waitFor(() => { 
        expect(screen.getByText('Explore Recipes')).toBeInTheDocument();
        testRecipes.forEach(recipe => {
          expect(screen.getByText(recipe.title)).toBeInTheDocument();
          expect(screen.getByText(recipe.likes.toString())).toBeInTheDocument();
          expect(screen.getByRole('img',{name: recipe.title})).toHaveAttribute('src', recipe.imageUrl);
        });
      });
    });

    test('Select works', async () => {
      act(() => {
        render(<Router><RecipeListPage/></Router>);
      });
      await waitFor(() => {
        const select = screen.getByDisplayValue('Likes');
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue('likes');
        act(() => {
          fireEvent.change(select, { target: { value: 'title' } });
        });
        expect(select).toHaveValue('title');

        act(() => {
          fireEvent.change(select, { target: { value: 'newest' } });
        });
        expect(select).toHaveValue('newest');

        act(() => {
          fireEvent.change(select, { target: { value: 'oldest' } });
        });
        expect(select).toHaveValue('oldest');

        act(() => {
          fireEvent.click(select);
        });
        expect(screen.getByText('Likes')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Newest')).toBeInTheDocument();
        expect(screen.getByText('Oldest')).toBeInTheDocument();
      });
    });
});