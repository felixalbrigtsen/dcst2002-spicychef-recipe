import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom'
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';
import type { NewRecipe } from '../../models/NewRecipe';
import AdminView from '../../pages/AdminPage'
import recipeService from '../../services/recipe-service';

const testRecipes = [
  {id: 1,title: "Tunisian Lamb Soup",summary: "Meal from MealDB",imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",created_at: "2022-11-02T19:23:43.000Z",likes: 1,tags: [  "Lamb",  "Soup",  "Tunisian"]},
  {id: 2,title: "Choc Chip Pecan Pie",summary: "Meal from MealDB",imageUrl: "https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg",created_at: "2022-11-02T19:23:51.000Z",likes: 2,tags: ["American","Desert","Dessert","Nutty","Pie","Sweet"]}
]

jest.mock('../../services/recipe-service');
recipeService.getRecipesShort = jest.fn().mockResolvedValue(testRecipes);
          

describe('AdminPage test', () => {
    test('Admin page cannot be accessed by normal user', async () => {
        act(()=>{
            renderWithLoginContext(<Router><AdminView/></Router>, sampleUsers.normal);
        });

        await waitFor(()=>{
            expect(screen.getByText('You are not authorized to view this page')).toBeInTheDocument();
            expect(screen.getByText('Please log in to view this page.')).toBeInTheDocument();
            expect(screen.getByRole('button')).toHaveTextContent('Login');
            expect(screen.getByRole('button').closest('a')).toHaveAttribute('href', '/login');
        });
    });
    
    test('Admin Page Renders with admin user', async () => {
        act(() => {
            renderWithLoginContext(<Router><AdminView/></Router>, sampleUsers.admin);
        });
        await waitFor(() => {
          expect(screen.getByRole('button', {name: 'NewRecipe'})).toBeInTheDocument();
          expect(screen.getByRole('button', {name: "NewRecipe"}).closest('a')).toHaveAttribute('href', '/create')
          expect(screen.getByRole('button', {name: 'ImportRecipe'})).toBeInTheDocument()
          expect(screen.getByRole('table')).toBeInTheDocument()
          expect(screen.getByRole('row')).toBeInTheDocument()
          expect(screen.getByRole('columnheader', {name: "Recipe Title"})).toBeInTheDocument();
          expect(screen.getByRole('columnheader', {name: "View"})).toBeInTheDocument();
          expect(screen.getByRole('columnheader', {name: "Edit"})).toBeInTheDocument();
          expect(screen.getByRole('columnheader', {name: "Delete"})).toBeInTheDocument();
        });
    });

    test('Admin Page Renders with Recipes', async () => {
        act(() => {
            renderWithLoginContext(<Router><AdminView/></Router>, sampleUsers.admin);
        });
        await waitFor(() => {
          testRecipes.forEach((recipe) => {
            expect(screen.getByText(recipe.title)).toBeInTheDocument();
            expect(screen.getByRole('button', {name: recipe.title})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: recipe.title}).closest('a')).toHaveAttribute('href', `/recipes/${recipe.id}`);
            expect(screen.getByRole('button', {name: `Edit ${recipe.title}`})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: `Edit ${recipe.title}`}).closest('a')).toHaveAttribute('href', `/edit/${recipe.id}`);
            expect(screen.getByRole('button', {name: `Delete ${recipe.title}`})).toBeInTheDocument();
          });
        });
    });

    test.skip('Delete works', (done) => {
        act(() => {
            renderWithLoginContext(<Router><AdminView/></Router>, sampleUsers.admin);
        })
        waitFor(() => {
          expect(screen.getByRole('button', {name: 'Delete Tunisian Lamb Soup'})).toBeInTheDocument();
          act(() => {
            fireEvent.click(screen.getByRole('button', {name: 'Delete Tunisian Lamb Soup'}));
          });
          expect(screen.getByText('Do you really want to delete this recipe?')).toBeInTheDocument();
          expect(screen.getByRole('button', {name: 'confirm'})).toBeInTheDocument();
          expect(screen.getByRole('button', {name: 'cancel'})).toBeInTheDocument();
          act(() => {
            fireEvent.click(screen.getByRole('button', {name: 'confirm'}));
          });
          done();
        });
    });

    test('Input for import works', async () => {
      act(() => {
        renderWithLoginContext(<Router><AdminView/></Router>, sampleUsers.admin);
      });
      await waitFor(() => {
        const input = screen.getByLabelText('mealdb-id');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'number');
        expect(input).toHaveAttribute('placeholder', 'MealDB ID');
        expect(input).toHaveValue(null);
        act(() => {
          fireEvent.change(input, {target: {value: 52272}});
        });
        expect(input).toHaveValue(52272);
      });
    });
});