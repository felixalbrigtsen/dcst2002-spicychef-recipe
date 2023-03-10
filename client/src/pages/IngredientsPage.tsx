import * as React from "react";
import Fuse from "fuse.js";
import {
  Box,
  Button,
  Form,
  Container,
  Heading,
  Notification,
  Table,
  Tile,
  Card,
} from "react-bulma-components";
import ReactTooltip from "react-tooltip";
import { MdAddCircle, MdSearch } from "react-icons/md";

import ingredientService from "../services/ingredient-service";
import listService from "../services/list-service";
import ScrollButton from "../components/ScrollUp";
import { type Ingredient } from "../models/Ingredient";

import { useAlert } from "../hooks/Alert";
import { useLogin } from "../hooks/Login";

export default function IngredientsPage() {
  const { user, getSessionUser } = useLogin();
  const { appendAlert } = useAlert();

  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [newQuery, setNewQuery] = React.useState<string>("");
  const [selectedIngredients, setSelectedIngredients] = React.useState<Ingredient[]>([]);

  const [visibleIngredients, setVisibleIngredients] = React.useState<Ingredient[]>([]);

  const fuse = new Fuse(ingredients, {
    keys: ["name"],
    threshold: 0.8,
  });

  function toTitleCase(ing: Ingredient) {
    ing.name = ing.name.charAt(0).toUpperCase() + ing.name.slice(1);
    return ing;
  }

  React.useEffect(() => {
    ingredientService
      .getIngredients()
      .then((ingredients) => {
        setIngredients(ingredients.map((ingredient) => toTitleCase(ingredient)));
        setVisibleIngredients(ingredients);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  React.useEffect(searchIngredients, [newQuery]);

  function handleIngredientClick(ingredient: Ingredient) {
    if (selectedIngredients?.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  }

  function addSelectedToList() {
    for (const ingredient of selectedIngredients) {
      listService
        .addIngredient(ingredient.id)
        .then(() => {
          appendAlert("Ingredients added to list", "success");
        })
        .catch((error) => {
          appendAlert("Error adding ingredients to list", "danger");
        });
    }
  }

  function searchRecipeByIngredients(mode: string) {
    const ingredientIds = selectedIngredients.map((ingredient) => ingredient.id);
    window.location.assign(`/search/?ingredients=${encodeURIComponent(ingredientIds.join(","))}`);
  }

  function searchIngredients() {
    if (newQuery.length === 0) {
      setVisibleIngredients(ingredients);
      return;
    }

    const results = fuse.search(newQuery);
    setVisibleIngredients(results.map((result) => result.item));
  }

  return (
    <>
      <Container className="">
        <Tile kind="ancestor">
          <Tile
            kind="parent"
            className="is-vertical m-2"
          >
            <Tile
              kind="child"
              renderAs={Notification}
              color="primary"
              className="has-text-centered is-12"
            >
              <Heading> Ingredients List </Heading>
            </Tile>
            <Box className="has-text-right">
              <Form.Field className="is-grouped column">
                <Form.Control
                  className="has-icons-left is-expanded"
                >
                  <Form.Input
                    type="text"
                    onChange={(event: React.FormEvent) => {
                      setNewQuery((event.target as HTMLInputElement).value);
                    }}
                    placeholder="Search for ingredients"
                    value={newQuery}
                  />
                  <span className="icon is-small is-left">
                    <MdSearch size={24} />
                  </span>
                </Form.Control>
              </Form.Field>
              <Form.Field className="is-grouped columns">
                <Form.Field className="column m-0">
                  <Button
                    color="warning"
                    aria-label="searchAllIngredients"
                    className="is-rounded is-fullwidth"
                    onClick={() => {
                      searchRecipeByIngredients("all");
                    }}
                  >
                    Search Recipes With Selected Ingredients
                  </Button>
                </Form.Field>
                {user.googleId && (
                <Form.Field className="column m-0">
                    <Button
                      color="success"
                      aria-label="addSelectedToList"
                      className="is-rounded is-fullwidth"
                      onClick={addSelectedToList}
                    >
                      Add Selected To List
                    </Button>
                </Form.Field>
                )}
                <Form.Field className="column m-0">
                  <Button
                    color="danger"
                    aria-label="clearSelected"
                    className="is-rounded is-fullwidth"
                    onClick={() => {
                      setSelectedIngredients([]);
                    }}
                  >
                    Clear Selection
                  </Button>
                </Form.Field>
              </Form.Field>
            </Box>
            <Box>
              <Table className="is-fullwidth is-hoverable is-striped">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th className="is-narrow has-text-centered">Include in search</th>
                    <th className="is-narrow has-text-centered">Add to shopping list</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleIngredients.map((ingredient, index) => (
                    <tr key={index}>
                      <td>{ingredient.name}</td>
                      <td className="has-text-centered">
                        <Form.Checkbox
                          className="is-centered"
                          checked={selectedIngredients.includes(ingredient)}
                          onChange={() => {
                            handleIngredientClick(ingredient);
                          }}
                          aria-label={`Select ${ingredient.name}`}
                          aria-required="true"
                        ></Form.Checkbox>
                      </td>
                      <td className="has-text-centered">
                        <div data-tip={!user.googleId ? "Login to add this recipe to your shopping list" : ""}>
                          <Button
                            color="success"
                            className="is-rounded is-outlined"
                            aria-label={`Add ${ingredient.name} to list`}
                            onClick={() => {
                              listService.addIngredient(ingredient.id)
                                .then(() => appendAlert("Ingredients added to list", "success"))
                                .then(getSessionUser)
                                .catch((error) => {
                                  appendAlert("Error adding ingredient to list", "danger");
                                });
                              }}
                            disabled={!user.googleId || user.shoppingList?.includes(ingredient.id)}
                          >
                            <MdAddCircle />
                          </Button>
                        </div>
                        <ReactTooltip />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </Tile>
        </Tile>
      </Container>
      <ScrollButton />
    </>
  );
}
