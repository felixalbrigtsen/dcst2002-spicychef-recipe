import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useState } from 'react';

import RecipeCard from '../components/RecipeCard';
import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';

import { Columns, Container, Button } from 'react-bulma-components';
import ScrollButton from '../components/ScrollUp';

export default function RecipeList() {
    let [ recipeList, setRecipeList ] = React.useState<Recipe[]>([]);

    React.useEffect(() => {
        recipeService.getRecipesShort()
        .then(data => {setRecipeList(data)});
    }, []);
    return (
        <>
          <Container className='mt-2 is-centered' style={{margin:'auto'}}>
          <Columns className="is-multiline" style={{margin: '2rem auto'}}>
          {recipeList.map((recipe) => (
            <Columns.Column className='is-narrow' key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Columns.Column>
          ))}
          </Columns>
          <ScrollButton />
          </Container>
        </>
    );
}