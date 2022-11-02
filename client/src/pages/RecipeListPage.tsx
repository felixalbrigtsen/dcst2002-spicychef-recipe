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

import { Columns, Box, Button } from 'react-bulma-components';
import ScrollButton from '../components/ScrollUp';

export default function RecipeList() {
    let [ recipeList, setRecipeList ] = React.useState<Recipe[]>([]);

    React.useEffect(() => {
        recipeService.getRecipesShort()
        .then(data => {setRecipeList(data)});
    }, []);
    return (
        <>
          <Columns className="is-multiline is-centered" style={{marginTop: '2rem', marginLeft: 'auto', marginRight: 'auto'}}>
          {recipeList.map((recipe) => (
            <Columns.Column className='is-one-quarter' key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Columns.Column>
          ))}
          </Columns>
          <ScrollButton />
        </>
    );
}