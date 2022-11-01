import * as React from 'react';
import { listService } from '../services/list-service';
import { MdDeleteForever } from 'react-icons/md';
import { Box, Button, Form, Container, Heading, Hero, Notification, Table, Tile } from 'react-bulma-components';

interface ShoppingListPageProps {
    id: number;
    name: string;
    quantity: number;
}

export default function ShoppingListPage() {
  
  function handleChange(props: ShoppingListPageProps) {
    listService.updateIngredient(props.id, props.name, props.quantity);
  };

  function handleRemove(props: ShoppingListPageProps) {
    listService.removeIngredient(props);
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
                    <th>Quantity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className='is-narrow'>
                      <Form.Input type='number' value={item.quantity} onChange={(event) => {console.log(event); handleChange}} min="1" />
                      </td>
                      <td className='is-narrow'>
                        <Button color="danger" className="is-rounded is-outlined" onClick={() => {console.log(); handleRemove}}>
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
