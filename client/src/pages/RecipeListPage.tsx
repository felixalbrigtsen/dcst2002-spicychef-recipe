import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import RecipeCard from '../components/RecipeCard';
import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';

import { Columns } from 'react-bulma-components';

export default function RecipeList() {
    let [ recipeList, setRecipeList ] = React.useState<Recipe[]>([]);

    React.useEffect(() => {
        recipeService.getRecipesShort()
        .then(data => {setRecipeList(data)});
    }, []);
    return (
        <>
          <Columns className="is-multiline">
          {recipeList.map((recipe) => (
            <Columns.Column>
              <RecipeCard recipe={recipe} />
            </Columns.Column>
          ))}
          </Columns>
        </>
    );
}