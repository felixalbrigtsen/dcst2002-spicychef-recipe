import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useParams } from "react-router-dom";
import { useLogin } from "../hooks/Login";
import {
  Container,
  Image,
  Media,
  Tile,
  Heading,
  Notification,
  Button,
  Form,
  Box,
  Hero,
  Columns,
} from "react-bulma-components";
import { FaPlus, FaMinus, FaToriiGate } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import recipeService from "../services/recipe-service";
import { Recipe } from "../models/Recipe";
import { RecipeIngredient } from "../models/RecipeIngredient";
import listService from "../services/list-service";

import { useAlert } from "../hooks/Alert";

function RecipePage() {
  const { appendAlert } = useAlert();
  const { user, getSessionUser } = useLogin();

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
  }, [user]);

  let [actualServings, setActualServings] = React.useState<number>(recipe.servings);
  React.useEffect(() => {
    setActualServings(recipe.servings);
  }, [recipe.servings]);

  return (
    <>
      <Container>
        <Hero>
          <Hero.Body>
            <Tile kind="ancestor">
              <Tile
                size={4}
                vertical
              >
                <Tile kind="parent">
                  <Tile
                    kind="child"
                    renderAs={Box}
                  >
                    <Media.Item renderAs="figure">
                      {recipe.imageUrl ? (
                        <Image
                          size={4}
                          src={recipe.imageUrl}
                          alt={recipe.title}
                        />
                      ) : (
                        <Image
                          size={4}
                          src="https://bulma.io/images/placeholders/128x128.png"
                        />
                      )}
                    </Media.Item>
                    <Media.Item>
                      <Heading size={4}>{recipe.title}</Heading>
                      <Heading
                        subtitle
                        size={6}
                      >
                        {recipe.summary}
                      </Heading>
                    </Media.Item>
                    <br />
                    {user.googleId ? (
                      <Media.Item>
                        {user.googleId && user.likes.includes(recipe.id) ? (
                          <Button
                            className="is-rounded"
                            aria-label="removeLike"
                            color="success"
                            onClick={() => {
                              recipeService
                                .removeLike(recipe.id)
                                .then(() => {
                                  appendAlert("Recipe removed from favorites", "info"),
                                    getSessionUser();
                                })
                                .catch(() => {
                                  appendAlert("Failed to remove recipe from favorites", "danger");
                                });
                            }}
                          >
                            <span>Liked</span>
                            <span className="icon">
                              <FaThumbsUp />
                            </span>
                          </Button>
                        ) : (
                          <Button
                            className="is-rounded"
                            aria-label="addLike"
                            color="info"
                            outlined
                            onClick={() => {
                              recipeService
                                .addLike(recipe.id)
                                .then(() => {
                                  appendAlert("Recipe added to favorites", "info"),
                                    getSessionUser();
                                })
                                .catch(() => {
                                  appendAlert("Failed to add recipe to favorites", "danger");
                                });
                            }}
                          >
                            <span>Like</span>
                            <span className="icon">
                              <FaThumbsUp />
                            </span>
                          </Button>
                        )}
                      </Media.Item>
                    ) : (
                      <Media.Item>
                        <Button
                          color="info"
                          disabled
                          className="is-rounded"
                        >
                          {" "}
                          <span>Like</span>
                          <span className="icon">
                            <FaThumbsUp />
                          </span>
                        </Button>
                      </Media.Item>
                    )}
                  </Tile>
                </Tile>
                <Tile kind="parent">
                  <Tile
                    kind="child"
                    renderAs={Box}
                  >
                    {recipe.tags?.map((tag) => (
                      <Button
                        key={tag}
                        color="info"
                        className="is-light"
                        style={{ margin: "2px 2px" }}
                        renderAs="span"
                        onClick={() => {
                          window.location.href = `/search/?tags=${encodeURIComponent(tag)}`;
                        }}
                      >
                        {tag}
                      </Button>
                    ))}
                    <Tile></Tile>
                    <Form.Field>
                      <Form.Label>Servings:</Form.Label>
                      <Columns>
                        <Columns.Column className="is-narrow">
                          <Button
                            color="danger"
                            aria-label="reduceServing"
                            onClick={() => {
                              actualServings > 1
                                ? setActualServings(actualServings - 1)
                                : setActualServings(1);
                            }}
                          >
                            <span className="icon">
                              <FaMinus />
                            </span>
                          </Button>
                        </Columns.Column>
                        <Columns.Column>
                          <Form.Control>
                            <Form.Input
                              type="number"
                              aria-label="servings"
                              value={actualServings}
                              min={1}
                              onChange={(event) => {
                                setActualServings(parseInt(event.target.value));
                              }}
                            />
                          </Form.Control>
                        </Columns.Column>
                        <Columns.Column className="is-narrow">
                          <Button
                            color="success"
                            aria-label="increaseServings"
                            onClick={() => {
                              setActualServings(actualServings + 1);
                            }}
                          >
                            <span className="icon">
                              <FaPlus />
                            </span>
                          </Button>
                        </Columns.Column>
                      </Columns>
                    </Form.Field>
                  </Tile>
                </Tile>
                <Tile
                  kind="parent"
                  vertical
                >
                  <Tile
                    kind="child"
                    renderAs={Box}
                  >
                    <Heading
                      subtitle
                      size={4}
                    >
                      Ingredients
                    </Heading>
                    {recipe.ingredients?.map((ingredient) => {
                      return (
                        <Heading
                          key={ingredient.ingredientId}
                          subtitle
                          size={6}
                        >
                          {" "}
                          <b>{ingredient.ingredientName}</b> :{" "}
                          {ingredient.quantity * (actualServings / recipe.servings)}{" "}
                          {ingredient.unitName}{" "}
                        </Heading>
                      );
                    })}
                    {user.googleId ? (
                      <Button
                        renderAs={Notification}
                        aria-label="add to list"
                        onClick={() => {
                          recipe.ingredients?.forEach((ingredient) => {
                            listService
                              .addIngredient(ingredient.ingredientId)
                              .then(() => {
                                appendAlert("Ingredients added to shopping list", "success");
                              })
                              .catch(() => {
                                appendAlert("Failed to add ingredients to shopping list", "danger");
                              });
                          });
                        }}
                      >
                        Add Ingredients to List
                      </Button>
                    ) : (
                      <Button
                        renderAs={Notification}
                        disabled
                      >
                        Add Ingredients to List
                      </Button>
                    )}
                  </Tile>
                </Tile>
              </Tile>
              <Tile
                vertical
                kind="parent"
              >
                <Tile
                  kind="child"
                  renderAs={Box}
                >
                  <Heading
                    subtitle
                    size={4}
                  >
                    Instructions
                  </Heading>
                  <div style={{ whiteSpace: "pre-wrap" }}>{recipe.instructions}</div>
                </Tile>
                <Tile
                  kind="child"
                  renderAs={Box}
                  className="has-text-centered"
                >
                  <Heading
                    subtitle
                    size={4}
                  >
                    Youtube Video
                  </Heading>
                  {recipe.videoUrl ? (
                    <iframe
                      width="90%"
                      height="70%"
                      src={recipe.videoUrl.replace("watch?v=", "embed/")}
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <Heading
                      subtitle
                      size={6}
                    >
                      No video available
                    </Heading>
                  )}
                </Tile>
              </Tile>
            </Tile>
          </Hero.Body>
        </Hero>
      </Container>
    </>
  );
}

export default RecipePage;
