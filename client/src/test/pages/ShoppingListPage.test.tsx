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

const mockIngredients = [{"id": 1, "name": "Lamb Mince"}, {"id": 2, "name": "Garlic"}, {"id": 3, "name": "Onion"}]

jest.mock('../../services/list-service', () => {
  class listService {
    getIngredients() {
      return Promise.resolve();
    }
    addIngredient() {
      return Promise.resolve();
    }
    removeIngredient() {
      return Promise.resolve();
    }
    getShoppingListItems() {
      return Promise.resolve(mockIngredients);
    }
  }
  return new listService();
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

    test('ShoppingList renders with items', async () => {
      act(() => {
        renderWithLoginContext(<Router><ShoppingListPage /></Router>, sampleUsers.normal)
      });

      await waitFor(()=>{
        mockIngredients.forEach(ingredient => {
          expect(screen.getByRole("cell", {name: ingredient.name})).toHaveTextContent(ingredient.name);
          expect(screen.getByRole('button', {name: `Remove ${ingredient.name} from shopping list`})).toBeInTheDocument();
        });
      });
    });

    test.skip('Remove an item', async () => {
      act(() => {
        renderWithLoginContext(<Router><ShoppingListPage /></Router>, sampleUsers.normal)
      });

      await waitFor(()=>{
        expect(screen.getByRole("cell", {name: "Lamb Mince"})).toHaveTextContent("Lamb Mince");
        expect(screen.getByRole("button", {name: "Remove Lamb Mince from shopping list"})).toBeInTheDocument();
      });

      act(()=>{
        fireEvent.click(screen.getByRole("button", {name: "Remove Lamb Mince from shopping list"}));
      });

      await waitFor(()=>{
        expect(screen.queryByRole("cell", {name: "Lamb Mince"})).not.toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Remove Lamb Mince from shopping list"})).not.toBeInTheDocument();
      });
    });

    test.skip('Clear all items', async () => {
      act(() => {
        renderWithLoginContext(<Router><ShoppingListPage /></Router>, sampleUsers.normal)
      });

      await waitFor(()=>{
        mockIngredients.forEach(ingredient => {
          expect(screen.getByRole("cell", {name: ingredient.name})).toHaveTextContent(ingredient.name);
          expect(screen.getByRole('button', {name: `Remove ${ingredient.name} from shopping list`})).toBeInTheDocument();
        });
      });

      act(()=>{
        fireEvent.click(screen.getByRole("button", {name: "clearList"}));
      });

      await waitFor(()=>{
        mockIngredients.forEach(ingredient => {
          expect(screen.queryByRole("cell", {name: ingredient.name})).not.toBeInTheDocument();
          expect(screen.queryByRole('button', {name: `Remove ${ingredient.name} from shopping list`})).not.toBeInTheDocument();
        });
      });
    });
});
