import * as React from "react";

import { Columns, Container, Button } from "react-bulma-components";
import RecipeCard from "../components/RecipeCard";
import ScrollButton from "../components/ScrollUp";
import { type Recipe } from "../models/Recipe";

import recipeService from "../services/recipe-service";

import { useAlert } from "../hooks/Alert";
import { useLogin } from "../hooks/Login";

export default function RecipeList() {
  const [recipeList, setRecipeList] = React.useState<Recipe[]>([]);
  const { user } = useLogin();
  const { appendAlert } = useAlert();

  React.useEffect(() => {
    recipeService
      .getRecipesShort()
      .then((data) => {
        setRecipeList(data);
      })
      .catch((error) => {
        appendAlert("Error fetching recipes", "danger");
      });
  }, [user]);
  return (
    <>
      <Container
        className="mt-2 is-centered"
        style={{ margin: "auto" }}
      >
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
