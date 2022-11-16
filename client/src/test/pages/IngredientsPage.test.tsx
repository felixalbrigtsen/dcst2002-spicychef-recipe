import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

import IngredientsPage from '../../pages/IngredientsPage';

const mockIngredients = [{id: 1, name: 'Carrot'},{id: 2, name: 'Potato'},{id: 3, name: 'Onion'},{id: 4, name: 'Garlic'}]

jest.mock('../../services/ingredient-service', () => {
    class ingredientService {
      getIngredients() {
        return Promise.resolve([
          {id: 1, name: 'Carrot'},
          {id: 2, name: 'Potato'},
          {id: 3, name: 'Onion'},
          {id: 4, name: 'Garlic'}
        ])
      }
    }
    return new ingredientService();
})

describe('IngredientsPage test', () => {
    test('IngredientsPage renders', () => {
      render(<Router><IngredientsPage/></Router>)
      expect(screen.getByText('Ingredients List')).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'searchAllIngredients'})).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'searchAllIngredients'})).toHaveTextContent('Search Recipes Including All')
      expect(screen.getByRole('button', {name: 'searchAnyIngredients'})).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'searchAnyIngredients'})).toHaveTextContent('Search Recipes Including Any')
      expect(screen.getByRole('button', {name: 'clearSelected'})).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'clearSelected'})).toHaveTextContent('Clear Selection')
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByRole('columnheader', {name: "Ingredient"})).toBeInTheDocument();
      expect(screen.getByRole('columnheader', {name: "Include"})).toBeInTheDocument();
      expect(screen.getByRole('columnheader', {name: "Add"})).toBeInTheDocument();
    })

    test('IngredientsPage renders ingredients', async () => {
      render(<Router><IngredientsPage/></Router>)
      await waitFor(() => {
      mockIngredients.forEach(ingredient => {
        expect(screen.getByText(ingredient.name)).toBeInTheDocument()
      })
      })
    })
});