import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import { Form, Button, Container, Tile, Hero } from "react-bulma-components";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "../models/Recipe";
import recipeService from "../services/recipe-service";
import RecipeForm from "../components/RecipeForm";
import { useLogin } from "../hooks/Login";
import NotAuthorized from "../components/NotAuthorized";

function EditRecipe() {
  const { user } = useLogin();
  let [recipe, setRecipe] = React.useState<Recipe>({
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

  let id = Number(useParams().id);
  React.useEffect(() => {
    recipeService.getRecipe(id).then((data) => {
      setRecipe(data);
    });
  }, []);

  if (!user.isadmin) {
    return <Container className="mt-2"><NotAuthorized color={"danger"} /></Container>;
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
