import * as React from "react";

import { Columns, Heading, Container, Tile, Notification } from "react-bulma-components";

import { type Recipe } from "../models/Recipe";
import RecipeCard from "../components/RecipeCard";
import ScrollButton from "../components/ScrollUp";
import NotAuthorized from "../components/NotAuthorized";

import recipeService from "../services/recipe-service";

import { useLogin } from "../hooks/Login";
import { useAlert } from "../hooks/Alert";

export default function LikePage() {
  const [recipeList, setRecipeList] = React.useState<Recipe[]>([]);

  const { user } = useLogin();

  React.useEffect(() => {
    recipeService
      .getRecipesShort()
      .then((data) => {
        setRecipeList(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!user.googleId) {
    return (
      <Container className="mt-2">
        <NotAuthorized color={"info"} />
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-2 is-centered">
        <Tile
          kind="child"
          renderAs={Notification}
          color="success"
          className="has-text-centered is-12"
        >
          <Heading> Your Liked Recipes </Heading>
        </Tile>
        <Columns
          className="is-multiline"
          style={{ marginTop: "2rem", marginLeft: "auto", marginRight: "auto" }}
        >
          {recipeList.map((recipe) =>
            user.likes?.includes(recipe.id) && (
              <Columns.Column
                className="is-narrow"
                key={recipe.id}
              >
                <RecipeCard recipe={recipe} />
              </Columns.Column>
            )
          )}
        </Columns>
        <ScrollButton />
      </Container>
    </>
  );
}
