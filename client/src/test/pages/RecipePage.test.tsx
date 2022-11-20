import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, getByRole, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';
import RecipePage from '../../pages/RecipePage'
import { NewRecipe } from '../../models/NewRecipe';

const TestRecipe = {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":1,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]}

jest.mock('../../services/recipe-service', () => {
    class recipeService {
      getRecipesShort() {
        return Promise.resolve()
      }
  
      getRecipe(id: number) {
        return Promise.resolve([
          {
              id: 1,
              title: "Tunisian Lamb Soup",
              summary: "Meal from MealDB",
              instructions: "Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside",
              servings: 2,
              imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",
              videoUrl: "https://www.youtube.com/watch?v=w1qgTQmLRe4",
              created_at: "2022-11-02T19:23:43.000Z",
              likes: 1,
              tags: ["Lamb","Soup","Tunisian"],
              ingredients: [
                {"ingredientId": 1,"unitId": 1,"quantity": 500,"ingredientName": "Lamb Mince","unitName": "g"},
                {"ingredientId": 2,"unitId": 2,"quantity": 2,"ingredientName": "Garlic","unitName": "cloves minced"}
              ]
          }
        ])
      }
    
      search(query: string | undefined) {
        return Promise.resolve()
      }
  
      searchRecipeByIngredients(ingredientIds: number[], mode='all') {
        return Promise.resolve()
      }
  
      createRecipe(recipe: NewRecipe) {
        return Promise.resolve()
      }
  
      updateRecipe(recipe: NewRecipe) {
        return Promise.resolve()
      }
  
      deleteRecipe(id: number) {
        return Promise.resolve()
      }
  
      addLike(id: number) {
        return Promise.resolve()
      }
  
      removeLike(id: number) {
        return Promise.resolve()
      }
    }
    return new recipeService()
  })

describe('Recipe page tests', () => {
    test('Correct default text', (done) => {
      act(() => {render(<Router><RecipePage /></Router>)});
        waitFor(() => {
          expect(screen.getByText('Servings:')).toBeInTheDocument();
          expect(screen.getByText('Ingredients')).toBeInTheDocument();
          expect(screen.getByText('Instructions')).toBeInTheDocument();
          expect(screen.getByText('Add Ingredients to List')).toBeInTheDocument();
          done();
        });
    });

    test.skip('Correct recipe text', (done) => {
      act(() => {render(<Router><RecipePage /></Router>)});
      waitFor(() => {
        expect(screen.getByText(TestRecipe.title)).toBeInTheDocument();
        expect(screen.getByText(TestRecipe.summary)).toBeInTheDocument();
        expect(screen.getByText(TestRecipe.instructions)).toBeInTheDocument();
        expect(screen.getByText(TestRecipe.servings)).toBeInTheDocument();
        expect(screen.getByText(TestRecipe.likes)).toBeInTheDocument();
        TestRecipe.tags.forEach(tag => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
        TestRecipe.ingredients.forEach(ingredient => {
            expect(screen.getByText(ingredient.ingredientName)).toBeInTheDocument();
            expect(screen.getByText(ingredient.quantity)).toBeInTheDocument();
            expect(screen.getByText(ingredient.unitName)).toBeInTheDocument();
        });
        done();
      });
    });

    test.skip('Correct recipe image', (done) => {
        act(() => {render(<Router><RecipePage /></Router>)});
        waitFor(() => {
          expect(screen.getByRole('img')).toBeInTheDocument();
          expect(screen.getByRole('img')).toHaveAttribute('alt', TestRecipe.title);
          expect(screen.getByRole('img')).toHaveAttribute('src', TestRecipe.imageUrl);
          done();
        });
    });

    test.skip('Correct recipe video', (done) => {
        act(() => {render(<Router><RecipePage /></Router>)});
        waitFor(() => {
          expect(screen.getByRole('iframe')).toBeInTheDocument();
          expect(screen.getByRole('iframe')).toHaveAttribute('title', TestRecipe.title);
          expect(screen.getByRole('iframe')).toHaveAttribute('src', TestRecipe.videoUrl.replace("watch?v=", "embed/"));
          done();
        });
    });

    test.skip('Alert shows when you add all ingredients', (done) => {
        act(() => {
            renderWithLoginContext(<Router><RecipePage /></Router>, sampleUsers.normal)
        });

        waitFor(() => {
          expect(screen.getByText('Ingredients added to list')).toBeInTheDocument();
          done();
        });
    });

    test.skip('Servings input and buttons work', (done) =>  {
        act(() => {render(<Router><RecipePage /></Router>)});
        waitFor(() => {
          const servingsInput = screen.getByRole('textbox', {name: 'servings'});
          expect(servingsInput).toBeInTheDocument();
          expect(servingsInput).toHaveValue(2);
          fireEvent.change(servingsInput, {target: {value: 4}});
          expect(servingsInput).toHaveValue(4);
          fireEvent.click(screen.getByRole('button', {name: 'reduceServings'}));
          expect(servingsInput).toHaveValue(3);
          fireEvent.click(screen.getByRole('button', {name: 'increaseServings'}));
          expect(servingsInput).toHaveValue(4);
          done();
      });
    });     
    test.skip('Likes work', () => {
        // Need user login to test
    });
    
});