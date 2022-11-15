import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import type { User } from '../../models/User';
import userEvent from '@testing-library/user-event';

import NavBar from '../../components/NavBar'

describe('Test NavBar renders correctly', () => {
    test('Test rendered text', () => {
        const {getByText} = render(<Router><NavBar/></Router>)
    
        expect(getByText('Home')).toBeInTheDocument();
        expect(getByText('Search')).toBeInTheDocument();
        expect(getByText('Ingredients')).toBeInTheDocument();
        expect(getByText('Login')).toBeInTheDocument();
    });
    test('Test links', () => {
        const {getByText} = render(<Router><NavBar/></Router>)
    
        expect(getByText('Home').closest('a')).toHaveAttribute('href', '/')
        expect(getByText('Search').closest('a')).toHaveAttribute('href', '/search')
        expect(getByText('Ingredients').closest('a')).toHaveAttribute('href', '/ingredients')
        expect(getByText('Login').closest('a')).toHaveAttribute('href', '/login')
    });
    test.skip('Navbar renders correctly with logged in admin', () => {
        const {getByText} = render(<Router><NavBar/></Router>)

        expect(getByText('Admin')).toBeInTheDocument();
        expect(getByText('Admin').closest('a')).toHaveAttribute('href', '/admin')
        expect(getByText('Logout')).toBeInTheDocument();
        expect(getByText('Shopping List')).toBeInTheDocument();
        expect(getByText('Shopping List').closest('a')).toHaveAttribute('href', '/list')
        expect(getByText('My Likes')).toBeInTheDocument();
        expect(getByText('My Likes').closest('a')).toHaveAttribute('href', '/likes')
        
    });
})
