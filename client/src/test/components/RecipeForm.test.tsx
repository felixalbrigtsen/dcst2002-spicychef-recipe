import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { type Recipe } from '../../models/Recipe';
import { render, screen, waitFor, fireEvent, getByTestId, getByText, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import selectEvent from 'react-select-event'
import RecipeForm from '../../components/RecipeForm'

import recipeService from '../../services/recipe-service';
import ingredientService from '../../services/ingredient-service';

const testRecipes: Recipe[] = [
    {"id": -1, "title": "", "summary": "", "instructions": "", "servings": 2, "imageUrl": "", "videoUrl": "", "created_at": "", "ingredients": [], "tags": [""], "likes": 0} as Recipe,
    {"id": 1, "title": "Tunisian Lamb Soup", "summary": "Meal from MealDB", "instructions": "Add the lamb to a casserole and cook over high heat.", "servings": 2, "imageUrl": "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg", "videoUrl": "https://www.youtube.com/watch?v=w1qgTQmLRe4", "created_at": "2022-11-02T19:23:43.000Z", "ingredients": [{"ingredientId": 1, "unitId": 1, "quantity": 500, "ingredientName": "Lamb Mince", "unitName": "g"}, {"ingredientId": 2, "unitId": 2, "quantity": 2, "ingredientName": "Garlic", "unitName": "cloves minced"}], "tags": ["Lamb", "Soup", "Tunisian"], "likes": 0} as Recipe,
];

const testRecipesShort = testRecipes.map(({id, title, summary, instructions, servings, imageUrl, videoUrl, created_at, ingredients, tags, likes}) => ({id, title, summary, imageUrl, created_at, tags, likes}))
const testIngredients = [... new Set(testRecipes.map(({ingredients}) => ingredients).flat())]

jest.mock('../../services/recipe-service');
jest.mock('../../services/ingredient-service');

recipeService.getRecipesShort = jest.fn().mockResolvedValue(testRecipesShort);
ingredientService.getIngredients = jest.fn().mockResolvedValue(testIngredients);

recipeService.createRecipe = jest.fn().mockResolvedValue(true);
recipeService.updateRecipe = jest.fn().mockResolvedValue(true);

const locationAssignMock = jest.fn();
Object.defineProperty(window, 'location', {
  value: { assign: locationAssignMock }
});

// TODO: Skipping is cheating
describe('test RecipeForm with complete recipe renders correctly', () => {
    test('Correct rendering of input field values', async () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[1]} /></Router>); });

        await waitFor(() => {
            expect(screen.getByRole('textbox', {name: "Title"})).toHaveValue('Tunisian Lamb Soup')
            expect(screen.getByRole('textbox', {name: "Summary"})).toHaveValue('Meal from MealDB')
            expect(screen.getByRole('textbox', {name: "Instructions"})).toHaveValue('Add the lamb to a casserole and cook over high heat.')
            expect(screen.getByRole('spinbutton', {name: "Servings"})).toHaveValue(2)
            expect(screen.getByRole('textbox', {name: "ImageURL"})).toHaveValue('https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg')
            expect(screen.getByRole('textbox', {name: "VideoURL"})).toHaveValue('https://www.youtube.com/watch?v=w1qgTQmLRe4')
        });
    })

    test('All labels render', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[1]} /></Router>); });

        expect(screen.getByText('Recipe Title')).toBeInTheDocument()
        expect(screen.getByText('Recipe Summary')).toBeInTheDocument()
        expect(screen.getByText('Recipe Instructions')).toBeInTheDocument()
        expect(screen.getByText('Recipe Servings')).toBeInTheDocument()
        expect(screen.getByText('Recipe Image Link')).toBeInTheDocument()
        expect(screen.getByText('Recipe Video Link')).toBeInTheDocument()
        expect(screen.getByText('Recipe Ingredients')).toBeInTheDocument()
        expect(screen.getByText('Recipe Tags')).toBeInTheDocument()
    })

    test.skip('Correct rendering of tags', async () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[1]} /></Router>); });
        
        await waitFor(() => {
            const tagSelect = screen.getByRole('combobox', {name: "Tags"})
            expect(tagSelect).toBeInTheDocument()
            expect(tagSelect).toHaveValue(testRecipes[1].tags);
        });
    })

    test('Correct options of tags are displayed', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[1]} /></Router>); });

        const tagSelect = screen.getByRole('combobox', {name: "Tags"})

        expect(tagSelect).toBeInTheDocument()
        act(() => {
            selectEvent.openMenu(tagSelect)
        });
        expect(screen.getByText('Lamb')).toBeInTheDocument()
        expect(screen.getByText('Soup')).toBeInTheDocument()
    })

    test('Correct rendering of ingredient table', () => {
        // renderRecipeForm(1);
        act(() => { render(<Router><RecipeForm recipe={testRecipes[1]} /></Router>); });

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByRole('columnheader',{name: "Ingredient"})).toBeInTheDocument();
        expect(screen.getByRole('columnheader',{name: "Quantity"})).toBeInTheDocument();
        expect(screen.getByRole('columnheader',{name: "Unit"})).toBeInTheDocument();
        expect(screen.getByRole('columnheader',{name: "Delete"})).toBeInTheDocument();

        testRecipes[1].ingredients.forEach(ingredient => {
          expect(screen.getByRole('cell', {name: ingredient.ingredientName})).toBeInTheDocument();
          expect(screen.getByRole('cell', {name: ingredient.ingredientName})).toBeInTheDocument();
          expect(screen.getByRole('cell', {name: ingredient.ingredientName})).toBeInTheDocument();
          expect(screen.getByRole('button', {name: `Remove ${ingredient.ingredientName}`})).toBeInTheDocument();
        })
    })
})

