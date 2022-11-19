import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'

import IngredientsPage from '../../pages/IngredientsPage';

const mockIngredients = [{id: 1, name: 'Carrot'},{id: 2, name: 'Potato'},{id: 3, name: 'Onion'},{id: 4, name: 'Garlic'}]

jest.mock('../../services/ingredient-service', () => {
    class ingredientService {
      getIngredients() {
        return Promise.resolve(mockIngredients);
      }
    }
    return new ingredientService();
})

const locationAssignMock = jest.fn();

Object.defineProperty(window, 'location', {
  value: { assign: locationAssignMock }
});

describe('IngredientsPage test', () => {
    test('IngredientsPage renders', () => {
      act(() => {
        render(<Router><IngredientsPage/></Router>)
      });
      expect(screen.getByText('Ingredients List')).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'searchAllIngredients'})).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'searchAllIngredients'})).toHaveTextContent('Search Recipes With Selected Ingredients')
      expect(screen.getByRole('button', {name: 'clearSelected'})).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'clearSelected'})).toHaveTextContent('Clear Selection')
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByRole('columnheader', {name: "Ingredient"})).toBeInTheDocument();
      expect(screen.getByRole('columnheader', {name: "Include in search"})).toBeInTheDocument();
      expect(screen.getByRole('columnheader', {name: "Add to shopping list"})).toBeInTheDocument();
    })
    
    test('IngredientsPage renders ingredients', async () => {
      act(() => {
        render(<Router><IngredientsPage/></Router>)
      });
      await waitFor(() => {
        mockIngredients.forEach(ingredient => {
          expect(screen.getByText(ingredient.name)).toBeInTheDocument()
          expect(screen.getByRole('checkbox', {name: `Select ${ingredient.name}`})).toBeInTheDocument()
        })
      })
    })

    test('IngredientsPage search selected ingredients', (done) => {

      act(() => {
        render(<Router><IngredientsPage/></Router>)
      });
  
      setTimeout(() => {
        act(() => {
          fireEvent.click(screen.getByRole('checkbox', {name: `Select ${mockIngredients[0].name}`}))
          fireEvent.click(screen.getByRole('checkbox', {name: `Select ${mockIngredients[1].name}`}))
          fireEvent.click(screen.getByRole('button', {name: 'searchAllIngredients'}));
        });

        expect(locationAssignMock).toHaveBeenCalledWith(`/search/?ingredients=${mockIngredients[0].id}%2C${mockIngredients[1].id}`);
        done();
      }, 1000);
    })
});
