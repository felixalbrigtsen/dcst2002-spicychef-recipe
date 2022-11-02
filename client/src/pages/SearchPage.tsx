import * as React from 'react';
import { Heading, Hero, Tile, Tabs, Box, Form } from 'react-bulma-components';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes,
  useParams
} from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import recipeService from '../services/recipe-service'

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
          <input type="text" onChange={(event) => setNewQuery(event.currentTarget.value)}></input>
          <button onClick={() => window.location.href = "/search/" + newQuery}>Search</button>
          <Tile>      
            {recipes.map((recipe) => 
              <div key={recipe.id}>
                <h4>{recipe.title}</h4>
                <Box onClick={() => window.location.href = "/recipe/" + recipe.id}>{recipe.summary}</Box>
              </div>
            )}
          </Tile>
      </Hero.Body>
    </Hero>
  );
}