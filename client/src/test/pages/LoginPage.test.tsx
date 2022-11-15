import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import LoginPage from '../../pages/LoginPage'

describe('Login page tests', () => {
    test('Correct login text', () => {
        const {getByText} = render(<Router><LoginPage /></Router>)
        expect(getByText("You need to log in to use the app. If you don't have an account, one will be created when you log in with Google.")).toBeInTheDocument();
    });
    test('Correct login button', () => {
        const {getByRole} = render(<Router><LoginPage /></Router>)

        expect(getByRole('link')).toBeInTheDocument();
        expect(getByRole('link')).toHaveAttribute('href', `${process.env.REACT_APP_API_URL}/auth/login`);
        expect(getByRole('img')).toBeInTheDocument();
        expect(getByRole('img')).toHaveAttribute('alt', 'Google Login');
        expect(getByRole('img')).toHaveAttribute('src', '/btn_google_signing_dark.png');
    });
});
