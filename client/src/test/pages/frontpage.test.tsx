import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../../App';
import Home from '../../pages/Frontpage'
import recipeService from '../../services/recipe-service';

const shortRecipes = [
  {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","likes":null,"tags":["Lamb","Soup","Tunisian"]},
  {"id":2,"title":"Choc Chip Pecan Pie","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg","likes":null,"tags":["American","Desert","Dessert","Nutty","Pie","Sweet"]},
  {"id":3,"title":"Bigos (Hunters Stew)","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/md8w601593348504.jpg","likes":null,"tags":["Polish","Pork"]},
  {"id":4,"title":"Turkey Meatloaf","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/ypuxtw1511297463.jpg","likes":null,"tags":["Alcoholic","British","Miscellaneous"]},
  {"id":5,"title":"Beef and Oyster pie","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg","likes":null,"tags":["Beef","British","Pie"]}
]

jest.mock('../../services/recipe-service');
recipeService.getRecipesShort = jest.fn().mockResolvedValue(shortRecipes);

jest.mock('../../services/recipe-service', () => {
  class TaskService {
    getRecipesShort() {
      return Promise.resolve(shortRecipes);
    }

    getRecipe(id: number) {
      return Promise.resolve(shortRecipes.find(t => t.id === id));
    }

    search(query: string) {
      return Promise.resolve(shortRecipes.find(t => t.title.indexOf(query) >= 0)); // Same as: return new Promise((resolve) => resolve(4));
    }
  }
  return new TaskService();
});

test('Navbar is rendered', () => {
  render(<App />);

  waitFor(() => {
    const navbar = <nav className="navbar is-link" role=" navigation" />

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

describe('Frontpage component tests', () => {
  test('Correct welcome text', () => {
    const {getByText} = render(<Router><Home /></Router>)

    expect(getByText('Welcome, Guest')).toBeInTheDocument();
    expect(getByText('This is the SpicyChef Recipe Book')).toBeInTheDocument();
  });

  test.skip('random selected recipe', async () => {
    const {getByText} = render(<Router><Home /></Router>)
    
    await (waitFor(() => {
      let randomRecipeWorks = false
      expect(getByText('Selected Recipe')).toBeInTheDocument();
      for (let i = 0; i < shortRecipes.length; i++) {
        try {
          expect(getByText(shortRecipes[i].title)).toBeInTheDocument()
          expect(getByText(shortRecipes[i].summary)).toBeInTheDocument()
          // expect(getByText('Read more').closest('a')).toHaveAttribute('href', `/recipes/${shortRecipes[i].id}`)
        } catch {
          continue
        }
        randomRecipeWorks = true
      }
      expect(randomRecipeWorks).toBe(true)
    }))
  })
});



