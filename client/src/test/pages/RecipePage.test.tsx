import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import RecipePage from '../../pages/RecipePage'
import App from '../../App';

const TestRecipe = {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]}

// jest.mock('../../services/recipe-service', () => {
//     class TaskService {
//         getRecipesShort() {
//           return Promise.resolve(TestRecipe.id);
//         }
//     }
//     return new TaskService();
//   });

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
    test.skip('Correct recipe text', () => {
        const {getByText} = render(<Router><RecipePage /></Router>)

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
    });
    test.skip('Correct recipe image', () => {
        const {getByRole} = render(<Router><RecipePage /></Router>)
        expect(getByRole('img')).toBeInTheDocument();
        expect(getByRole('img')).toHaveAttribute('alt', TestRecipe.title);
        expect(getByRole('img')).toHaveAttribute('src', TestRecipe.imageUrl);
    });
});