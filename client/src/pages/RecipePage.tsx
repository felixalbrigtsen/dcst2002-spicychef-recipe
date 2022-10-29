import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useParams } from 'react-router-dom'

import { Container, Image, Media, Tile, Heading, Notification, Button, Form } from 'react-bulma-components'

import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';


function RecipePage() {

    let [ recipe, setRecipe ] = React.useState<Recipe>([]);

    let id = Number(useParams().id);
    React.useEffect(() => {
        recipeService.getRecipe(id)
        .then(data => {setRecipe(data)});
    }, []);


    return (
        <>
        <Container>
        {/* TODO: Shift everything down from the navbar */}
        <Tile kind="ancestor">
          <Tile vertical>
            {/* TODO: Make the recipe page look better */}
            <Tile kind="parent" renderAs={Notification}>
              <Tile kind="child" renderAs={Media} object>
                <Media.Item renderAs="figure">
                  <Image size={128} alt="64x64" src={recipe.imageUrl} />
                </Media.Item>
                <Media.Item>
                  <Heading size={4}>{recipe.title}</Heading>
                  <Heading subtitle size={6}>{recipe.summary}</Heading>
                </Media.Item>
                <Media.Item>
                </Media.Item>
                <Media.Item>
                  {/* TODO: Implement this in a better way possibly? */}
                  <a href={recipe.videoUrl} target="_blank">
                  <Heading subtitle size={6}>Watch the video</Heading>
                  <Image size={128} alt="64x64" src="https://i.imgur.com/raE8eQy.png" />
                  </a>
                </Media.Item>
              </Tile>
              <Tile kind="child" size={8}>
              {/* TODO: Format this better */}
                <Heading subtitle size={4}>Instructions</Heading>
                <Heading subtitle size={6}>{recipe.instructions}</Heading>
              </Tile>
            </Tile>
            <Tile kind="parent" renderAs={Notification}>
            {/* TODO: Scale ingredient.amount with servings */}
            {/* TODO: Import correct quantity */}
            <Tile kind="child">
              <Heading subtitle size={4}>Ingredients</Heading>
              { recipe.ingredients?.map((ingredient) => {
                  return (
                    <Heading key={ingredient.id} subtitle size={6}> <b>{ingredient.ingredientName}</b> : {ingredient.quantity} {ingredient.unitName} </Heading>
                  )
                })
              }
            </Tile>
            <Tile kind="child">
              {/* TODO: Link these to tag searches */}
                {recipe.tags?.map((tag) => (
                  <Button key={tag}>{tag}</Button>
                ))}
                  <Form.Field>
                    <Form.Label>Servings:</Form.Label>
                    <Form.Control>
                      {/* TODO: Add functionality to servings */}
                      <Form.Input type="number" placeholder="Servings" defaultValue={recipe.servings} min={1}
                      onChange={(event) => console.log(event?.currentTarget.value)} />
                    </Form.Control>
                  </Form.Field>
              </Tile>
            </Tile>
          </Tile>
        </Tile>
        </Container>
        </>
    );
}

export default RecipePage;