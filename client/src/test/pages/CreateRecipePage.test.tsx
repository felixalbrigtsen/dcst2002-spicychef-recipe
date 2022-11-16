import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

import CreateRecipePage from '../../pages/CreateRecipePage';

describe('CreateRecipePage test', () => {
    test('CreateRecipePage renders', () => {
      render(<Router><CreateRecipePage/></Router>)
    })
});
