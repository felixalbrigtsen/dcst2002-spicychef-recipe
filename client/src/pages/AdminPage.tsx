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

import { Table, Container, Heading, Tile, Box, Notification, Button } from 'react-bulma-components';
import { MdDeleteForever, MdEdit, MdRemoveRedEye, MdAddCircle } from 'react-icons/md';

function AdminView() {

    let [ recipeList, setRecipeList ] = React.useState<Recipe[]>([]);

    React.useEffect(() => {
        recipeService.getRecipesShort()
        .then(data => {setRecipeList(data)});
    }, []);

    const { user } = useLogin();

    return(
    <>
        <Container className='mt-2'>
        <Tile kind="ancestor">
          <Tile kind="parent" className="is-vertical">
            <Tile kind="child" renderAs={Notification} className="has-text-centered is-12">
              <Heading> Recipe Overview  </Heading> 
            </Tile>

            <Container style={{width: '80%'}} className='has-text-centered'>
            <Button color="success" style={{width: '80%'}}>
                <span>Create New</span>
                <span className="icon">
                    <MdAddCircle />
                </span>
            </Button>
            </Container>

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
                        <Link to={`/recipe/${item.id}/edit`}>
                        <Button color="success" className="is-rounded is-outlined">
                          <MdEdit />
                        </Button>
                        </Link>
                      </td>
                      <td className='is-narrow has-text-centered'>
                        <Button color="danger" className="is-rounded is-outlined" onClick={() => {{/* TODO: Implement Delete & Confirm Delete */}}}>
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