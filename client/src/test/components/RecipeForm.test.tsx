import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, getByTestId, getByText } from '@testing-library/react';
import '@testing-library/jest-dom'
import selectEvent from 'react-select-event'
import CreatableSelect from 'react-select/creatable'
import RecipeForm from '../../components/RecipeForm'
import recipeService from '../../services/recipe-service';
import axios from 'axios';

const EditRecipe = {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat.", "servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":0,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"ingredientId":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"ingredientId":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"}]}
const CreateRecipe = {"id": 0, "title": "", "summary": "", "instructions": "", "servings": 2, "imageUrl": "", "videoUrl": "", "created_at": "", "ingredients": [], "tags": [""], "likes": 0};
const mockRecipe = {"id": 1, "title": "Tunisian Lamb Soup", "summary": "Meal from MealDB", "instructions": "Add the lamb to a casserole and cook over high heat.", "servings": 2, "imageUrl": "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg", "videoUrl": "https://www.youtube.com/watch?v=w1qgTQmLRe4", "created_at": "2022-11-02T19:23:43.000Z", "ingredients": [{"ingredientId": 1, "unitId": 1, "quantity": 500, "ingredientName": "Lamb Mince", "unitName": "g"}, {"ingredientId": 2, "unitId": 2, "quantity": 2, "ingredientName": "Garlic", "unitName": "cloves minced"}], "tags": ["Lamb", "Soup", "Tunisian"], "likes": 0};

describe('test RecipeForm with complete recipe renders correctly', () => {
    test.skip('Correct rendering of input field values', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)

        expect(getByRole('textbox', {name: "Title"})).toHaveValue('Tunisian Lamb Soup')
        expect(getByRole('textbox', {name: "Summary"})).toHaveValue('Meal from MealDB')
        expect(getByRole('textbox', {name: "Instructions"})).toHaveValue('Add the lamb to a casserole and cook over high heat.')
        expect(getByRole('spinbutton', {name: "Servings"})).toHaveValue(2)
        expect(getByRole('textbox', {name: "ImageURL"})).toHaveValue('https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg')
        expect(getByRole('textbox', {name: "VideoURL"})).toHaveValue('https://www.youtube.com/watch?v=w1qgTQmLRe4')
    })

    test('All labels render', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)

        expect(getByText('Recipe Title')).toBeInTheDocument()
        expect(getByText('Recipe Summary')).toBeInTheDocument()
        expect(getByText('Recipe Instructions')).toBeInTheDocument()
        expect(getByText('Recipe Servings')).toBeInTheDocument()
        expect(getByText('Recipe Image Link')).toBeInTheDocument()
        expect(getByText('Recipe Video Link')).toBeInTheDocument()
        expect(getByText('Recipe Ingredients')).toBeInTheDocument()
        expect(getByText('Recipe Tags')).toBeInTheDocument()
    })

    test.skip('Correct rendering of tags', () => {
        const {getByRole, getByTestId} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)
        
        const tagSelect = getByRole('combobox', {name: "Tags"})
        expect(tagSelect).toBeInTheDocument()
        expect(tagSelect).toHaveFormValues({tags: ['Lamb', 'Soup', 'Tunisian']})
        
        // TODO: Make this better and use states and shit i fucking hate this shit we should have started way earlier
    })

    test('Correct options of tags are displayed', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)
        const tagSelect = getByRole('combobox', {name: "Tags"})
        expect(tagSelect).toBeInTheDocument()
        selectEvent.openMenu(tagSelect)
        expect(getByText('Lamb')).toBeInTheDocument()
        expect(getByText('Soup')).toBeInTheDocument()
    })

    test('Correct rendering of ingredient table', () => {
        const {getByRole, getAllByRole, getByText} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)

        expect(getByRole('table')).toBeInTheDocument();
        expect(getByRole('columnheader',{name: "Ingredient"})).toBeInTheDocument();
        expect(getByRole('columnheader',{name: "Quantity"})).toBeInTheDocument();
        expect(getByRole('columnheader',{name: "Unit"})).toBeInTheDocument();
        expect(getByRole('columnheader',{name: "Delete"})).toBeInTheDocument();

        EditRecipe.ingredients.forEach(ingredient => {
          expect(getByRole('cell', {name: ingredient.ingredientName})).toBeInTheDocument();
          expect(getByRole('cell', {name: ingredient.ingredientName})).toBeInTheDocument();
          expect(getByRole('cell', {name: ingredient.ingredientName})).toBeInTheDocument();
          expect(getByRole('button', {name: `Remove ${ingredient.ingredientName}`})).toBeInTheDocument();
        })
    })
})

