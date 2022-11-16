import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

import EditRecipePage from '../../pages/EditRecipePage';

describe('EditRecipePage test', () => {
    test('EditRecipePage renders', () => {
      render(<Router><EditRecipePage/></Router>)
    })
});