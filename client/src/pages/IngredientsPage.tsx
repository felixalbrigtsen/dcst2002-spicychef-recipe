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
import { useLogin } from '../hooks/Login';

export default function IngredientsPage() {
  const [ selectedIngredients, setSelectedIngredients ] = React.useState<Ingredient[]>([]);
  const [ ingredients, setIngredients ] = React.useState<Ingredient[]>([]);
  const { appendAlert } = useAlert();
  const { user } = useLogin();

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
    // window.location.href=`/search/?ingredients=${encodeURIComponent(ingredientIds.join(','))}`;
    window.location.assign(`/search/?ingredients=${encodeURIComponent(ingredientIds.join(','))}`);
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
                aria-label='searchAllIngredients'
                className="is-rounded m-1"
                onClick={() => {searchRecipeByIngredients("all")}}
              >
                Find Recipes With These Ingredients
              </Button>
              { user.googleId && 
              <Button
                color="success"
                aria-label='addSelectedToList'
                className="is-rounded m-1"
                onClick={addSelectedToList}
              >
                Add Selected To List
              </Button>
              }
              <Button
                color="danger"
                aria-label='clearSelected'
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
                          onChange={() => {handleIngredientClick(ingredient);}}
                          aria-label={`Select ${ingredient.name}`}
                          aria-required="true"
                        >
                          
                        </Form.Checkbox>
                      </td>
                      <td className='is-narrow has-text-centered'>
                        <Button 
                          color="success" 
                          className="is-rounded is-outlined"
                          aria-label={`Add ${ingredient.name} to list`}
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
