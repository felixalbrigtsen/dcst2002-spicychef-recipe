import * as React from "react";
// @ts-expect-error
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Fuse from "fuse.js";

import { BrowserRouter as Router, Route, Routes, Link, useSearchParams } from "react-router-dom";
import { Heading, Hero, Tile, Tabs, Box, Form, Button, Columns } from "react-bulma-components";
import { type Recipe } from "../models/Recipe";
import RecipeCard from "../components/RecipeCard";

import recipeService from "../services/recipe-service";
import ingredientService from "../services/ingredient-service";

import { useAlert } from "../hooks/Alert";

const animatedComponents = makeAnimated();

export default function SearchPage() {
  const { appendAlert } = useAlert();

  const [searchParameters, setSearchParameters] = useSearchParams();

  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [newQuery, setNewQuery] = React.useState<string>(searchParameters.get("query") ?? "");
  const [ingredients, setIngredients] = React.useState<Array<{ value: number; label: string }>>([]);
  const [tags, setTags] = React.useState<Array<{ value: string; label: string }>>([]);

  const [visibleRecipes, setVisibleRecipes] = React.useState<Recipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = React.useState<number[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    const currentParameters = Object.fromEntries(searchParameters);
    setNewQuery(currentParameters.q || "");
    setSelectedIngredients(
      currentParameters.ingredients ? currentParameters.ingredients.split(",").map(Number) : []
    );
    setSelectedTags(currentParameters.tags ? currentParameters.tags.split(",") : []);
  }, [searchParameters]);

  // On page load, get all recipes and their tags and ingredients
  React.useEffect(() => {
    recipeService
      .getRecipesShort()
      .then((recipes) => {
        setRecipes(recipes);

        const tags = recipes.flatMap((r) => r.tags);
        const uniqueTags = [...new Set(tags)];
        const tagObjects = uniqueTags.map((t) => {
          return { value: t, label: t };
        });
        setTags(tagObjects);
      })
      .catch((error) => {
        console.error(error);
        appendAlert("Could not load recipes", "danger");
      });

    ingredientService
      .getIngredients()
      .then((ingredients) => {
        const uniqueIngredients = [...new Set(ingredients)];
        const ingredientObjects = uniqueIngredients.map((i) => {
          return { value: i.id, label: i.name };
        });
        setIngredients(ingredientObjects);
      })
      .catch((error) => {
        console.error(error);
        appendAlert("Could not load ingredients", "danger");
      });
  }, []);

  // Search every time our query, or the available recipes change
  React.useEffect(searchRecipes, [selectedTags, selectedIngredients, newQuery]);
  React.useEffect(searchRecipes, [recipes]);

  function searchRecipes() {
    // Start with all recipes matching ingredients
    if (selectedIngredients.length > 0) {
      recipeService
        .searchRecipeByIngredients(selectedIngredients)
        .then((result) => {
          filterVisibleRecipes(result);
        })
        .catch((error) => {
          console.error(error);
          appendAlert("Could not load recipes", "danger");
        });
    } else {
      // No ingredients are selected, so start with all recipes
      filterVisibleRecipes(recipes);
    }

    // Update the URL corresponding to the current search
    const queries = [];
    if (newQuery) {
      queries.push(`q=${encodeURIComponent(newQuery)}`);
    }

    if (selectedIngredients.length > 0) {
      queries.push(`ingredients=${encodeURIComponent(selectedIngredients.join(","))}`);
    }

    if (selectedTags.length > 0) {
      queries.push(`tags=${encodeURIComponent(selectedTags.join(","))}`);
    }

    const newLocation: string = queries.length > 0 ? "/search/?" + queries.join("&") : "/search";

    // Change the current URL without a reload
    window.history.replaceState(null, "", newLocation);
  }

  function filterVisibleRecipes(passingRecipes: Recipe[]) {
    if (selectedTags.length > 0) {
      // Filter further by tags
      passingRecipes = passingRecipes.filter((recipe) => {
        let hasAllTags = true;
        for (const tag of selectedTags) {
          if (!recipe.tags.includes(tag)) {
            hasAllTags = false;
          }
        }

        return hasAllTags;
      });
    }

    if (newQuery.length > 0) {
      const fuse = new Fuse(passingRecipes, {
        keys: ["title", "summary"],
        threshold: 0.3,
      });

      const results = fuse.search(newQuery);
      passingRecipes = results.map((r) => r.item);
    }

    setVisibleRecipes(passingRecipes);
  }

  return (
    <Hero>
      <Hero.Body>
        <Tile kind="ancestor">
          <Tile
            kind="parent"
            vertical
            size={3}
            renderAs={Box}
          >
            <Heading>Search</Heading>
            <Form.Field>
              <Form.Input
                type="text"
                onChange={(event: React.FormEvent) => {
                  setNewQuery((event.target as HTMLInputElement).value);
                }}
                placeholder="Search for recipes"
                value={newQuery}
              />
            </Form.Field>
            <Form.Field>
              <Form.Label>Tags</Form.Label>
              <Form.Control>
                <Select
                  isMulti
                  placeholder="Recipe Tags"
                  aria-label={"Tags"}
                  name={"Tags"}
                  components={animatedComponents}
                  options={tags}
                  value={selectedTags.map((t) => {
                    return { value: t, label: t };
                  })}
                  onChange={(event: any) => {
                    setSelectedTags(
                      event.map((tag: { value: string; label: string }) => tag.value)
                    );
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Ingredients</Form.Label>
              <Form.Control>
                <Select
                  isMulti
                  placeholder="Ingredients..."
                  aria-label={"Ingredients"}
                  name={"Ingredients"}
                  components={animatedComponents}
                  options={ingredients}
                  value={selectedIngredients.map((i) => {
                    return { value: i, label: ingredients.find((ing) => ing.value === i)?.label };
                  })}
                  onChange={(event: any) => {
                    setSelectedIngredients(
                      event.map((ingredient: { value: string; label: string }) => ingredient.value)
                    );
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Button
              color="danger"
              className="is-outlined"
              aria-label="clearSearch"
              onClick={() => {
                setNewQuery("");
                setSelectedIngredients([]);
                setSelectedTags([]);
              }}
            >
              Clear Search
            </Button>
          </Tile>
          <Tile kind="parent">
            <Columns>
              {visibleRecipes.map((recipe) => (
                <Columns.Column
                  key={recipe.id}
                  className="is-narrow"
                >
                  <RecipeCard recipe={recipe} />
                </Columns.Column>
              ))}
            </Columns>
          </Tile>
        </Tile>
      </Hero.Body>
    </Hero>
  );
}
