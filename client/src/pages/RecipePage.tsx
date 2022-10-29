import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useParams } from 'react-router-dom'

import { Card, Container, Image, Media } from 'react-bulma-components'

import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';


function RecipePage() {

    let [ recipe, setRecipe ] = React.useState<Recipe>();

    let id = Number(useParams().id);
    React.useEffect(() => {
        recipeService.getRecipe(id)
        .then(data => {setRecipe(data)});
    }, []);
    

    return (
        <>
        <Container>
          <Card className='has-text-centered'>
            <Card.Header>
            </Card.Header>
            <Card.Content>
            </Card.Content>
          </Card>
        </Container>
        </>
    );
}

export default RecipePage;