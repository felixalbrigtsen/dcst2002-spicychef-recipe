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
import recipeService from '../../services/recipe-service';

jest.mock('../../services/recipe-service');
recipeService.getRecipesShort = jest.fn().mockResolvedValue([]);

import CreateRecipePage from '../../pages/CreateRecipePage';

describe('CreateRecipePage test', () => {
    test('CreateRecipePage requires admin', async () => {
      act(() => {
        renderWithLoginContext(<Router><CreateRecipePage /></Router>, sampleUsers.normal)
      });
      await waitFor(()=>{
        expect(screen.getByText('You are not authorized to view this page')).toBeInTheDocument();
        expect(screen.getByText('Please log in to view this page.')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Login');
        expect(screen.getByRole('button').closest('a')).toHaveAttribute('href', '/login');
      });
    });

    test('CreateRecipePage renders for admin', async () => {
      act(() => {
        renderWithLoginContext(<Router><CreateRecipePage /></Router>, sampleUsers.admin)
      });
    });
});
