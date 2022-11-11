import * as React from 'react';
// @ts-ignore
import Select from 'react-select'
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
import ingredientService from '../services/ingredient-service';
import { Ingredient } from '../models/Ingredient';
import { FaTimes } from 'react-icons/fa';

export default function SearchPage() {
  let {query} = useParams()
  const [recipes, setRecipes] = React.useState<Recipe[]>([])
  const [newQuery, setNewQuery] = React.useState<string>("")
  const [ingredients, setIngredients] = React.useState<{"value": number, "label": string}[]>([])
  const [ tags, setTags ] = React.useState<{"value": string, "label": string}[]>([])

  React.useEffect(() => {
    setRecipes([])
    recipeService.search(query)
    .then(res => {
      console.log(res)
      setRecipes(res)})
  }, [])

  React.useEffect(() => {
    recipeService.getRecipesShort()
    .then(res => {
      let tags = res.map(r => r.tags).flat()
      let uniqueTags = [...new Set(tags)]
      let tagObjects = uniqueTags.map(t => {return {"value": t, "label": t}})
      setTags(tagObjects)
    })
  }, [])

  React.useEffect(() => {
    ingredientService.getIngredients()
    .then(res => {
      setIngredients(res.map((ingredient: Ingredient) => {
        return {"value": ingredient.id, "label": ingredient.name}
      }))
    })
  }, [])

  return (
    <Hero>
      <Hero.Body>
        <Tile kind="ancestor">
          {/* TODO: Edit size according to breakpoints */}
          <Tile kind="parent" vertical size={3}>
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
          <Form.Field>
          <Form.Label>Tags</Form.Label>
                <Form.Control>
                  <Select isMulti placeholder="Recipe Tags" name={"Tags"} options={tags} />
                </Form.Control>
          </Form.Field>
          <Form.Field>
          <Form.Label>Ingredients</Form.Label>
                <Form.Control>
                  <Select name={"Ingredients"} isMulti options={ingredients} />
                </Form.Control>
          </Form.Field>
          {/* TODO: Make searches work with the values of the selects above; ingredients and tags */}
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