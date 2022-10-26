import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useParams } from 'react-router-dom'

import { Card, Container, Image, Media } from 'react-bulma-components'

function RecipePage() {

    const { id } = useParams();
  
    return (
        <>
        <Container className='has-text-centered'>
          <Card>
            <Card.Header>Recipe: {id}</Card.Header>
            <Card.Content>
                  {/* @ts-ignore */}
                  {/* <iframe src="https://www.youtube.com/embed/70vwJy1dQ0c" allowfullscreen></iframe>                 */}
            </Card.Content>
          </Card>
        </Container>
        </>
    );
}

export default RecipePage;