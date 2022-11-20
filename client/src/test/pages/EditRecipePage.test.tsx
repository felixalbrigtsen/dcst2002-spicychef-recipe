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

import EditRecipePage from '../../pages/EditRecipePage';

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