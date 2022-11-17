import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import RecipeCard from '../../components/RecipeCard'

const Recipe = {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]}

describe('Test RecipeCard renders correctly', () => {
    test('Test rendered text', () => {
        const {getByText} = render(<Router><RecipeCard recipe={Recipe}/></Router>)
    
        expect(getByText(Recipe.title)).toBeInTheDocument();
        expect(getByText(Recipe.summary)).toBeInTheDocument();
        expect(getByText('Read More').closest('a')).toHaveAttribute('href', `/recipes/${Recipe.id}`)
        expect(getByText('0')).toBeInTheDocument();
    });

    test('Test image', () => {
        const {getByAltText} = render(<Router><RecipeCard recipe={Recipe}/></Router>)

        expect(getByAltText(Recipe.title)).toBeInTheDocument();
        expect(getByAltText(Recipe.title)).toHaveAttribute('src', Recipe.imageUrl)
    });

    test('Test like button', () => {
        const {getByRole} = render(<Router><RecipeCard recipe={Recipe}/></Router>)

        expect(getByRole('button')).toBeInTheDocument();
        expect(getByRole('button')).toHaveTextContent(`${Recipe.likes}`)

        fireEvent.click(getByRole('button'));
        // expect(getByRole('button')).toHaveTextContent('Liked')
        // TODO: Need user to test this probably
    });

    //TODO: user likes
})