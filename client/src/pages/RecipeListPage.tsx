import * as React from "react";

import RecipeCard from "../components/RecipeCard";
import { type Recipe } from "../models/Recipe";

import recipeService from "../services/recipe-service";

import { useAlert } from "../hooks/Alert";
import { useLogin } from "../hooks/Login";

import { Columns, Container, Button, Notification, Form, Heading } from "react-bulma-components";
import ScrollButton from "../components/ScrollUp";

export default function RecipeList() {
  const [allRecipes, setAllRecipes] = React.useState<Recipe[]>([]);
  const [visibleRecipes, setVisibleRecipes] = React.useState<Recipe[]>([]);
  const [sorting, setSorting] = React.useState("likes");

  const { user } = useLogin();
  const { appendAlert } = useAlert();

  React.useEffect(() => {
    let recipes = [...allRecipes];

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

    setVisibleRecipes(recipes);
  }, [sorting, allRecipes]);

  React.useEffect(() => {
    recipeService.getRecipesShort().then((data) => {
      setAllRecipes(data);
    });
  }, [user]);

  return (
    <>
      <Container
        className="mt-2 is-centered"
        style={{ margin: "auto" }}
      >
        <Notification color="primary">
          <Form.Field kind="group" className="is-flex is-flex-direction-row is-vcentered is-justify-content-center">
            <Heading className="is-flex-grow-1 is-expanded">Explore Recipes</Heading>

            <Form.Label className="has-text-white is-vcentered mr-1" style={{lineHeight: "2"}}> Sort by </Form.Label>
            <Form.Select value={sorting} onChange={(event) => setSorting(event.target.value)}>
              <option value="likes">Likes</option>
              <option value="title">Title</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </Form.Select>
          </Form.Field>
        </Notification>
        <Columns
          className="is-multiline"
          style={{ margin: "2rem auto" }}
        >
          {visibleRecipes.map((recipe) => (
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
