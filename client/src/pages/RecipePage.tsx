import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useParams } from 'react-router-dom'

import { Container, Image, Media, Tile, Heading, Notification, Button, Form, Box, Hero } from 'react-bulma-components'

import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';
import { Ingredient } from '../models/Ingredient';


function RecipePage() {

    let [ recipe, setRecipe ] = React.useState<Recipe>({id: 0, title: "", summary: "", instructions: "", servings: 0, imageUrl: "", videoUrl: "", created_at: "", ingredients: [], tags: []});

    let id = Number(useParams().id);
    React.useEffect(() => {
        recipeService.getRecipe(id)
        .then(data => {setRecipe(data)});
    }, []);


    return (
        <>
        <Container>
        <Hero>
        <Hero.Body>
        <Tile kind="ancestor">
          <Tile size={4} vertical>
              <Tile kind="parent">
                <Tile kind="child" renderAs={Notification}>
                  <Media.Item renderAs="figure">
                    {recipe.imageUrl ? <Image size={4} src={recipe.imageUrl} /> : <Image size={4} src="https://bulma.io/images/placeholders/128x128.png" />}
                  </Media.Item>
                  <Media.Item>
                    <Heading size={4}>{recipe.title}</Heading>
                    <Heading subtitle size={6}>{recipe.summary}</Heading>
                  </Media.Item>
                </Tile>
              </Tile>
              <Tile kind="parent">
              <Tile kind="child" renderAs={Notification}>
                {/* TODO: Link these to tag searches */}
                {recipe.tags?.map((tag) => (
                  <Button key={tag}>{tag}</Button>
                ))}
                  <Form.Field>
                    <Form.Label>Servings:</Form.Label>
                    <Form.Control>
                      {/* TODO: Add functionality to servings */}
                      <Form.Input type="number" placeholder="Servings" defaultValue={2} min={1}
                      onChange={(event) => console.log(event?.currentTarget.value)} />
                    </Form.Control>
                  </Form.Field>
              </Tile>
              </Tile>
              <Tile kind="parent" vertical>
                <Tile kind="child" renderAs={Notification}>
                  {/* TODO: Scale ingredient.amount with servings */}
                <Heading subtitle size={4}>Ingredients</Heading>
                  { recipe.ingredients?.map((ingredient) => {
                      return (
                        <Heading key={ingredient.id} subtitle size={6}> <b>{ingredient.ingredientName}</b> : {ingredient.quantity} {ingredient.unitName} </Heading>
                      )
                    })
                  }
                </Tile>
              </Tile>
            </Tile>
            <Tile vertical kind="parent">
              <Tile kind="child" renderAs={Notification}>
                <Heading subtitle size={4}>Instructions</Heading>
                <div style={{whiteSpace: "pre-wrap"}}>{recipe.instructions}</div>
              </Tile>
              <Tile kind="child" renderAs={Notification}>
                <Heading subtitle size={4}>Youtube Video</Heading>
              </Tile>
            </Tile>
          </Tile>
          </Hero.Body>
          </Hero>
          </Container>
        </>
    );
}

export default RecipePage;