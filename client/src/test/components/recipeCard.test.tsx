import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import RecipeCard from '../../components/RecipeCard'

const Recipe = {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]}

describe('Test RecipeCard renders correctly', () => {
    test('Test rendered text', () => {
        const {getByText} = render(<Router><RecipeCard recipe={Recipe}/></Router>)
    
        expect(getByText(Recipe.title)).toBeInTheDocument();
        expect(getByText(Recipe.summary)).toBeInTheDocument();
        expect(getByText('Read More').closest('a')).toHaveAttribute('href', `/recipes/${Recipe.id}`)
    });

    //TODO: user likes
})