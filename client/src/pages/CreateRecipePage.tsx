import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';

import { Form, Button, Container, Tile, Hero } from 'react-bulma-components';

import { useState, useEffect } from 'react';

function CreateRecipe() {
  return (
    <Container>
      <Hero>
        <Hero.Body>
        <Tile kind="ancestor">
          <Tile size={4} vertical>
              <Tile kind="parent">
                <Tile kind="child" renderAs={Form.Field}>
                  <Form.Label>Recipe Title</Form.Label>
                  <Form.Control>
                    <Form.Input placeholder="Recipe Title" />
                  </Form.Control>
                </Tile>
              </Tile>
              <Tile kind="parent">
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Summary</Form.Label>
                <Form.Control>
                  <Form.Input placeholder="Recipe Summary" />
                </Form.Control>
              </Tile>
              </Tile>
              <Tile kind="parent">
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Tags</Form.Label>
                <Form.Control>
                  {/* TODO: List tags at the end of input, or below where they can be removed */}
                  <Form.Input placeholder="Recipe Summary" />
                </Form.Control>
              </Tile>
              </Tile>
              <Tile kind="parent">
                <Tile kind="child" renderAs={Form.Field}>
                  <Form.Label>Recipe Image Link</Form.Label>
                  <Form.Control>
                    {/* TODO: Add upload button */}
                    <Form.Input placeholder="Recipe Image" />
                  </Form.Control>
                </Tile>
              </Tile>
              <Tile kind="parent" vertical>
                <Tile kind="child" renderAs={Form.Field}>
                  <Form.Label>Recipe Video Link</Form.Label>
                  <Form.Control>
                    <Form.Input placeholder="Recipe Video" />
                  </Form.Control>
                </Tile>
              </Tile>
            </Tile>
            <Tile vertical kind="parent">
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Instructions</Form.Label>
                <Form.Control>
                  <Form.Textarea placeholder="Recipe Instructions" />
                </Form.Control>
              </Tile>
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Ingredients</Form.Label>
                <Form.Control>
                  {/* TODO: List Ingredients below when you press enter so you can add measurements */}
                  <Form.Input placeholder="Recipe Ingredients" />
                </Form.Control>
              </Tile>
              <Tile kind="child" renderAs={Form.Field} className="has-text-centered">
                <Button color="primary">Submit</Button>
              </Tile>
            </Tile>
          </Tile>
          </Hero.Body>
          </Hero>
    </Container>
  );
}

export default CreateRecipe;