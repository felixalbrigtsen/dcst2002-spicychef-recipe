import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useState } from "react";

import RecipeCard from "../components/RecipeCard";
import recipeService from "../services/recipe-service";
import { Recipe } from "../models/Recipe";

import { useLogin } from "../hooks/Login";

import { Columns, Container, Button, Box, Form, Heading } from "react-bulma-components";
import ScrollButton from "../components/ScrollUp";

export default function RecipeList() {
  const [recipeList, setRecipeList] = React.useState<Recipe[]>([]);
  const [sorting, setSorting] = useState("likes");

  const { user } = useLogin();

  React.useEffect(() => {
    let recipes = [...recipeList];

    switch(sorting) {
      case "likes":
        recipes.sort((a, b) => b.likes - a.likes);
        break;
      case "newest":
        recipes.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        recipes.sort((a, b) => a.id - b.id);
        break;

      case "title":
      default:
        recipes.sort((a, b) => a.title.localeCompare(b.title));
    }

    setRecipeList(recipes);
  }, [sorting]);

  React.useEffect(() => {
    recipeService.getRecipesShort().then((data) => {
      setRecipeList(data);
    });
  }, [user]);

  return (
    <>
      <Container
        className="mt-2 is-centered"
        style={{ margin: "auto" }}
      >
        <Box>
          <Form.Field kind="group" className="is-flex is-flex-direction-row is-vcentered is-justify-content-center">
            <Heading className="is-flex-grow-1 is-expanded">Explore Recipes</Heading>

            <Form.Label className="is-vcentered mr-1" style={{lineHeight: "2"}}> Sort by </Form.Label>
            <Form.Select value={sorting} onChange={(event) => setSorting(event.target.value)}>
              <option value="likes">Likes</option>
              <option value="title">Title</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </Form.Select>
          </Form.Field>
        </Box>
        <Columns
          className="is-multiline"
          style={{ margin: "2rem auto" }}
        >
          {recipeList.map((recipe) => (
            <Columns.Column
              className="is-narrow"
              key={recipe.id}
            >
              <RecipeCard recipe={recipe} />
            </Columns.Column>
          ))}
        </Columns>
        <ScrollButton />
      </Container>
    </>
  );
}
