import * as React from 'react';
import listService from '../services/list-service';
import recipeService from '../services/recipe-service';
import ingredientService from '../services/ingredient-service';
import { Ingredient } from '../models/Ingredient';

import { MdDeleteForever } from 'react-icons/md';
import { Box, Button, Form, Container, Heading, Hero, Notification, Table, Tile } from 'react-bulma-components';
import { useEffect, useState } from 'react';


export default function ShoppingListPage() {

  function handleRemove(ingredientId: number) {
    listService.removeIngredient(ingredientId);
  };

  let [ listItems, setListItems ] = React.useState<{id: number, name: string}[]>([]);

  function updateListItems() {
    listService.getShoppingListItems()
      .then((items) => {
        setListItems(items);
      });
  }
  useEffect(() => {
    updateListItems();
  }, []);


  return (
    <>
      <Container className='mt-2'>
        <Tile kind="ancestor">
          <Tile kind="parent" className="is-vertical">
            <Tile kind="child" renderAs={Notification} color="warning" className="has-text-centered is-12">
              <Heading> Shopping List </Heading> 
            </Tile>
            <Box className='has-text-right'>
              <Button
                color="danger"
                aria-label='clearList'
                className="is-rounded"
                onClick={() => {
                  listItems?.map(
                    (item, index) => {
                    handleRemove(item.id); setListItems(listItems.filter((item, j) => j !== index))
                  })
                }}
              >
                Clear all
              </Button>
            </Box>
            <Box>
              <Table className='is-fullwidth is-hoverable is-striped'>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className='is-narrow'>
                        <Button 
                          color="danger" 
                          className="is-rounded is-outlined"
                          onClick={() => {console.log(`Remove ${item.name} from shopping list`); handleRemove(item.id)}}
                          aria-label={`Remove ${item.name} from shopping list`}
                          aria-required="true"
                        >
                          <MdDeleteForever />
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
