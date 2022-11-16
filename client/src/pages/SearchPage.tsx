import * as React from 'react';
// @ts-ignore
import Select from 'react-select'
import type { ActionType } from 'react-select/src/types';
import makeAnimated from 'react-select/animated';
import { Heading, Hero, Tile, Tabs, Box, Form, Button, Columns } from 'react-bulma-components';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes,
  Link, 
  useParams,
  useSearchParams,
  useLocation
} from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import recipeService from '../services/recipe-service'
import RecipeCard from '../components/RecipeCard';
import ingredientService from '../services/ingredient-service';
import { Ingredient } from '../models/Ingredient';
import { FaTimes } from 'react-icons/fa';
import { stringify } from 'querystring';

import { useAlert } from '../hooks/Alert';

const animatedComponents = makeAnimated();

export default function SearchPage() {
  const { appendAlert } = useAlert();
  
  const [ searchParams, setSearchParams ] = useSearchParams();
  // console.log(Object.fromEntries([...searchParams]));

  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [newQuery, setNewQuery] = React.useState<string>(searchParams.get("query") || '');
  const [ingredients, setIngredients] = React.useState<{"value": number, "label": string}[]>([]);
  const [tags, setTags] = React.useState<{"value": string, "label": string}[]>([]);

  let [visibleRecipes, setVisibleRecipes] = React.useState<Recipe[]>([]);
  let [selectedIngredients, setSelectedIngredients] = React.useState<number[]>([]);
  let [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    console.log(currentParams);
    setNewQuery(currentParams.q || '');
    setSelectedIngredients(currentParams.ingredients ? currentParams.ingredients.split(',').map(Number) : []);
    setSelectedTags(currentParams.tags ? currentParams.tags.split(',') : []);
  }, [searchParams]);

  // On page load, get all recipes and their tags and ingredients
  React.useEffect(() => {
    recipeService.getRecipesShort()
      .then(recipes => {
        setRecipes(recipes);
        setVisibleRecipes(recipes);

        let tags = recipes.map(r => r.tags).flat()
        let uniqueTags = [...new Set(tags)]
        let tagObjects = uniqueTags.map(t => {return {"value": t, "label": t}})
        setTags(tagObjects)

      })
      .catch(err => {
        console.error(err);
        appendAlert("Could not load recipes", "danger");
      });


    ingredientService.getIngredients()
      .then(ingredients => {
        let uniqueIngredients = [...new Set(ingredients)]
        let ingredientObjects = uniqueIngredients.map(i => {return {"value": i.id, "label": i.name}})
        setIngredients(ingredientObjects)
      })
      .catch(err => {
        console.error(err);
        appendAlert("Could not load ingredients", "danger");
      });
  }, []);

  // When the query, tags or ingredients change, update the visible recipes
  React.useEffect(() => {
    // Start with all recipes, sieve out the ones that don't match the selected ingredients and tags

    if (selectedIngredients.length > 0) {
      recipeService.searchRecipeByIngredients(selectedIngredients)
        .then(result => {
          filterVisibleRecipes(result);
        })
        .catch(err => {
          console.error(err);
          appendAlert("Could not load recipes", "danger");
        });
    } else {
      filterVisibleRecipes(recipes);
    }
    window.history.replaceState(null, '', `/search/?q=${encodeURIComponent(newQuery)}&ingredients=${encodeURIComponent(selectedIngredients.join(","))}&tags=${encodeURIComponent(selectedTags.join(","))}`);
  }, [selectedTags, selectedIngredients, newQuery]);
  
  function filterVisibleRecipes(passingRecipes: Recipe[]) {
    if (newQuery.length > 0) {
      passingRecipes = passingRecipes.filter(r => r.title.toLowerCase().includes(newQuery.toLowerCase()));
      //TODO: Search by summary, fuzzy search
    }

    if (selectedTags.length > 0) {
      // Filter further by tags
      passingRecipes = passingRecipes.filter(recipe => {
        let hasAllTags = true;
        selectedTags.forEach(tag => {
          if (!recipe.tags.some(t => t === tag)) {
            hasAllTags = false;
          }
        })
        return hasAllTags;
      });
    }

    setVisibleRecipes(passingRecipes);
  }

  return (
    <Hero>
      <Hero.Body>
        <Tile kind="ancestor">
          {/* TODO: Edit size according to breakpoints */}
          <Tile kind="parent" vertical size={3} renderAs={Box}>
          <Heading>Search</Heading>
          <Form.Field>
          <Form.Input type="text" onChange={(event: React.FormEvent) => setNewQuery((event.target as HTMLInputElement).value)} placeholder="Search for recipes" value={newQuery} />
          </Form.Field>
          <Form.Field>
          <Form.Label>Tags</Form.Label>
                <Form.Control>
                  <Select isMulti placeholder="Recipe Tags" name={"Tags"} components={animatedComponents} options={tags} 
                  value={selectedTags.map(t => {return {"value": t, "label": t}})}
                  onChange={(event: ActionType) =>  {
                    setSelectedTags((event.map((tag: {value: string, label: string} ) => tag.value)));
                  }}
                  />
                </Form.Control>
          </Form.Field>
          <Form.Field>
          <Form.Label>Ingredients</Form.Label>
                <Form.Control>
                  <Select isMulti placeholder="Ingredients" name={"Ingredients"} components={animatedComponents} options={ingredients} 
                  value={selectedIngredients.map(i => {return {"value": i, "label": ingredients.find(ing => ing.value === i)?.label}})}
                  onChange={(event: ActionType) => {
                    setSelectedIngredients(event.map((ingredient: {value: string, label: string} ) => ingredient.value));
                  }}
                  />
                </Form.Control>
          </Form.Field>
          <Button color="danger" className='is-outlined'
            onClick={() => {
              setNewQuery('');
              setSelectedIngredients([]);
              setSelectedTags([]);
            }}
          >Clear search
          </Button>
          </Tile>
          <Tile kind="parent">
          <Columns>
            {visibleRecipes.map((recipe) => 
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