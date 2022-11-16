import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import selectEvent from 'react-select-event';
import SearchPage from '../../pages/SearchPage';

describe('SearchPage stuff', () => {
  test('renders SearchPage', () => {
    render(<Router><SearchPage /></Router>);
    expect(screen.getByRole('heading', {name: "Search"})).toHaveTextContent('Search');
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "clearSearch"})).toHaveTextContent('Clear Search');
    expect(screen.getByRole('combobox', {name: "Ingredients"})).toBeInTheDocument();
    expect(screen.getByRole('combobox', {name: "Tags"})).toBeInTheDocument();
  });
  test.skip('Search button works', () => {
    
  });
  test.skip('Select tags works', () => {

  })

  test.skip('Remove tags work', () => {

  })

  test.skip('Select ingredients works', () => {

  })

  test.skip('Remove ingredients work', () => {

  })

});