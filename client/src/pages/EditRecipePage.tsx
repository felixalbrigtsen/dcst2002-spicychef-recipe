import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";

import { Container, Hero } from "react-bulma-components";

import { type Recipe } from "../models/Recipe";
import RecipeForm from "../components/RecipeForm";
import NotAuthorized from "../components/NotAuthorized";

import recipeService from "../services/recipe-service";

import { useLogin } from "../hooks/Login";

function EditRecipe() {
  const { user } = useLogin();

  const [recipe, setRecipe] = React.useState<Recipe>({
    id: 0,
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
  });

  const id = Number(useParams().id);
  React.useEffect(() => {
    recipeService
      .getRecipe(id)
      .then((data) => {
        setRecipe(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
          <RecipeForm recipe={recipe} />
        </Hero.Body>
      </Hero>
    </Container>
  );
}

export default EditRecipe;
