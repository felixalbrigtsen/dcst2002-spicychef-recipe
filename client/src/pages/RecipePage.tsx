import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useParams } from 'react-router-dom'

import { Container, Image, Media, Tile, Heading, Notification, Button, Form, Box, Hero, Columns } from 'react-bulma-components'
import { FaPlus, FaMinus } from 'react-icons/fa';

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

    let [ actualServings, setActualServings ] = React.useState<number>(recipe.servings);
    React.useEffect(() => {
        setActualServings(recipe.servings);
    }, [recipe.servings]);

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
                <Columns>
                <Columns.Column className='is-narrow'>
                <Button color="danger" onClick={
                  () => {setActualServings(actualServings - 1)}
                }>
                  <span className="icon">
                    <FaMinus />
                  </span>
                </Button>
                </Columns.Column>
                <Columns.Column>
                    <Form.Control>
                      <Form.Input type="number" value={actualServings} min={1}
                      onChange={(event) => {setActualServings(parseInt(event.target.value))}} />
                    </Form.Control>
                </Columns.Column>
                <Columns.Column className='is-narrow'>
                  <Button color="success" onClick={
                    () => {setActualServings(actualServings + 1)}
                  }>
                    <span className="icon">
                      <FaPlus />
                    </span>
                  </Button>
                </Columns.Column>
                </Columns>
                </Form.Field>
              </Tile>
              </Tile>
              <Tile kind="parent" vertical>
                <Tile kind="child" renderAs={Notification}>
                <Heading subtitle size={4}>Ingredients</Heading>
                  { recipe.ingredients?.map((ingredient) => {
                      return (
                        <Heading key={ingredient.id} subtitle size={6}> <b>{ingredient.ingredientName}</b> : {ingredient.quantity * (actualServings/recipe.servings)} {ingredient.unitName} </Heading>
                      )
                    })
                  }
                  <Button renderAs={Notification} onClick={
                    () => { recipe.ingredients?.forEach((ingredient) => {
                      // recipeService.addIngredientToShoppingList(ingredient.id)
                      console.log(ingredient.id)
                    });}
                  }>Add All Ingredients to Cart</Button>
                </Tile>
              </Tile>
            </Tile>
            <Tile vertical kind="parent">
              <Tile kind="child" renderAs={Notification}>
                <Heading subtitle size={4}>Instructions</Heading>
                <div style={{whiteSpace: "pre-wrap"}}>{recipe.instructions}</div>
              </Tile>
              <Tile kind="child" renderAs={Notification} className="has-text-centered">
                <Heading subtitle size={4}>Youtube Video</Heading>
                { recipe.videoUrl ? 
                  <iframe width="90%" height="70%" src={recipe.videoUrl.replace("watch?v=", "embed/")} allowFullScreen></iframe> :
                  <Heading subtitle size={6}>No video available</Heading>
                }
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