import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';

import { Form, Button, Container, Tile, Hero } from 'react-bulma-components';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Recipe } from '../models/Recipe';
import recipeService from '../services/recipe-service';
import RecipeForm from '../components/RecipeForm';

function EditRecipe () {

  let [ recipe, setRecipe ] = React.useState<Recipe>({id: 0, title: "", summary: "", instructions: "", servings: 0, imageUrl: "", videoUrl: "", created_at: "", ingredients: [], tags: []});

    let id = Number(useParams().id);
    React.useEffect(() => {
        recipeService.getRecipe(id)
        .then(data => {setRecipe(data)});
    }, []);

    return (
      <Container>
      <Hero>
        <Hero.Body>
          <RecipeForm recipe={recipe} />
        </Hero.Body>
      </Hero>
      </Container>
    );
}

export default EditRecipe;