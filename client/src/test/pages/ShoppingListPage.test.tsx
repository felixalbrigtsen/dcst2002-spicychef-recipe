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

describe('ShoppingListPage test', () => {
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
});
