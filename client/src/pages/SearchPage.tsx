import * as React from 'react';
import { Heading, Hero, Tile, Tabs, Box, Form, Button, Columns } from 'react-bulma-components';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes,
  Link, 
  useParams
} from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import recipeService from '../services/recipe-service'
import RecipeCard from '../components/RecipeCard';

export default function SearchPage() {
  let {query} = useParams()
  const [recipes, setRecipes] = React.useState<Recipe[]>([])
  const [newQuery, setNewQuery] = React.useState<string>("")

  React.useEffect(() => {
    setRecipes([])
    recipeService.search(query).
    then(res => {
      console.log(res)
      setRecipes(res)})
  }, [])

  return (
    <Hero>
      <Hero.Body>
        <Tile kind="ancestor">
          <Tile kind="parent" vertical size={2}>
          <Heading>Search</Heading>
          <Form.Field>
          <Form.Input type="text" onChange={(event) => setNewQuery(event.currentTarget.value)} 
          onKeyDown={
            (event) => {
                if (event.key === "Enter") {
                    window.location.href = `/search/${newQuery}`
                }
              }}/> 
          </Form.Field>
          {/* TODO: Add a "Add to search" for ingredients and display them below here */}
          {/* TODO: Predictive completion for ingredients or recipes? At least list out Ingredients below when you search for them */}
          {/* TODO: Make the search stay, unless you clicked one of the options, if we do that */}
          {/* Perhaps make a place where you can select tags */}
          <Button onClick={() => window.location.href = "/search/" + newQuery}>Search</Button>
          </Tile>
          <Tile kind="parent">
          <Columns>      
            {recipes.map((recipe) => 
              <Columns.Column key={recipe.id} className='is-narrow'>
                <RecipeCard recipe={recipe} />
              </Columns.Column>
            )}
          </Columns>
          </Tile>
        </Tile>
      </Hero.Body>
    </Hero>
  );
}