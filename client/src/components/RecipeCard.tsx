import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Button, Card, Image, Media, Heading, Content, Icon } from "react-bulma-components";

import { FaArrowRight, FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import recipeService from "../services/recipe-service";
import { type Recipe } from "../models/Recipe";

import { useLogin } from "../hooks/Login";
import { useAlert } from "../hooks/Alert";

type RecipeCardProps = {
  recipe: Recipe;
};

function RecipeCard(props: RecipeCardProps) {
  const { appendAlert } = useAlert();
  const { user, getSessionUser } = useLogin();

  return (
    <>
      <Card style={{ width: 300, margin: "auto" }}>
        <Link to={`/recipes/${props.recipe.id}`}>
          <Card.Image
            size="4by3"
            src={props.recipe.imageUrl}
            alt={props.recipe.title}
          />
        </Link>
        <Card.Content style={{ minHeight: 150 }}>
          <Media>
            <Media.Item>
              <Link
                to={`/recipes/${props.recipe.id}`}
                className="is-flex is-vcentered"
              >
                <Heading size={4}>{props.recipe.title}</Heading>
              </Link>
            </Media.Item>
          </Media>
          <Content>{props.recipe.summary}</Content>
        </Card.Content>
        <Card.Footer>
          {user.googleId ? (
            <Card.Footer.Item>
              {user.googleId && user.likes?.includes(props.recipe.id) ? (
                <>
                  <Button
                    className="is-rounded"
                    color="success"
                    onClick={async () =>
                      recipeService
                        .removeLike(props.recipe.id)
                        .then(() => {
                          appendAlert("Recipe removed from liked recipes", "info");
                          getSessionUser();
                        })
                        .catch(() => {
                          appendAlert("Failed to remove recipe from liked recipes", "danger");
                        })
                    }
                  >
                    <span>{props.recipe.likes && props.recipe.likes}</span>
                    <span className="icon is-small">
                      <Icon>
                        <FaThumbsUp size={18} />
                      </Icon>
                    </span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="is-rounded"
                    color="info"
                    outlined
                    onClick={async () =>
                      recipeService
                        .addLike(props.recipe.id)
                        .then(() => {
                          appendAlert("Recipe added to liked recipes", "success");
                          getSessionUser();
                        })
                        .catch(() => {
                          appendAlert("Failed to add recipe to liked recipes", "danger");
                        })
                    }
                  >
                    <span>{props.recipe.likes && props.recipe.likes}</span>
                    <span className="icon is-small">
                      <Icon>
                        <FaThumbsUp size={18} />
                      </Icon>
                    </span>
                  </Button>
                </>
              )}
            </Card.Footer.Item>
          ) : (
            <Card.Footer.Item>
              <div data-tip="Login to like this recipe">
                <Button
                  className="is-rounded"
                  color="info"
                  outlined
                  disabled
                >
                  <span>{props.recipe.likes && props.recipe.likes}</span>
                  <span className="icon is-small">
                    <Icon>
                      <FaThumbsUp size={18} />
                    </Icon>
                  </span>
                </Button>
              </div>
            </Card.Footer.Item>
          )}
          <Link
            to={`/recipes/${props.recipe.id}`}
            className="is-flex is-vcentered"
          >
            <Card.Footer.Item>
              <span>Read More</span>
              <span className="icon">
                <FaArrowRight />
              </span>
            </Card.Footer.Item>
          </Link>
        </Card.Footer>
      </Card>
      <ReactTooltip />
    </>
  );
}

export default RecipeCard;
