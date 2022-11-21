import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Columns,
  Container,
  Form,
  Heading,
  Hero,
  Image,
  Media,
  Notification,
  Tile,
} from "react-bulma-components";
import ReactTooltip from "react-tooltip";

import { FaPlus, FaMinus, FaThumbsUp } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { type Recipe } from "../models/Recipe";

import recipeService from "../services/recipe-service";
import listService from "../services/list-service";

import { useLogin } from "../hooks/Login";
import { useAlert } from "../hooks/Alert";
import PageNotFound from "./PageNotFound";

function RecipePage() {
  const { appendAlert } = useAlert();
  const { user, getSessionUser } = useLogin();

  const [statusCode, setStatusCode] = React.useState<number>(0)
  const [recipe, setRecipe] = React.useState<Recipe>({
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
  });

  const id = Number(useParams().id);
  React.useEffect(() => {
    recipeService
      .getRecipe(id)
      .then((data) => {
        setRecipe(data);
      })
      .catch((error) => {
        if (error.response.status !== 404) {
          appendAlert("Something went wrong", "danger");
        }
        setStatusCode(error.response.status);
      });
  }, [user]);

  let [actualServings, setActualServings] = React.useState<number>(recipe?.servings || 2);
  React.useEffect(() => {
    setActualServings(recipe.servings);
  }, [recipe.servings]);

  function adjustServings(newCount: number) {
    if (newCount > 1 && !Number.isNaN(newCount)) {
      setActualServings(newCount);
    } else {
      setActualServings(1);
    }
  }
  if (statusCode === 404) {
    return <PageNotFound />
  }

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
                    <Container className="is-flex is-justify-content-space-between">
                      {user.googleId ? (
                        <>
                          {user.googleId && user.likes?.includes(recipe.id) ? (
                            <Button
                              className="is-rounded"
                              aria-label="removeLike"
                              color="success"
                              onClick={() => {
                                recipeService
                                  .removeLike(recipe.id)
                                  .then(() => {
                                    appendAlert("Recipe removed from liked recipes", "info");
                                    getSessionUser();
                                  })
                                  .catch(() => {
                                    appendAlert("Failed to remove recipe from liked recipes", "danger");
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
                                    appendAlert("Recipe added to liked recipes", "info");
                                    getSessionUser();
                                  })
                                  .catch(() => {
                                    appendAlert("Failed to add recipe to liked recipes", "danger");
                                  });
                              }}
                            >
                              <span>Like</span>
                              <span className="icon">
                                <FaThumbsUp />
                              </span>
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <div data-tip="Login to like this recipe">
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
                          </div>
                          <ReactTooltip />
                        </>
                      )}
                      {user.isadmin && (
                        <Link to={`/edit/${recipe.id}`}>
                          <Button
                            color="link is-light"
                            className="is-rounded"
                          >
                            <span>Edit</span>
                            <span className="icon">
                              <MdEdit />
                            </span>
                          </Button>
                        </Link>
                      )}
                    </Container>
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
                            aria-label="reduceServings"
                            onClick={() => {
                              adjustServings(actualServings - 1);
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
                                adjustServings(Number.parseInt(event.target.value, 10));
                              }}
                            />
                          </Form.Control>
                        </Columns.Column>
                        <Columns.Column className="is-narrow">
                          <Button
                            color="success"
                            aria-label="increaseServings"
                            onClick={() => {
                              adjustServings(actualServings + 1);
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
                    {recipe.ingredients?.map((ingredient, index) => {
                      return (
                        <Heading
                          key={index}
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
                          if (recipe.ingredients)
                            for (const ingredient of recipe.ingredients) {
                              listService
                                .addIngredient(ingredient.ingredientId)
                                .then(() => {
                                  appendAlert("Ingredients added to shopping list", "success");
                                })
                                .catch(() => {
                                  appendAlert(
                                    "Failed to add ingredients to shopping list",
                                    "danger"
                                  );
                                });
                            }
                        }}
                      >
                        Add Ingredients to List
                      </Button>
                    ) : (
                      <>
                        <div data-tip="Login to add ingredients to shopping list">
                          <Button
                            renderAs={Notification}
                            disabled
                          >
                            Add Ingredients to List
                          </Button>
                        </div>
                        <ReactTooltip />
                      </>
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
                      title="Embedded youtube"
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
