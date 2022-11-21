import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import ingredientService from '../../services/ingredient-service';
import IngredientsPage from '../../pages/IngredientsPage';
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';

import { useAlert } from '../../hooks/Alert';
import listService from '../../services/list-service';
jest.mock('../../hooks/Alert');
const mockAlert = useAlert as jest.MockedFunction<typeof useAlert>;
const mockAppendAlert = jest.fn();
mockAlert.mockReturnValue({ appendAlert: mockAppendAlert, removeAlert: jest.fn(), alerts: [] });

const mockIngredients = [{id: 1, name: 'Carrot'},{id: 2, name: 'Potato'},{id: 3, name: 'Onion'},{id: 4, name: 'Garlic'}]

jest.mock('../../services/ingredient-service');
ingredientService.getIngredients = jest.fn().mockResolvedValue(mockIngredients);

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
    });
    
    test('IngredientsPage renders ingredients', async () => {
      act(() => {
        render(<Router><IngredientsPage/></Router>)
      });
      await waitFor(() => {
        mockIngredients.forEach(ingredient => {
          expect(screen.getByText(ingredient.name)).toBeInTheDocument()
          expect(screen.getByRole('checkbox', {name: `Select ${ingredient.name}`})).toBeInTheDocument()
          expect(screen.getByRole('button', {name: `Add ${ingredient.name} to list`})).toBeInTheDocument()
        });
      });
    });

    test('IngredientsPage renders buttons for user', async () => {
      act(() => {
        renderWithLoginContext(<Router><IngredientsPage/></Router>, sampleUsers.empty)
      });
      await waitFor(() => {
        expect(screen.getByRole('button', {name: 'addSelectedToList'})).toBeInTheDocument()
        mockIngredients.forEach(ingredient => {
          expect(screen.getByRole('button', {name: `Add ${ingredient.name} to list`})).not.toHaveAttribute('disabled', true)
        });
      });
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
    });

    test('IngredientsPage search updates', () => {
      act(() => {
        render(<Router><IngredientsPage/></Router>)
      });
      
      const search = screen.getByPlaceholderText('Search for ingredients');
      expect(search).toBeInTheDocument();
      expect(search).toHaveValue('');
      act(() => {fireEvent.change(search, { target: { value: 'Carrot' } })});
      expect(search).toHaveValue('Carrot');
    });

    test.skip('Add all ingredients to list works', (done) => {
      listService.addIngredient = jest.fn().mockResolvedValue(true);
      act(() => {
        renderWithLoginContext(<Router><IngredientsPage/></Router>, sampleUsers.empty)
      });
      setTimeout(() => {
        act(() => {
          fireEvent.click(screen.getByRole('checkbox', {name: `Select ${mockIngredients[0].name}`}))
          fireEvent.click(screen.getByRole('button', {name: 'addSelectedToList'}));
        });
        expect(mockAlert).toHaveBeenLastCalledWith("Ingredients added to list", "success"); 
        done();
      }, 1000);
    });

    test.skip('Add all ingredients to list fails', (done) => {
      listService.addIngredient = jest.fn().mockRejectedValue(true);
      act(() => {
        renderWithLoginContext(<Router><IngredientsPage/></Router>, sampleUsers.empty)
      });
      setTimeout(() => {
        act(() => {
          fireEvent.click(screen.getByRole('checkbox', {name: `Select ${mockIngredients[0].name}`}))
          fireEvent.click(screen.getByRole('button', {name: 'addSelectedToList'}));
        });
        expect(mockAlert).toHaveBeenLastCalledWith("Error adding ingredients to list", "danger"); 
        done();
      }, 1000);
    });

    test.skip('Add ingredient to list works', async () => {
      listService.addIngredient = jest.fn().mockResolvedValue(true);
      act(() => {
        renderWithLoginContext(<Router><IngredientsPage/></Router>, sampleUsers.empty)
      });
      await waitFor(() => {
        act(() => {
          fireEvent.click(screen.getByRole('button', {name: `Add ${mockIngredients[2].name} to list`}));
        })
        expect(mockAlert).toHaveBeenLastCalledWith(`${mockIngredients[2].name} added to list`, "success");
      });
    });
});
