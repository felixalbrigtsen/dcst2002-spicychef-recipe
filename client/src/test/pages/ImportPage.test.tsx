import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

import ImportPage from '../../pages/ImportPage';

describe('ImportPage test', () => {
    test('ImportPage renders', () => {
      render(<Router><ImportPage/></Router>)
      expect(screen.getByText('Import Page')).toBeInTheDocument()
    })
});