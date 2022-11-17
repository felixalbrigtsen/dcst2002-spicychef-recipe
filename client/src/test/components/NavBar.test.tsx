import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, queryByRole, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import NavBar from '../../components/NavBar'
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';


describe('Test NavBar renders correctly', () => {
    test('Test rendered text', () => {
        act(() => {
            render(<Router><NavBar/></Router>)
        });
    
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Ingredients')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();

        expect(screen.queryByText('Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
        expect(screen.queryByText('Shopping List')).not.toBeInTheDocument();
        expect(screen.queryByText('My Likes')).not.toBeInTheDocument();

    });
    test('User personal links', async () => {
        act(()=>{
            renderWithLoginContext(<Router><NavBar/></Router>, sampleUsers.normal);
        });

        await waitFor(()=>{
            expect(screen.getByText('Logout')).toBeInTheDocument();
            expect(screen.getByText('My Likes')).toBeInTheDocument();
            expect(screen.getByText('Shopping List')).toBeInTheDocument();

            expect(screen.queryByText('Admin')).not.toBeInTheDocument();
            expect(screen.queryByText('Login')).not.toBeInTheDocument();
        }) 
    });

    test('Admin links', async () => {
        act(()=>{
            renderWithLoginContext(<Router><NavBar/></Router>, sampleUsers.admin);
        });

        await waitFor(()=>{
            expect(screen.getByText('Logout')).toBeInTheDocument();
            expect(screen.getByText('My Likes')).toBeInTheDocument();
            expect(screen.getByText('Shopping List')).toBeInTheDocument();
            expect(screen.getByText('Admin')).toBeInTheDocument();

            expect(screen.queryByText('Login')).not.toBeInTheDocument();
        }) 
    });

    test('Test links', () => {
        act(() => {
            render(<Router><NavBar/></Router>)
        });
    
        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/')
        expect(screen.getByText('Search').closest('a')).toHaveAttribute('href', '/search')
        expect(screen.getByText('Ingredients').closest('a')).toHaveAttribute('href', '/ingredients')
        expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login')
    });

    test('Test user and admin links', () => {
        act(()=> {
            renderWithLoginContext(<Router><NavBar/></Router>, sampleUsers.admin);
        });

        expect(screen.getByText('My Likes').closest('a')).toHaveAttribute('href', '/likes')
        expect(screen.getByText('Shopping List').closest('a')).toHaveAttribute('href', '/list')
        expect(screen.getByText('Admin').closest('a')).toHaveAttribute('href', '/admin')

        act(()=>{
            fireEvent.click(screen.getByText('Logout'));
            expect(logout).toHaveBeenCalled();
        });
    });
})
