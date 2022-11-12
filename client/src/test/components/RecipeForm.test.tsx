import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import RecipeForm from '../../components/RecipeForm'

const EditRecipe = {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]}
const CreateRecipe = {"id": 0, "title": "", "summary": "", "instructions": "", "servings": 2, "imageUrl": "", "videoUrl": "", "created_at": "", "ingredients": [], "tags": [""], "likes": 0};

describe('test RecipeForm with complete recipe renders correctly', () => {
    test.skip('Correct rendering of input fields', () => {
        const {getAllByRole, getByText} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)

        expect(getAllByRole('textbox').find(input => input.textContent === EditRecipe.title))
        expect(getAllByRole('textbox').find(input => input.textContent === EditRecipe.summary))
        expect(getAllByRole('textbox').find(input => input.textContent === EditRecipe.instructions))
        expect(getAllByRole('textbox').find(input => input.textContent === EditRecipe.imageUrl))
        expect(getAllByRole('textbox').find(input => input.textContent === EditRecipe.videoUrl))
        
        /*
          @Oblivion TODO
        */
    })

    test.skip('Correct rendering of tags', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)
        
        /*
          @Oblivion TODO
        */
    })

    test.skip('Correct rendering of ingredients table', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)
        
        /*
          @Oblivion TODO
        */
    })
})

describe('test RecipeForm functionality', () => {
    test.skip('Title input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Summary input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Instructions input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Servings input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Image URL input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Video URL input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Add tag updates tag list', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Remove tag updates tag list', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })
    
    test.skip('Add ingredient updates ingredient table', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Remove ingredient updates ingredient table', () => {  
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })

    test.skip('Submit button calls onSubmit', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        /*
          @Oblivion TODO
        */
    })
})