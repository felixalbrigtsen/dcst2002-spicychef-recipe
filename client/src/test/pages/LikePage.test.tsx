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

import LikePage from '../../pages/LikePage';

describe('LikePage test', () => {
    test('LikePage renders', async () => {
      act(() => {
        renderWithLoginContext(<Router><LikePage /></Router>, sampleUsers.normal)
      });
      await waitFor(()=>{
        expect(screen.getByText('Your Liked Recipes')).toBeInTheDocument();
      });
    });
});