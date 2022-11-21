import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import RecipeCard from '../../components/RecipeCard'
import renderWithLoginContext, { sampleUsers, logout } from '../LoginProviderMock';
import { useAlert } from '../../hooks/Alert';
jest.mock('../../hooks/Alert');
const mockAlert = useAlert as jest.MockedFunction<typeof useAlert>;
const mockAppendAlert = jest.fn();
mockAlert.mockReturnValue({ appendAlert: mockAppendAlert, removeAlert: jest.fn(), alerts: [] });

const mockRecipe = {"id": 1, "title": "Tunisian Lamb Soup", "summary": "Meal from MealDB", "instructions": "Add the lamb to a casserole and cook over high heat.", "servings": 2, "imageUrl": "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg", "videoUrl": "https://www.youtube.com/watch?v=w1qgTQmLRe4", "created_at": "2022-11-02T19:23:43.000Z", "ingredients": [{"ingredientId": 1, "unitId": 1, "quantity": 500, "ingredientName": "Lamb Mince", "unitName": "g"}, {"ingredientId": 2, "unitId": 2, "quantity": 2, "ingredientName": "Garlic", "unitName": "cloves minced"}], "tags": ["Lamb", "Soup", "Tunisian"], "likes": 1};

import recipeService from '../../services/recipe-service';
jest.mock('../../services/recipe-service');

describe('Test RecipeCard renders correctly', () => {
    test('RecipeCard Renders Correctly', async () => {
        act(() => {
            render(<Router><RecipeCard recipe={mockRecipe} /></Router>);
        });
        await waitFor(() => {
            expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
            expect(screen.getByText(mockRecipe.title).closest('a')).toHaveAttribute('href', `/recipes/${mockRecipe.id}`);
            expect(screen.getByText(mockRecipe.summary)).toBeInTheDocument();
            expect(screen.getByRole('button')).toHaveAttribute('disabled');
            expect(screen.getByRole('button')).toHaveTextContent(mockRecipe.likes.toString());
            expect(screen.getByRole('img')).toHaveAttribute('src', mockRecipe.imageUrl);
            expect(screen.getByRole('img')).toHaveAttribute('alt', mockRecipe.title);
            expect(screen.getByText('Read More')).toBeInTheDocument();
            expect(screen.getByText('Read More').closest('a')).toHaveAttribute('href', `/recipes/${mockRecipe.id}`);
        });
    });

    test('Test like button', async () => {
        act(() => {
            renderWithLoginContext(
            <Router><RecipeCard recipe={mockRecipe}/></Router>,
            sampleUsers.empty
            );
         });
        await waitFor(() => {
            expect(screen.getByRole('button')).toHaveTextContent(mockRecipe.likes.toString());
            expect(screen.getByRole('button')).not.toHaveAttribute('color', 'info');
            recipeService.addLike = jest.fn().mockResolvedValue(true);
            act(() =>  {
                fireEvent.click(screen.getByRole('button'));
            });
            expect(mockAppendAlert).toHaveBeenCalledWith('Recipe added to liked recipes','success');
            expect(recipeService.addLike).toBeCalledWith(mockRecipe.id);

            recipeService.addLike = jest.fn().mockRejectedValue(true);
            act(() =>  {
                fireEvent.click(screen.getByRole('button'));
            });
            expect(mockAppendAlert).toHaveBeenCalledWith('Failed to add recipe to liked recipes','danger');
            expect(recipeService.addLike).toBeCalledWith(mockRecipe.id);
        });
    });

    test('Test like button already liked', async () => {
        act(() => {
            renderWithLoginContext(
            <Router><RecipeCard recipe={mockRecipe}/></Router>,
            sampleUsers.normal
            );
         });
        await waitFor(() => {
            expect(screen.getByRole('button')).toHaveTextContent(mockRecipe.likes.toString());
            expect(screen.getByRole('button')).not.toHaveAttribute('color', 'success');
            recipeService.removeLike = jest.fn().mockResolvedValue(true);
            act(() =>  {
                fireEvent.click(screen.getByRole('button'));
            });
            expect(mockAppendAlert).toHaveBeenCalledWith('Recipe removed from liked recipes','info');

            recipeService.removeLike = jest.fn().mockRejectedValue(true);
            act(() =>  {
                fireEvent.click(screen.getByRole('button'));
            });
            expect(mockAppendAlert).toHaveBeenCalledWith('Failed to remove recipe from liked recipes','danger');
            expect(recipeService.removeLike).toBeCalledWith(mockRecipe.id);
        });
    });    
});
