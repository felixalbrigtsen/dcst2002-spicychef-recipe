import * as React from "react";
import { Container, Hero } from "react-bulma-components";

import RecipeForm from "../components/RecipeForm";
import NotAuthorized from "../components/NotAuthorized";

import { useLogin } from "../hooks/Login";

function CreateRecipe() {
  const { user } = useLogin();
  const blankRecipe = {
    id: -1,
    title: "",
    summary: "",
    instructions: "",
    servings: 0,
    imageUrl: "",
    videoUrl: "",
    created_at: "",
    ingredients: [],
    tags: [],
    likes: 0,
  };

  if (!user.isadmin) {
    return (
      <Container className="mt-2">
        <NotAuthorized color={"danger"} />
      </Container>
    );
  }

  return (
    <Container className="mt-2">
      <Hero>
        <Hero.Body>
          <RecipeForm recipe={blankRecipe} />
        </Hero.Body>
      </Hero>
    </Container>
  );
}

export default CreateRecipe;
