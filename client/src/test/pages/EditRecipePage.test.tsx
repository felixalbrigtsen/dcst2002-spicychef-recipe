import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link,
  MemoryRouter
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';

import recipeService from '../../services/recipe-service';
jest.mock('../../services/recipe-service');
recipeService.getRecipesShort = jest.fn().mockResolvedValue([]);
recipeService.getRecipe = jest.fn().mockResolvedValue(
  {id: 1,title: "Tunisian Lamb Soup",summary: "Meal from MealDB",instructions: "Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.",servings: 2,imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",videoUrl: "https://www.youtube.com/watch?v=w1qgTQmLRe4",created_at: new Date(),likes: 0,tags: ["Lamb", "Soup", "Tunisian"],ingredients: [  { ingredientId: 1, unitId: 1, quantity: 1, ingredientName: "Lamb Mince", unitName: "kg" },  { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Garlic", unitName: "cloves minced" },]},
);

import EditRecipePage from '../../pages/EditRecipePage';

// Note: The details of the form, and all interactive elements, are tested in the RecipeForm.test.tsx file.

function renderEditRecipePage(id: number) {
  act(() => {
    renderWithLoginContext(
      <MemoryRouter initialEntries={[`/recipes/${id}`]}>
        <Routes>
          <Route path="/recipes/:id" element={<EditRecipePage />} />
        </Routes>
      </MemoryRouter>
      ,sampleUsers.admin
      );
    });
  }

describe('EditRecipePage test', () => {
    test('EditRecipePage blocks user', async () => {
      act(() => {
        renderWithLoginContext(<Router><EditRecipePage /></Router>, sampleUsers.normal)
      });
      await waitFor(()=>{
        expect(screen.getByText('You are not authorized to view this page')).toBeInTheDocument();
        expect(screen.getByText('Please log in to view this page.')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Login');
        expect(screen.getByRole('button').closest('a')).toHaveAttribute('href', '/login');
      });
    });
    test('Editpage renders for admin', async () => {
      renderEditRecipePage(1);
    });
});