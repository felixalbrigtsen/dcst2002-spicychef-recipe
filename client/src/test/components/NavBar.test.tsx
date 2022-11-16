import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, queryByRole } from '@testing-library/react';
import '@testing-library/jest-dom'
import type { User } from '../../models/User';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import NavBar from '../../components/NavBar'

jest.mock('axios');
import userService from '../../services/user-service'

describe('Test NavBar renders correctly', () => {
    test('Test rendered text', () => {
        const {getByText} = render(<Router><NavBar/></Router>)
    
        expect(getByText('Home')).toBeInTheDocument();
        expect(getByText('Search')).toBeInTheDocument();
        expect(getByText('Ingredients')).toBeInTheDocument();
        expect(getByText('Login')).toBeInTheDocument();

        expect(screen.queryByText('Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
        expect(screen.queryByText('My Likes')).not.toBeInTheDocument();

    });
    test('Test links', () => {
        const {getByText} = render(<Router><NavBar/></Router>)
    
        expect(getByText('Home').closest('a')).toHaveAttribute('href', '/')
        expect(getByText('Search').closest('a')).toHaveAttribute('href', '/search')
        expect(getByText('Ingredients').closest('a')).toHaveAttribute('href', '/ingredients')
        expect(getByText('Login').closest('a')).toHaveAttribute('href', '/login')
    });
    test.skip('Navbar renders correctly with logged in admin', () => {
        // given 
        const user = {
            googleId: 123,
            name: 'Admin',
            email: 'admin@spicychef.com',
            picture: 'rickroll',
            isAdmin: true,
            likes: [1],
            shoppingList: [1]
        }
        // TODO: mock user service somehow

        const result = userService.getSessionUser();

        expect(axios.get).toHaveBeenCalledWith(`recipe.feal.no/api/auth/profile`);
        expect(result).toEqual(user);
    });
})
