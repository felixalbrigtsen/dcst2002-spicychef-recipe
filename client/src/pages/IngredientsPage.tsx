import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import ingredientService from '../services/ingredient-service';
import listService from '../services/list-service';
import recipeService from '../services/recipe-service';
import { Ingredient } from '../models/Ingredient';

import { Box, Button, Form, Container, Heading, Hero, Notification, Table, Tile } from 'react-bulma-components';
import { MdAddCircle } from 'react-icons/md';

import { useAlert } from '../hooks/Alert';

export default function IngredientsPage() {
  const [ selectedIngredients, setSelectedIngredients ] = React.useState<Ingredient[]>([]);
  const [ ingredients, setIngredients ] = React.useState<Ingredient[]>([]);
  const { appendAlert } = useAlert();

  React.useEffect(() => {
    ingredientService.getIngredients()
    .then(ingredients => {
      setIngredients(ingredients);
      })
    .catch(err => console.error(err));
  }, []);

  function handleIngredientClick(ingredient: Ingredient) {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  }

  function addSelectedToList() {
    selectedIngredients.forEach(ingredient => {
      listService.addIngredient(ingredient.id)
      .then(() => appendAlert("Added " + ingredient.name + " to list", "success"));
    });
  }

  function searchRecipeByIngredients(mode: string) {
    const ingredientIds = selectedIngredients.map(ingredient => ingredient.id);
    recipeService.searchRecipeByIngredients(ingredientIds, mode);
  }

  return (
    <>
      <Container className=''>
        <Tile kind="ancestor">
          <Tile kind="parent" className="is-vertical m-2">
            <Tile kind="child" renderAs={Notification} color="primary" className="has-text-centered is-12">
              <Heading> Ingredients List </Heading> 
            </Tile>
            <Box className='has-text-right'>
              <Button
                color="warning"
                className="is-rounded m-1"
                onClick={() => {searchRecipeByIngredients("all")}}
              >
                Search Recipes Including All
              </Button>
              <Button
                color="warning"
                className="is-rounded m-1"
                onClick={() => {searchRecipeByIngredients("any")}}
              >
                Search Recipes Including Any
              </Button>
              <Button
                color="success"
                className="is-rounded m-1"
                onClick={addSelectedToList}
              >
                Add Selected To List
              </Button>
              <Button
                color="danger"
                className="is-rounded m-1"
                onClick={() => { setSelectedIngredients([]);  }}
              >
                Clear Selection
              </Button>
            </Box>
            <Box>
              <Table className='is-fullwidth is-hoverable is-striped'>
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th className='has-text-centered'>Include</th>
                    <th className='has-text-centered'>Add</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient, index) => (
                    <tr key={index}>
                      <td>{ingredient.name}</td>
                      <td className='is-narrow has-text-centered'>
                        <Form.Checkbox 
                          className='is-centered'
                          checked={selectedIngredients.includes(ingredient)}
                          onClick={() => {handleIngredientClick(ingredient);}}
                          aria-label={`Already own ${ingredient.name}`}
                          aria-required="true"
                        >
                          
                        </Form.Checkbox>
                      </td>
                      <td className='is-narrow has-text-centered'>
                        <Button 
                          color="success" 
                          className="is-rounded is-outlined"
                          onClick={() => {listService.addIngredient(ingredient.id)}}
                        >
                          <MdAddCircle />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </Tile>
        </Tile>
      </Container>
    </>
  );
};
