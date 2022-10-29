import * as React from 'react';

import { MdDeleteForever } from 'react-icons/md';
import { Box, Button, Form, Container, Heading, Hero, Notification, Table, Tile } from 'react-bulma-components';


export default function ShoppingCartPage() {
  // const [cart, setCart] = React.useState([]);
  

  const totalProductPrice = (product: any) => {
    return product.price * product.quantity;
  }

  const totalCartPrice = () => {
    return cartItems.reduce((acc, product) => {
      return acc + totalProductPrice(product);
    }, 0);
  }

  let cartItems: Array<any> = [
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      quantity: 1
    }
  ];

  return (
    <>
      <Container className='mt-2'>
        <Tile kind="ancestor">
          <Tile kind="parent" className="is-vertical">
            <Tile kind="child" renderAs={Notification} color="warning" className="has-text-centered is-12">
              <Heading> Shopping Cart </Heading> 
            </Tile>
            <Box>
              <Table className='is-fullwidth is-hoverable is-striped'>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className='is-narrow'>
                      <Form.Input type='number' value={item.quantity} onChange={(event) => {console.log(event.target.value); item.quantity = event.target.value}} min="1" />
                      </td>
                      <td style={{textAlign: 'right'}} className='is-narrow'>
                        {item.price}
                      </td>
                      <td className='is-narrow'>
                        <Button color="danger" className="is-rounded is-outlined" onClick={() => {{/* TODO: Implement delete button */}}}>
                          <MdDeleteForever />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th></th>
                    <th style={{textAlign: 'right'}}>{totalCartPrice()}</th>
                    <th></th>
                  </tr>
                </tfoot>
              </Table>
            </Box>
          </Tile>
        </Tile>
      </Container>
    </>
  );
};
