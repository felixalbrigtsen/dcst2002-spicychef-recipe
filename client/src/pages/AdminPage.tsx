import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';

import recipeService from '../services/recipe-service';
import { useEffect } from 'react';
import { useLogin } from '../hooks/Login';
import { Recipe } from '../models/Recipe';
import ScrollButton from '../components/ScrollUp';

import { Table, Container, Heading, Tile, Box, Notification, Button, Modal } from 'react-bulma-components';
import { MdDeleteForever, MdEdit, MdRemoveRedEye, MdAddCircle } from 'react-icons/md';
import { BiImport } from 'react-icons/bi';

function AdminView() {

    let [ recipeList, setRecipeList ] = React.useState<Recipe[]>([]);

    React.useEffect(() => {
        recipeService.getRecipesShort()
        .then(data => {setRecipeList(data)});
    }, []);

    const { user } = useLogin();

    let [ confirmationState, setConfirmationState ] = React.useState<boolean>(false);
    let [ confirmItem, setConfirmItem ] = React.useState<number>(-1);

    function showConfirmation (id: number) {
        setConfirmItem(id);
        setConfirmationState(!confirmationState);
    }

    function handleDelete(id: number) {
        console.log("Deleting recipe with id: " + id);
        setConfirmationState(!confirmationState);
        setConfirmItem(-1);
    }

    return(
    <>
        <Container className='mt-2'>
        <Modal show={confirmationState} onClose={() => {setConfirmationState(!confirmationState)}}>
            <Modal.Card>
                <Modal.Card.Header>
                    <Modal.Card.Title>Do you really want to delete this recipe?</Modal.Card.Title>
                </Modal.Card.Header>
                <Modal.Card.Footer>
                    <Button color="danger" onClick={() => handleDelete(confirmItem)}>Yes, Delete</Button>
                    <Button onClick={() => setConfirmationState(!confirmationState)}>Cancel</Button>
                </Modal.Card.Footer>
            </Modal.Card>
        </Modal>
        <Tile kind="ancestor">
          <Tile kind="parent" className="is-vertical">
            <Tile kind="child" renderAs={Notification} className="has-text-centered is-12">
              <Heading> Recipe Overview  </Heading> 
            </Tile>
            <Tile kind="parent">
              <Tile kind="child" size={6} className='has-text-centered'>
            <Link to='/create'>
            <Button color="success" style={{width: '80%'}}>
                <span>Create New</span>
                <span className="icon">
                    <MdAddCircle />
                </span>
            </Button>
            </Link>
            </Tile>
            <Tile kind="child" size={6} className='has-text-centered'>
            <Link to='/import'>
            <Button color="link" style={{width: '80%'}}>
                <span>Import Recipe</span>
                <span className="icon">
                    <BiImport />
                </span>
            </Button>
            </Link>
            </Tile>
            </Tile>

            <br />
            {/* Add search */}
            <Box>
              <Table className='is-fullwidth is-hoverable is-striped'>
                <thead>
                  <tr>
                    <th>Recipe Title</th>
                    <th className='has-text-centered'>View</th>
                    <th className='has-text-centered'>Edit</th>
                    <th className='has-text-centered'>Delete</th>
                  </tr>
                </thead>
                <tbody>
                {recipeList.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link to={`/recipe/${item.id}`} style={{textDecoration: 'none', color: 'dark'}}>{item.title}</Link>
                      </td>
                      <td className='is-narrow has-text-centered'>
                        <Link to={`/recipe/${item.id}`}>
                        <Button color="dark" className="is-rounded is-outlined">
                          <MdRemoveRedEye />
                        </Button>
                        </Link>
                      </td>
                      <td className='is-narrow has-text-centered'>
                        <Link to={`/edit/${item.id}`}>
                        <Button color="success" className="is-rounded is-outlined">
                          <MdEdit />
                        </Button>
                        </Link>
                      </td>
                      <td className='is-narrow has-text-centered'>
                        <Button color="danger" className="is-rounded is-outlined" onClick={() => {showConfirmation(item.id)}}>
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
        <ScrollButton />
      </Container>
      
    </>
    )
}

export default AdminView;