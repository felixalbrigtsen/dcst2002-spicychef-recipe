import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../../App';
import Home from '../../pages/Frontpage'
import recipeService from '../../services/recipe-service';
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';

const shortRecipes = [
  {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","likes":5,"tags":["Lamb","Soup","Tunisian"]},
  {"id":2,"title":"Choc Chip Pecan Pie","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg","likes":2,"tags":["American","Desert","Dessert","Nutty","Pie","Sweet"]},
  {"id":3,"title":"Bigos (Hunters Stew)","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/md8w601593348504.jpg","likes":4,"tags":["Polish","Pork"]},
  {"id":4,"title":"Turkey Meatloaf","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/ypuxtw1511297463.jpg","likes":3,"tags":["Alcoholic","British","Miscellaneous"]},
  {"id":5,"title":"Beef and Oyster pie","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg","likes":5,"tags":["Beef","British","Pie"]}
]

const locationAssignMock = jest.fn();
Object.defineProperty(window, 'location', {
  value: { assign: locationAssignMock }
});

jest.mock('../../services/recipe-service');
recipeService.getRecipesShort = jest.fn().mockResolvedValue(shortRecipes);

test('Navbar is rendered', () => {
  act(()=> {
    render(<App />);
  });

  waitFor(() => {
    const navbar = <nav className="navbar is-link" role=" navigation" />

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

describe('Frontpage component tests', () => {
  test('Renders correctly with no user', async () => {
    act(() => {
      render(<Router><Home /></Router>)
    });

    await waitFor(() => {
      expect(screen.getByText('Welcome, Guest')).toBeInTheDocument();
      expect(screen.getByText('This is the SpicyChef Recipe Book')).toBeInTheDocument();

      expect(screen.getByText('Recipes')).toBeInTheDocument();
      expect(screen.getByText('Explore Recipes')).toBeInTheDocument();
      expect(screen.getByText('Explore Recipes').closest('a')).toHaveAttribute('href', '/recipes');

      expect(screen.getByText('Explore SpicyChef')).toBeInTheDocument();
      expect(screen.getByText('Useful links')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ingredients' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ingredients' }).closest('a')).toHaveAttribute('href', '/ingredients');
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Search' }).closest('a')).toHaveAttribute('href', '/search');
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' }).closest('a')).toHaveAttribute('href', '/login');

      expect(screen.getByText('Most Liked Recipes')).toBeInTheDocument();
      expect(screen.getByText('Try out our favorites')).toBeInTheDocument();
      // find 3 most liked recipes and check that they are rendered
      expect(screen.getByText('Tunisian Lamb Soup')).toBeInTheDocument();
      expect(screen.getByText('Tunisian Lamb Soup').closest('a')).toHaveAttribute('href', '/recipes/1');
      expect(screen.getByText('Bigos (Hunters Stew)')).toBeInTheDocument();
      expect(screen.getByText('Bigos (Hunters Stew)').closest('a')).toHaveAttribute('href', '/recipes/3');
      expect(screen.getByText('Beef and Oyster pie')).toBeInTheDocument();
      expect(screen.getByText('Beef and Oyster pie').closest('a')).toHaveAttribute('href', '/recipes/5');
    });
  });

  test('Renders correctly with user', async () => {
    act(() => {
      renderWithLoginContext(<Router><Home /></Router>, sampleUsers.normal);
    });

    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User 1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Shopping List' })).toBeInTheDocument();
    });
  });

  test('Search works', (done) => {
    act(() => {
      renderWithLoginContext(<Router><Home /></Router>, sampleUsers.normal);
    });

    waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search for a recipe');
      expect(searchInput).toBeInTheDocument();

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'test' } });
      });

      expect(searchInput).toHaveDisplayValue('test');
      
      act(() => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 13, charCode: 13 });
      })
  

      expect(locationAssignMock).toHaveBeenCalledWith(`/search/?q=test`);
      done();
    });
  });

});