describe('test RecipeForm functionality', () => {
    test('Title input updates', async () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });

        const titleInput = screen.getByRole('textbox', {name: "Title"})
        expect(titleInput).toHaveValue('')

        act(() => {
            fireEvent.change(titleInput, {target: {value: 'Tuna Salad'}});
        });

        await waitFor(() => {
            expect(titleInput).toHaveValue('Tuna Salad')
        });
    })

    test('Summary input updates', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });
    
        const summaryInput = screen.getByRole('textbox', {name: "Summary"})
        expect(summaryInput).toHaveValue('')

        act(() => {
            fireEvent.change(summaryInput, {target: {value: 'Meal from MealDB'}});
        });
        expect(summaryInput).toHaveValue('Meal from MealDB')
    })

    test('Instructions input updates', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });
        
        const instructionsInput = screen.getByRole('textbox', {name: "Instructions"})
        expect(instructionsInput).toHaveValue('')
        act(() => {
            fireEvent.change(instructionsInput, {target: {value: 'Add the tuna to a bowl and mix with the other ingredients.'}});
        });
        expect(instructionsInput).toHaveValue('Add the tuna to a bowl and mix with the other ingredients.')
    })

    test('Servings input updates', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });
        
        const servingsInput = screen.getByRole('spinbutton', {name: "Servings"})
        expect(servingsInput).toHaveValue(2)

        act(() => {
            fireEvent.change(servingsInput, {target: {value: 5}});
        });
        expect(servingsInput).toHaveValue(5)
    })

    test('Image URL input updates', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });
        
        const imageURLInput = screen.getByRole('textbox', {name: "ImageURL"})
        expect(imageURLInput).toHaveValue('')
        act(() => {
            fireEvent.change(imageURLInput, {target: {value: 'https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg'}});
        });
        expect(imageURLInput).toHaveValue('https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg')
    })

    test('Video URL input updates', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });
        
        const videoURLInput = screen.getByRole('textbox', {name: "VideoURL"})
        expect(videoURLInput).toHaveValue('')

        act(() => {
            fireEvent.change(videoURLInput, {target: {value: 'https://www.youtube.com/watch?v=w1qgTQmLRe4'}});
        });
        expect(videoURLInput).toHaveValue('https://www.youtube.com/watch?v=w1qgTQmLRe4')
    })

    test('New tag updates tag list', async () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });
        
        const tagSelect = screen.getByRole('combobox', {name: "Tags"})
        expect(tagSelect).toBeInTheDocument()

        act(() => {
            selectEvent.openMenu(tagSelect)
        });
        
        act(() => {
            selectEvent.create(tagSelect, 'Testtag')
        });

        await waitFor(() => {
            expect(tagSelect).toHaveDisplayValue('Testtag');
        });
    })

    test('Remove tag updates tag list', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[1]} /></Router>); });

        expect(screen.getByText(testRecipes[1].tags[0])).toBeInTheDocument()
        
        const removeTagButton = screen.getByRole('button', {name: `Remove ${testRecipes[1].tags[0]}`})
        act(() => {
            fireEvent.click(removeTagButton)
        });
        setTimeout(() => {
          expect(screen.queryByText(testRecipes[1].tags[0])).not.toBeInTheDocument()
        })
    })
    
    test('Add ingredient updates ingredient table', (done) => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });

        const ingredientInput = screen.getByRole('combobox', {name: "Ingredients"});
        expect(ingredientInput).toBeInTheDocument();

        act(() => {
            selectEvent.openMenu(ingredientInput)
            selectEvent.create(ingredientInput, 'TestIngredient')
        });

        setTimeout(() => {
            expect(screen.getByRole('cell', {name: 'TestIngredient'})).toBeInTheDocument();
            done();
        });
    

    })

    test.skip('Remove ingredient updates ingredient table', () => {  
        act(() => { render(<Router><RecipeForm recipe={testRecipes[1]} /></Router>); });
        
        const ingredientSelect = screen.getByRole('combobox', {name: "Ingredients"})
        act(() => {
            fireEvent.click(ingredientSelect)

        });

        expect(screen.getByText(testRecipes[1].ingredients[1].ingredientName)).toBeInTheDocument()

        const removeIngredientButton = screen.getByRole('button', {name: `Remove ${testRecipes[1].ingredients[1].ingredientName}`})
        act(() => {
            fireEvent.click(removeIngredientButton)
        });
        expect(screen.queryByText(testRecipes[1].ingredients[1].ingredientName)).not.toBeInTheDocument()
    })

    test.skip('Form validation stops submission', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });

    });

    test('Edit recipe by submitting the form', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[1]} /></Router>); });
        
        act(() => {
            fireEvent.change(screen.getByRole('textbox', {name: "Title"}), {target: {value: 'Tuna Salad Edited'}});
        });

        expect(screen.getByRole('button', {name: "Submit"})).toBeInTheDocument()

        act(() => {
            fireEvent.click(screen.getByRole('button', {name: "Submit"}))       
        });

        const editRecipe = JSON.parse(JSON.stringify(testRecipes[1]))
        editRecipe.title = 'Tuna Salad Edited'

        // These properties are controlled by the backend alone, and should not be included in the form data:
        delete(editRecipe.likes);
        delete(editRecipe.created_at);
        for (const ingredient of editRecipe.ingredients) { 
            delete(ingredient.ingredientId); 
            delete(ingredient.unitId);
        }

        expect(recipeService.updateRecipe).toHaveBeenCalled();
        expect(recipeService.updateRecipe).toHaveBeenCalledWith(editRecipe);
    })

    test.skip('Create recipe by submitting the form', () => {
        act(() => { render(<Router><RecipeForm recipe={testRecipes[0]} /></Router>); });

        act(() => {
            fireEvent.change(screen.getByRole('textbox', {name: "Title"}), {target: {value: testRecipes[1].title}});
            fireEvent.change(screen.getByRole('textbox', {name: "Summary"}), {target: {value: testRecipes[1].summary}});
            fireEvent.change(screen.getByRole('textbox', {name: "Instructions"}), {target: {value: testRecipes[1].instructions}});
            fireEvent.change(screen.getByRole('spinbutton', {name: "Servings"}), {target: {value: testRecipes[1].servings}});
            fireEvent.change(screen.getByRole('textbox', {name: "ImageURL"}), {target: {value: testRecipes[1].imageUrl}}); 
            fireEvent.change(screen.getByRole('textbox', {name: "VideoURL"}), {target: {value: testRecipes[1].videoUrl}});

            // // Select the first tag
            // fireEvent.click(screen.getByRole('combobox', {name: "Tags"}))
            // const tagOptions = screen.getByRole('combobox', {name: "Tags"}).querySelectorAll('option')
            // fireEvent.change(screen.getByRole('combobox', {name: "Tags"}), {target: {value: tagOptions[1]}})

            // // Select the first ingredient
            // fireEvent.click(screen.getByRole('combobox', {name: "Ingredients"}))
            // const ingredientOptions = screen.getByRole('combobox', {name: "Ingredients"}).querySelectorAll('option')
            // fireEvent.click(ingredientOptions[0])
        });

        // submit the form
        expect(screen.getByRole('button', {name: "Submit"})).toBeInTheDocument()

        act(() => {
            fireEvent.click(screen.getByRole('button', {name: "Submit"}))       
        });

        expect(recipeService.createRecipe).toHaveBeenCalled();
        expect(recipeService.createRecipe).toHaveBeenCalledWith(testRecipes[1]);
        expect(locationAssignMock).toHaveBeenLastCalledWith('/admin');
    });


})
