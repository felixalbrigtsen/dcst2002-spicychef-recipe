import * as React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link
} from 'react-router-dom';

import { getByAltText, render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'

import ImageSlider from '../../components/ImageSlider';

const recipeList = 
        [{"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"ingredientId":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"ingredientId":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]},
        {"id": 2,"title": "Choc Chip Pecan Pie","summary": "Meal from MealDB","instructions":"Make the pie","servings":2,"imageUrl": "https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg","videoUrl": "https://www.youtube.com/watch?v=fDpoT0jvg4Y","created_at": "2022-11-02T19:23:51.000Z","recipeId":null,"likes": 1,"tags": ["American","Desert","Dessert","Nutty","Pie","Sweet"], "ingredients": [{"ingredientId": 14,"unitId": 1,"quantity": 300,"ingredientName": "Plain Flour","unitName": "g"},{"ingredientId": 15,"unitId": 1,"quantity": 75,"ingredientName": "Butter","unitName": "g"}]}];

describe('ImageSlider test', () => {
    test('Test rendered image', () => {
        act(() => {render(<ImageSlider slides={recipeList}/>)})
        waitFor(() => {
            expect(screen.getByRole('img')).toHaveAttribute('src', 'https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg');
            expect(screen.getByRole('img')).toHaveAttribute('alt', 'recipe');
            expect(screen.getByRole('img').closest('a')).toHaveAttribute('href', '/recipes/1');
        });
    });
});
