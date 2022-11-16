import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

import LikePage from '../../pages/LikePage';

describe('LikePage test', () => {
    test('LikePage renders', () => {
      render(<LikePage/>)
      expect(screen.getByText('Your Liked Recipes')).toBeInTheDocument()
    })
});