import * as React from 'react';
// @ts-ignore
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Heading, Hero, Tile, Tabs, Box, Form, Button, Columns } from 'react-bulma-components';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes,
  Link, 
  useParams,
  useSearchParams
} from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import recipeService from '../services/recipe-service'
import RecipeCard from '../components/RecipeCard';
import ingredientService from '../services/ingredient-service';
import { Ingredient } from '../models/Ingredient';
import { FaTimes } from 'react-icons/fa';
import { stringify } from 'querystring';

const animatedComponents = makeAnimated();

export default function SearchPage() {
  const [ searchParams, setSearchParams ] = useSearchParams();
  // console.log(Object.fromEntries([...searchParams]));
  // let query = searchParams.get("query") || '';

  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [newQuery, setNewQuery] = React.useState<string>(searchParams.get("query") || '');
  const [ingredients, setIngredients] = React.useState<{"value": number, "label": string}[]>(
    searchParams.get("ingredients") ? JSON.parse(searchParams.get("ingredients") || '') : []
  );
  const [tags, setTags] = React.useState<{"value": string, "label": string}[]>(
    searchParams.get("tags") ? JSON.parse(searchParams.get("tags") || '') : []
  );
  let [selectedIngredients, setSelectedIngredients] = React.useState<Ingredient[]>([]);
  let [selectedTags, setSelectedTags] = React.useState<{"value": string, "label": string}[]>([]);

  React.useEffect(() => {
    setRecipes([])
    recipeService.search(newQuery)
    .then(res => {
      let passing = res; 
      passing = passing.filter(recipe => {
        let hasAllIngredients = true;
        selectedIngredients.forEach(ingredient => {
          if (!recipe.ingredients.some(ing => ing.id === ingredient.id)) {
            hasAllIngredients = false;
          }
        })
        return hasAllIngredients;
      });
      setRecipes(passing);
    })
  }, [])
  
  React.useEffect(() => {
    recipeService.getRecipesShort()
    .then(res => {
      let tags = res.map(r => r.tags).flat()
      let uniqueTags = [...new Set(tags)]
      let tagObjects = uniqueTags.map(t => {return {"value": t, "label": t}})
      setTags(tagObjects)
    })

    ingredientService.getIngredients()
    .then(res => {
      setIngredients(res.map((ingredient: Ingredient) => {
        return {"value": ingredient.id, "label": ingredient.name}
      }))
    })
  }, [])

  const search = function() {
    window.location.href = `/search/?q=${newQuery}&tags=${selectedTags.join(",")}&ingredients=${selectedIngredients.join(",")}`
  }

  return (
    <Hero>
      <Hero.Body>
        <Tile kind="ancestor">
          {/* TODO: Edit size according to breakpoints */}
          <Tile kind="parent" vertical size={3}>
          <Heading>Search</Heading>
          <Form.Field>
          <Form.Input type="text" onChange={(event: React.FormEvent) => setNewQuery((event.target as HTMLInputElement).value)} placeholder="Search for recipes" value={newQuery}
          onKeyDown={
            (event: React.FormEvent) => {
              if (event.key === "Enter") {
                search()
              }
            }}/>
          </Form.Field>
          <Form.Field>
          <Form.Label>Tags</Form.Label>
                <Form.Control>
                  <Select isMulti placeholder="Recipe Tags" components={animatedComponents} name={"Tags"} options={tags}
                  onChange={(event: React.ChangeEvent) =>  {
                    setSelectedTags((event.target as HTMLInputElement).value.map((tag) => tag.value));
                  }}
                  />
                </Form.Control>
          </Form.Field>
          <Form.Field>
          <Form.Label>Ingredients</Form.Label>
                <Form.Control>
                  <Select isMulti placeholder="Ingredients" components={animatedComponents} options={ingredients} name={"Ingredients"}
                  onChange={(event: InputEvent) => {
                    console.log(event.target)
                    setSelectedIngredients(event.target.value.map((ingredient) => ingredient.value));
                    console.log(selectedIngredients)
                  }}
                  />
                </Form.Control>
          </Form.Field>
          {/* TODO: Make searches work with the values of the selects above; ingredients and tags */}
          {/* TODO: Make the search stay, unless you clicked one of the options, if we do that */}
          {/* Perhaps make a place where you can select tags */}
          <Button onClick={search}>Search</Button>
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