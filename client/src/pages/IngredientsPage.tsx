import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import ingredientService from '../services/ingredient-service';
import listService from '../services/list-service';
import { Ingredient } from '../models/Ingredient';

import { Box, Button, Form, Container, Heading, Hero, Notification, Table, Tile } from 'react-bulma-components';
import { MdAddCircle } from 'react-icons/md';

export default function IngredientsPage() {
  const [ selectedIngredients, setSelectedIngredients ] = React.useState<Ingredient[]>([]);
  const [ ingredients, setIngredients ] = React.useState<Ingredient[]>([]);

  React.useEffect(() => {
    ingredientService.getIngredients()
    .then(ingredients => {
      setIngredients(ingredients);
      })
    .catch(err => console.error(err));
}, []);

  let ingredientList: Array<any> = [
    {
      id: 1,
      name: 'Ingredient 1',
      quantity: 1
    }, 
    {
      id: 2,
      name: 'Ingredient 2',
      quantity: 2
    }
  ];

  return (
    <>
      <Container className='mt-2'>
        <Tile kind="ancestor">
          <Tile kind="parent" className="is-vertical">
            <Tile kind="child" renderAs={Notification} color="primary" className="has-text-centered is-12">
              <Heading> Ingredients List </Heading> 
            </Tile>
            <Box className='has-text-right'>
              <Button
                color="warning"
                className="is-rounded"
                onClick={() => {console.log('Search Ingredient'); }}
              >
                Search recipes with selected ingredients
              </Button>
              <Button
                color="success"
                className="is-rounded ml-2"
                onClick={() => {console.log('Add Ingredient'); }}
              >
                Add Selected To Cart
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
                  {ingredientList.map((ingredient, index) => (
                    <tr key={index}>
                      <td>{ingredient.name}</td>
                      <td className='is-narrow has-text-centered'>
                        <Form.Checkbox 
                          className='is-centered'
                          onClick={() => {setSelectedIngredients(ingredient)}}
                          aria-label={`Already own ${ingredient.name}`}
                          aria-required="true"
                        >
                          
                        </Form.Checkbox>
                      </td>
                      <td className='is-narrow has-text-centered'>
                        <Button 
                          color="success" 
                          className="is-rounded is-outlined"
                          onClick={() => {listService.addIngredient(ingredient)}}
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
