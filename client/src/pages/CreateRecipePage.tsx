import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';

import { Form, Button, Container, Tile, Hero } from 'react-bulma-components';

import RecipeForm from '../components/RecipeForm';
import { Recipe } from '../models/Recipe';

import { useState, useEffect } from 'react';

function CreateRecipe() {
  const blankRecipe = {id: 0, title: "", summary: "", instructions: "", servings: 0, imageUrl: "", videoUrl: "", created_at: "", ingredients: [], tags: [], likes: 0};
  return (
    <Container>
      <Hero>
        <Hero.Body>
          <RecipeForm recipe={blankRecipe}/>
          </Hero.Body>
          </Hero>
    </Container>
  );
}

export default CreateRecipe;