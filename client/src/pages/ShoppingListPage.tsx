import * as React from 'react';
import listService from '../services/list-service';
import { Ingredient } from '../models/Ingredient';

import { MdDeleteForever } from 'react-icons/md';
import { Box, Button, Form, Container, Heading, Hero, Notification, Table, Tile } from 'react-bulma-components';


export default function ShoppingListPage() {

  function handleRemove(ingredientId: number) {
    listService.removeIngredient(ingredientId);
  };

  let listItems: Array<any> = [
    {
      id: 1,
      name: 'Product 1',
      quantity: 1
    }, 
    {
      id: 2,
      name: 'Product 2',
      quantity: 2
    }
  ];

  return (
    <>
      <Container className='mt-2'>
        <Tile kind="ancestor">
          <Tile kind="parent" className="is-vertical">
            <Tile kind="child" renderAs={Notification} color="warning" className="has-text-centered is-12">
              <Heading> Shopping List </Heading> 
            </Tile>
            <Box>
              <Table className='is-fullwidth is-hoverable is-striped'>
                <thead>
                  <tr>
                    <th>Item</th>
                    {/* <th>Quantity</th> */}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      {/* <td className='is-narrow'>{item.quantity}</td> */}
                      <td className='is-narrow'>
                        <Button 
                          color="danger" 
                          className="is-rounded is-outlined"
                          onClick={() => {handleRemove(item.id)}}
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
