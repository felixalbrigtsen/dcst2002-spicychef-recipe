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
          <Form.Input type="text" onChange={(event) => setNewQuery(event.currentTarget.value)} 
          onKeyDown={
            (event) => {
                if (event.key === "Enter") {
                    window.location.href = `/search/${newQuery}`
                }
              }}/> 
          <Button onClick={() => window.location.href = "/search/" + newQuery}>Search</Button>
          <Tile>      
            {recipes.map((recipe) => 
              <div key={recipe.id}>
                {/* TODO : Add RecipeCard here when functional in backend */}
                <Link to={"/recipe/" + recipe.id}>{recipe.title}</Link>
              </div>
            )}
          </Tile>
      </Hero.Body>
    </Hero>
  );
}