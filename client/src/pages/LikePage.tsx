import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useState } from "react";
import { useLogin } from "../hooks/Login";
import { Recipe } from "../models/Recipe";
import RecipeCard from "../components/RecipeCard";
import recipeService from "../services/recipe-service";
import ScrollButton from "../components/ScrollUp";
import { Columns, Heading, Container, Tile, Notification } from "react-bulma-components";
import NotAuthorized from "../components/NotAuthorized";

export default function LikePage() {
  let [recipeList, setRecipeList] = React.useState<Recipe[]>([]);

  const { user } = useLogin();
  // const user = {
  //   googleId: 1,
  //   name: "hei",
  //   email: "hi",
  //   picture: "abc",
  //   isadmin: true,
  //   likes: [1,4],
  //   shoppingList: [1,2,3,4]
  // }

  React.useEffect(() => {
    recipeService.getRecipesShort().then((data) => {
      setRecipeList(data);
    });
  }, []);

  if(!user.googleId) {
    return <Container className="mt-2"><NotAuthorized color={"info"} /></Container>;
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
            user.likes.includes(recipe.id) && (
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
