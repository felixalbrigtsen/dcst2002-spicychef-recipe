import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import PageNotFound from '../../pages/PageNotFound';

describe('Page not found tests', () => {
    test('Correct text', () => {
        const {getByText} = render(<Router><PageNotFound /></Router>)
        expect(getByText("404 - Page Not Found")).toBeInTheDocument();
        expect(getByText("Sorry, the page you are looking for does not exist.")).toBeInTheDocument();
    });
    test('Correct link', () => {
        const {getByRole} = render(<Router><PageNotFound /></Router>)

        expect(getByRole('link')).toBeInTheDocument();
        expect(getByRole('link')).toHaveAttribute('href', '/');
        expect(getByRole('button')).toBeInTheDocument();
        expect(getByRole('button')).toHaveTextContent('Go home!');
    });
    test('Correct GIF', () => {
        const {getByRole} = render(<Router><PageNotFound /></Router>)

        expect(getByRole('img')).toBeInTheDocument();
        expect(getByRole('img')).toHaveAttribute('alt', 'Page not found');
        expect(getByRole('img')).toHaveAttribute('src', '/404.gif');
    });
});