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
        <Heading>Search</Heading>
        <Form.Field>
          <Form.Input type="text" onChange={(event) => setNewQuery(event.currentTarget.value)} 
          onKeyDown={
            (event) => {
                if (event.key === "Enter") {
                    window.location.href = `/search/${newQuery}`
                }
              }}/> 
          <Button onClick={() => window.location.href = "/search/" + newQuery}>Search</Button>
          </Form.Field>
          <Columns>      
            {recipes.map((recipe) => 
              <Columns.Column key={recipe.id} className="is-one-quarter">
                <RecipeCard recipe={recipe} />
              </Columns.Column>
            )}
          </Columns>
      </Hero.Body>
    </Hero>
  );
}