describe('test RecipeForm functionality', () => {
    test('Title input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        const titleInput = getByRole('textbox', {name: "Title"})
        expect(titleInput).toHaveValue('')
        fireEvent.change(titleInput, {target: {value: 'Tuna Salad'}});
        expect(titleInput).toHaveValue('Tuna Salad')
    })

    test('Summary input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        const summaryInput = getByRole('textbox', {name: "Summary"})
        expect(summaryInput).toHaveValue('')
        fireEvent.change(summaryInput, {target: {value: 'Meal from MealDB'}});
        expect(summaryInput).toHaveValue('Meal from MealDB')
    })

    test('Instructions input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        const instructionsInput = getByRole('textbox', {name: "Instructions"})
        expect(instructionsInput).toHaveValue('')
        fireEvent.change(instructionsInput, {target: {value: 'Add the tuna to a bowl and mix with the other ingredients.'}});
        expect(instructionsInput).toHaveValue('Add the tuna to a bowl and mix with the other ingredients.')
    })

    test('Servings input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        const servingsInput = getByRole('spinbutton', {name: "Servings"})
        expect(servingsInput).toHaveValue(2)
        fireEvent.change(servingsInput, {target: {value: 5}});
        expect(servingsInput).toHaveValue(5)
    })

    test('Image URL input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        const imageURLInput = getByRole('textbox', {name: "ImageURL"})
        expect(imageURLInput).toHaveValue('')
        fireEvent.change(imageURLInput, {target: {value: 'https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg'}});
        expect(imageURLInput).toHaveValue('https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg')
    })

    test('Video URL input updates', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        const videoURLInput = getByRole('textbox', {name: "VideoURL"})
        expect(videoURLInput).toHaveValue('')
        fireEvent.change(videoURLInput, {target: {value: 'https://www.youtube.com/watch?v=w1qgTQmLRe4'}});
        expect(videoURLInput).toHaveValue('https://www.youtube.com/watch?v=w1qgTQmLRe4')
    })

    test('Add tag updates tag list', () => {
        const { getByRole, getByLabelText } = render(<RecipeForm recipe={CreateRecipe} />);


    })

    test('Remove tag updates tag list', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={EditRecipe}/></Router>)
        expect(getByText('Lamb')).toBeInTheDocument()
        
        const removeTagButton = getByRole('button', {name: "Remove Lamb"})
        fireEvent.click(removeTagButton)
        setTimeout(() => {
          expect(screen.queryByText('Lamb')).not.toBeInTheDocument()
        })
    })
    
    test.skip('Add ingredient updates ingredient table', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        const ingredientSelect = getByRole('combobox', {name: "Ingredients"})
        fireEvent.click(ingredientSelect)
        const options = ingredientSelect.querySelectorAll('option')
        fireEvent.click(options[0])
        expect(getByText('Tuna')).toBeInTheDocument()
    })

    test.skip('Remove ingredient updates ingredient table', () => {  
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        const ingredientSelect = getByRole('combobox', {name: "Ingredients"})
        fireEvent.click(ingredientSelect)
        const options = ingredientSelect.querySelectorAll('option')
        fireEvent.click(options[0])
        expect(getByText('Tuna')).toBeInTheDocument()

        const removeIngredientButton = getByRole('button', {name: "Remove Tuna"})
        fireEvent.click(removeIngredientButton)
        expect(getByText('Tuna')).not.toBeInTheDocument()
    })

    test.skip('Submit button calls handleRecipeSubmit', () => {
        const {getByRole, getByText} = render(<Router><RecipeForm recipe={CreateRecipe}/></Router>)
        
        // fill out the form
        fireEvent.change(getByRole('textbox', {name: "Title"}), {target: {value: 'Tuna Salad'}});
        fireEvent.change(getByRole('textbox', {name: "Summary"}), {target: {value: 'Meal from MealDB'}});
        fireEvent.change(getByRole('textbox', {name: "Instructions"}), {target: {value: 'Add the tuna to a bowl and mix with the other ingredients.'}});
        fireEvent.change(getByRole('spinbutton', {name: "Servings"}), {target: {value: 5}});
        fireEvent.change(getByRole('textbox', {name: "ImageURL"}), {target: {value: 'https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg'}});
        fireEvent.change(getByRole('textbox', {name: "VideoURL"}), {target: {value: 'https://www.youtube.com/watch?v=w1qgTQmLRe4'}});
        fireEvent.click(getByRole('combobox', {name: "Tags"}))
        const tagOptions = getByRole('combobox', {name: "Tags"}).querySelectorAll('option')
        fireEvent.change(getByRole('combobox', {name: "Tags"}), {target: {value: tagOptions[1]}})
        fireEvent.click(getByRole('combobox', {name: "Ingredients"}))
        const ingredientOptions = getByRole('combobox', {name: "Ingredients"}).querySelectorAll('option')
        fireEvent.click(ingredientOptions[0])

        // submit the form

        expect(getByRole('button', {name: "Submit"})).toBeInTheDocument()
        fireEvent.click(getByRole('button', {name: "Submit"}))       
    })
})
