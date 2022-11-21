import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link,
  MemoryRouter
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, getByRole, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';
import RecipePage from '../../pages/RecipePage'
import recipeService from '../../services/recipe-service';
import ingredientService from '../../services/ingredient-service';

import listService from '../../services/list-service';
jest.mock('../../services/recipe-service');
listService.addIngredient = jest.fn().mockResolvedValue(true);

import { useAlert } from '../../hooks/Alert';
jest.mock('../../hooks/Alert');
const mockAlert = useAlert as jest.MockedFunction<typeof useAlert>;
const mockAppendAlert = jest.fn();
mockAlert.mockReturnValue({ appendAlert: mockAppendAlert, removeAlert: jest.fn(), alerts: [] });

const testRecipes = [
  { id: 1, title: "Tunisian Lamb Soup", summary: "Meal from MealDB", instructions: "Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.", servings: 2, imageUrl: "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg", videoUrl: "https://www.youtube.com/watch?v=w1qgTQmLRe4", created_at: new Date(), likes: 0, tags: ["Lamb", "Soup", "Tunisian"], ingredients: [   { ingredientId: 1, unitId: 1, quantity: 1, ingredientName: "Lamb Mince", unitName: "kg" },   { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Garlic", unitName: "cloves minced" }, ],},
  { id: 2, title: "Lasagna", summary: "Self-created meal", servings: 2, instructions: "Garfield", imageUrl: "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/", videoUrl: "https://www.youtube.com/watch?v=qvc4DMiioRc", ingredients: [   { ingredientId: 1, unitId: 1, quantity: 200, ingredientName: "Pasta", unitName: "g" },   { ingredientId: 2, unitId: 2, quantity: 2, ingredientName: "Milk", unitName: "dl" }, ], tags: ["Italian"], likes: 0, created_at: new Date(),},
];

function renderRecipePage(id: number) {
  act(() => {
    renderWithLoginContext(
      <MemoryRouter initialEntries={[`/recipes/${id}`]}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipePage />} />
        </Routes>
      </MemoryRouter>
      ,sampleUsers.empty
      );
    });
  }
  
  jest.mock('../../services/recipe-service');
  recipeService.getRecipe = jest.fn().mockImplementation((id: number) => {
    return Promise.resolve(testRecipes[id]);
  });
  recipeService.addLike = jest.fn().mockResolvedValue(true);
  recipeService.removeLike = jest.fn().mockResolvedValue(true);
  recipeService.removeLike = jest.fn().mockResolvedValue(true);

  jest.mock('../../services/ingredient-service');
  ingredientService.getIngredients = jest.fn().mockResolvedValue(testRecipes.map(recipe => recipe.ingredients).flat());
  
  describe('Recipe page tests', () => {
    test('Correct default text', async () => {
      renderRecipePage(0);
      await waitFor(() => {
        expect(screen.getByText('Servings:')).toBeInTheDocument();
        expect(screen.getByText('Ingredients')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByText('Add Ingredients to List')).toBeInTheDocument();
      });
    });
    
    test('Correct recipe text', async () => {
      renderRecipePage(0);
      await waitFor(() => {
        expect(screen.getByText(testRecipes[0].title)).toBeInTheDocument();
        expect(screen.getByText(testRecipes[0].summary)).toBeInTheDocument();
        expect(screen.getByText(testRecipes[0].instructions)).toBeInTheDocument();
        expect(screen.getByLabelText('servings')).toHaveValue(testRecipes[0].servings);
        testRecipes[0].tags.forEach(tag => {
          expect(screen.getByText(tag)).toBeInTheDocument();
        });
        
        // TODO: Fix this test
        // testRecipes[0].ingredients.forEach(ingredient => {
        //   expect(screen.getByText(`${ingredient.ingredientName} : ${ingredient.quantity} ${ingredient.unitName}`)).toBeInTheDocument();
        // });
      });
    });
    
    test('Correct recipe based on route id', async () => {
      renderRecipePage(1);
      await waitFor(() => {
        expect(screen.getByText(testRecipes[1].title)).toBeInTheDocument();
        expect(screen.getByText(testRecipes[1].summary)).toBeInTheDocument();
        expect(screen.getByText(testRecipes[1].instructions)).toBeInTheDocument();
        expect(screen.getByLabelText('servings')).toHaveValue(testRecipes[1].servings);
        testRecipes[1].tags.forEach(tag => {
          expect(screen.getByText(tag)).toBeInTheDocument();
        });
        // TODO: Fix this test
        // testRecipes[1].ingredients.forEach(ingredient => {
        //   expect(screen.getByText(`${ingredient.ingredientName} : ${ingredient.quantity} ${ingredient.unitName}`)).toBeInTheDocument();
        // });
      });
    });
    
    test('Correct recipe image', async () => {
      renderRecipePage(0);
      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('alt', testRecipes[0].title);
        expect(screen.getByRole('img')).toHaveAttribute('src', testRecipes[0].imageUrl);
      });
    });
    
    test('Correct recipe video', async () => {
      renderRecipePage(0);
      await waitFor(() => {
        const iframe = screen.getByTitle("Embedded youtube");
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', testRecipes[0].videoUrl.replace("watch?v=", "embed/"));
      });
    });
    
    test('Alert shows when you add all ingredients', async () => {
      renderRecipePage(0);
      
      await waitFor(() => {
        const addIngredientsButton = screen.getByText('Add Ingredients to List');
        act(() => {
          fireEvent.click(addIngredientsButton);
        });

        expect(mockAppendAlert).toHaveBeenLastCalledWith(
          'Ingredients added to shopping list',
          'success'
        );
      });
    });
    
    test('Servings input and buttons work', async () =>  {
      renderRecipePage(0);
      
      let servingsInput = screen.getByLabelText('servings');        
      await waitFor(() => {

        expect(servingsInput).toBeInTheDocument();

        act(() => {
          fireEvent.change(servingsInput, {target: {value: 6}});
        });
        expect(servingsInput).toHaveValue(6);
        
        act(() => {
          fireEvent.click(screen.getByRole('button', {name: 'reduceServings'}));
        });
        expect(servingsInput).toHaveValue(5);
        
        act(() => {
          fireEvent.click(screen.getByRole('button', {name: 'increaseServings'}));
        });
        expect(servingsInput).toHaveValue(6);
      });
    });     
    
    test('Likes work', async () => {
      renderRecipePage(1);

      await waitFor(() => {
        const addLike = screen.getByRole('button', {name: 'addLike'})
        expect(addLike).toBeInTheDocument();
        expect(addLike).toHaveTextContent("Like");
        act(() => {
          fireEvent.click(addLike);
        });

        expect(mockAppendAlert).toHaveBeenLastCalledWith("Recipe added to liked recipes", "info");
        expect(recipeService.addLike).toHaveBeenLastCalledWith(testRecipes[1].id);

      });

    });
    test.skip("Remove like works", async () => {
      renderRecipePage(0);
      await waitFor(() => {
        const removeLike = screen.getByRole('button', {name: 'removeLike'})
        expect(removeLike).toBeInTheDocument();
        expect(removeLike).toHaveTextContent('Liked')

        act(() => {
          fireEvent.click(removeLike);
        });

        // TODO: Update when merging into main
        expect(mockAppendAlert).toHaveBeenLastCalledWith("Recipe unliked", "success");
        expect(recipeService.removeLike).toHaveBeenLastCalledWith(testRecipes[0].id);
      });
    });
    
  });