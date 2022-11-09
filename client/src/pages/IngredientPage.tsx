import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useState } from 'react';
import { useLogin } from '../hooks/Login';
import { useAlert } from '../hooks/Alert';

import { Ingredient } from '../models/Ingredient';
import recipeService from '../services/recipe-service';

export default function IngredientPage() {
    return (
        <div>
        <h1>Ingredient</h1>
        </div>
    );
}