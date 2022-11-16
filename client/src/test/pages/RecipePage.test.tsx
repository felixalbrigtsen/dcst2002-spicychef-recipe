import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, getByRole } from '@testing-library/react';
import '@testing-library/jest-dom'
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
    test('Recipe renders correctly', async () => {
        render(<Router><RecipePage /></Router>)
    });
    test('Correct default text', () => {
        const {getByText} = render(<Router><RecipePage /></Router>)
        expect(getByText('Servings:')).toBeInTheDocument();
        expect(getByText('Ingredients')).toBeInTheDocument();
        expect(getByText('Instructions')).toBeInTheDocument();
        expect(getByText('Add Ingredients to List')).toBeInTheDocument();
    });
    test('Correct recipe text', () => {
        const {getByText} = render(<Router><RecipePage /></Router>)
        setTimeout(() => {
        expect(getByText(TestRecipe.title)).toBeInTheDocument();
        expect(getByText(TestRecipe.summary)).toBeInTheDocument();
        expect(getByText(TestRecipe.instructions)).toBeInTheDocument();
        expect(getByText(TestRecipe.servings)).toBeInTheDocument();
        expect(getByText(TestRecipe.likes)).toBeInTheDocument();
        TestRecipe.tags.forEach(tag => {
            expect(getByText(tag)).toBeInTheDocument();
        });
        TestRecipe.ingredients.forEach(ingredient => {
            expect(getByText(ingredient.ingredientName)).toBeInTheDocument();
            expect(getByText(ingredient.quantity)).toBeInTheDocument();
            expect(getByText(ingredient.unitName)).toBeInTheDocument();
        });
        })
    });
    test('Correct recipe image', () => {
        const {getByRole} = render(<Router><RecipePage /></Router>)
        setTimeout(() => {
        expect(getByRole('img')).toBeInTheDocument();
        expect(getByRole('img')).toHaveAttribute('alt', TestRecipe.title);
        expect(getByRole('img')).toHaveAttribute('src', TestRecipe.imageUrl);
        })
    });
    test('Correct recipe video', () => {
        const {getByRole} = render(<Router><RecipePage /></Router>)
        setTimeout(() => {
        expect(getByRole('iframe')).toBeInTheDocument();
        expect(getByRole('iframe')).toHaveAttribute('title', TestRecipe.title);
        expect(getByRole('iframe')).toHaveAttribute('src', TestRecipe.videoUrl.replace("watch?v=", "embed/"));
        })
    });
    test('Alert shows when you add all ingredients', () => {
        const {getByText} = render(<Router><RecipePage /></Router>)
        setTimeout(() => {
        fireEvent.click(screen.getByRole('button', {name: 'Add Ingredients to List'}));
        expect(getByText('Ingredients added to shopping list')).toBeInTheDocument();
        })
    });
    test('Servings input and buttons work', () =>  {
        render(<Router><RecipePage /></Router>)
        setTimeout(() => {
        const servingsInput = screen.getByRole('textbox', {name: 'servings'});
        expect(servingsInput).toBeInTheDocument();
        expect(servingsInput).toHaveValue(2);
        fireEvent.change(servingsInput, {target: {value: 4}});
        expect(servingsInput).toHaveValue(4);
        fireEvent.click(screen.getByRole('button', {name: 'reduceServings'}));
        expect(servingsInput).toHaveValue(3);
        fireEvent.click(screen.getByRole('button', {name: 'increaseServings'}));
        expect(servingsInput).toHaveValue(4);
    })
    });     
    test.skip('Likes work', () => {
        // Need user login to test
    });
    
});