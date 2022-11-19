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
import ShoppingListPage from '../../pages/ShoppingListPage';

jest.mock('../../services/ingredient-service', () => {
  class ingredientService {
    getIngredients() {
      return Promise.resolve([
        {
          "id": 1,
          "name": "Lamb Mince"
          },
          {
          "id": 2,
          "name": "Garlic"
          },
          {
          "id": 3,
          "name": "Onion"
          },
          {
          "id": 4,
          "name": "Spinach"
          },
          {
          "id": 5,
          "name": "Tomato Puree"
          },
          {
          "id": 6,
          "name": "Cumin"
          }
      ]);
    }
  }
  return new ingredientService();
});

describe('ShoppingListPage test', () => {
    test('ShoppingListPage blocks non-user', async () => {
        act(()=>{
            render(<Router><ShoppingListPage/></Router>);
        });
        await waitFor(()=>{
          expect(screen.getByText('You are not authorized to view this page')).toBeInTheDocument();
          expect(screen.getByText('Please log in to view this page.')).toBeInTheDocument();
          expect(screen.getByRole('button')).toHaveTextContent('Login');
          expect(screen.getByRole('button').closest('a')).toHaveAttribute('href', '/login');
        });
    });

    test('ShoppingListPage renders for user', async () => {
      act(() => {
        renderWithLoginContext(<Router><ShoppingListPage /></Router>, sampleUsers.normal)
      });

      await waitFor(()=>{
        expect(screen.getByText('Shopping List')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: "clearList"})).toHaveTextContent('Clear all');
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', {name: "Item"})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', {name: "Actions"})).toBeInTheDocument();
      });      
    });

    test.skip('ShoppingList renders with items', async () => {
      act(() => {
        renderWithLoginContext(<Router><ShoppingListPage /></Router>, sampleUsers.normal)
      });

      await waitFor(()=>{
        expect(screen.getByRole("cell", {name: "Garlic"})).toHaveTextContent("Garlic");
        expect(screen.getByRole("cell", {name: "Spinach"})).toHaveTextContent("Spinach");
        expect(screen.getByRole("cell", {name: "Cumin"})).toHaveTextContent("Cumin");
        expect(screen.getByRole("button", {name: "Remove Garlic from shopping list"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Remove Spinach from shopping list"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Remove Cumin from shopping list"})).toBeInTheDocument();
      });
    });
});
