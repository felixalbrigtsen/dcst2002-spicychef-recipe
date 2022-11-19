import * as React from "react";
import { useState, useEffect, useRef } from "react";

import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";

import { Form, Button, Tile, Image, Table, Container } from "react-bulma-components";

import { FaTimes } from "react-icons/fa";

import { type Recipe } from "../models/Recipe";
import { type Ingredient } from "../models/Ingredient";
import { type RecipeIngredient } from "../models/RecipeIngredient";

import recipeService from "../services/recipe-service";
import ingredientService from "../services/ingredient-service";

import { useAlert } from "../hooks/Alert";

type RecipeFormProps = {
  recipe: Recipe;
};

type IngredientItem = {
  ingredientName: string;
  quantity: number;
  unitName: string;
};

const animatedComponents = makeAnimated();

function RecipeForm(props: RecipeFormProps) {
  // Values used in multiselect and createable select components
  const [ingredientOptions, setIngredientOptions] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [tagOptions, setTagOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [defaultTags, setDefaultTags] = useState<Array<{ value: string; label: string }>>([]);

  // Values used in normal input field and textarea, as well as the recipe object
  const [recipe, setRecipe] = React.useState<Recipe>(props.recipe);
  const [title, setTitle] = React.useState<string>(props.recipe.title);
  const [summary, setSummary] = React.useState<string>(props.recipe.summary);
  const [servings, setServings] = React.useState<number>(props.recipe.servings);
  const [instructions, setInstructions] = React.useState<string>(props.recipe.instructions);
  const [imageLink, setImageLink] = React.useState<string>(props.recipe?.imageUrl ?? "");
  const [videoLink, setVideoLink] = React.useState<string>(props.recipe?.videoUrl ?? "");
  const [stdIngredient, setStdIngredient] = React.useState<RecipeIngredient[]>([]);
  const [ingredients, setIngredients] = React.useState<IngredientItem[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);

  const { appendAlert } = useAlert();

  // Setting all the values
  useEffect(() => {
    setRecipe(props.recipe);
    setTitle(props.recipe.title);
    setSummary(props.recipe.summary);
    setServings(props.recipe?.servings ?? 2);
    setInstructions(props.recipe.instructions);
    setImageLink(props.recipe?.imageUrl ?? "");
    setVideoLink(props.recipe?.videoUrl ?? "");
    setStdIngredient(props.recipe.ingredients);
    setIngredients(
      props.recipe.ingredients.map((ingredient) => {
        return {
          ingredientName: ingredient.ingredientName,
          quantity: ingredient.quantity,
          unitName: ingredient.unitName,
        };
      })
    );
    setTags(props.recipe.tags);
  }, [props.recipe]);

  // Getting ingredients and tags from the database
  useEffect(() => {
    ingredientService
      .getIngredients()
      .then((response) => {
        setIngredientOptions(
          response.map((ingredient: Ingredient) => {
            return { value: ingredient.id, label: ingredient.name };
          })
        );
      })
      .catch((error) => {
        appendAlert("Something went wrong", "danger");
      });
  }, []);

  useEffect(() => {
    recipeService
      .getRecipesShort()
      .then((response) => {
        const tags = response.flatMap((recipe) => recipe.tags);
        const uniqueTags = [...new Set(tags)];
        const tagObjects = uniqueTags.map((tag) => {
          return { value: tag, label: tag };
        });
        setTagOptions(tagObjects);
      })
      .catch((error) => {
        appendAlert("Something went wrong", "danger");
      });
  }, []);

  // Set tags to be options for react-select
  useEffect(() => {
    const tagObjects = tags.map((tag) => {
      return { value: tag, label: tag };
    });
    setDefaultTags(tagObjects);
  }, [tags]);

  const submitRef = useRef<HTMLFormElement>(null);
  // Setting the recipe object on submit
  function handleRecipeSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (submitRef.current?.reportValidity()) {
      event.preventDefault();

      const newRecipe = {
        id: props.recipe.id,
        title,
        summary,
        servings,
        instructions,
        imageUrl: imageLink,
        videoUrl: videoLink,
        ingredients,
        tags,
      };

      if (ingredients.length > 0) {
        const submitMethod =
          props.recipe.id === -1 ? recipeService.createRecipe : recipeService.updateRecipe;

        submitMethod(newRecipe)
          .then((response) => {
            appendAlert("Recipe saved successfully", "success");
            window.location.assign("/admin");
          })
          .catch((error) => {
            console.error(error);
            appendAlert("Something went wrong", "danger");
          });
      } else {
        appendAlert("Please add at least one ingredient", "danger");
      }
    }
  }

  // Updating an ingredient in the ingredients array
  function handleIngredientPropertyChange(index: number, property: string, value: string) {
    const newIngredients = [...ingredients];
    switch (property) {
      case "ingredientName": {
        newIngredients[index].ingredientName = value;
        break;
      }

      case "quantity": {
        let newQuantity = Number.parseFloat(value);
        if (Number.isNaN(newQuantity)) {
          newQuantity = 0;
        }
        newIngredients[index].quantity = Math.abs(newQuantity);
        break;
      }

      case "unitName": {
        newIngredients[index].unitName = value;
        break;
      }
    }

    setIngredients(newIngredients);
  }

  return (
    <>
      <form ref={submitRef} onSubmit={handleRecipeSubmit}>
        <Tile kind="ancestor">
          <Tile
            size={4}
            vertical
          >
            <Tile
              kind="parent"
              vertical
            >
              <Tile
                kind="child"
                renderAs={Form.Field}
              >
                <Form.Label>Recipe Title</Form.Label>
                <Form.Control>
                  <Form.Input
                    placeholder="Recipe Title"
                    aria-label={"Title"}
                    value={title}
                    required
                    title="Please enter a title"
                    onChange={(event) => {
                      setTitle(event.currentTarget.value);
                    }}
                  />
                </Form.Control>
              </Tile>
              <Tile
                kind="child"
                renderAs={Form.Field}
              >
                <Form.Label>Recipe Summary</Form.Label>
                <Form.Control>
                  <Form.Textarea
                    placeholder="Recipe Summary"
                    aria-label={"Summary"}
                    value={summary}
                    required
                    title="Please enter a summary"
                    onChange={(event) => {
                      setSummary(event.currentTarget.value);
                    }}
                  />
                </Form.Control>
              </Tile>
              <Tile
                kind="child"
                renderAs={Form.Field}
              >
                <Form.Label>Recipe Servings</Form.Label>
                <Form.Control>
                  <Form.Input
                    type="number"
                    placeholder="2"
                    aria-label={"Servings"}
                    value={servings}
                    required
                    title="Please enter a number of servings"
                    onChange={(event) => {
                      setServings(Number(event.currentTarget.value));
                    }}
                  />
                </Form.Control>
              </Tile>
            </Tile>
            <Tile kind="parent">
              <Tile
                kind="child"
                renderAs={Form.Field}
              >
                <Form.Label>Recipe Tags</Form.Label>
                <Form.Control>
                  <CreatableSelect
                    placeholder="Tags"
                    aria-label={"Tags"}
                    inputId="tags"
                    components={animatedComponents}
                    value={defaultTags.map((tag) => tag)}
                    isMulti
                    options={tagOptions}
                    onCreateOption={(newTag) => {
                      setTags([...tags, newTag]);
                      setTagOptions([...tagOptions, { value: newTag, label: newTag }]);
                    }}
                    onChange={(selectedTags) => {
                      setTags(selectedTags.map((tag) => tag.value));
                    }}
                  />
                </Form.Control>
              </Tile>
            </Tile>
            <Tile kind="parent">
              <Tile
                kind="child"
                renderAs={Form.Field}
              >
                <Form.Label>Recipe Image Link</Form.Label>
                <Form.Control>
                  <Form.Input
                    placeholder="Recipe Image"
                    aria-label={"ImageURL"}
                    defaultValue={imageLink}
                    onChange={(event) => {
                      setImageLink(event.currentTarget.value);
                    }}
                  />
                </Form.Control>
                {imageLink && (
                  <Image
                    src={imageLink}
                    size={128}
                  />
                )}
              </Tile>
            </Tile>
            <Tile
              kind="parent"
              vertical
            >
              <Tile
                kind="child"
                renderAs={Form.Field}
              >
                <Form.Label>Recipe Video Link</Form.Label>
                <Form.Control>
                  <Form.Input
                    placeholder="Recipe Video"
                    aria-label={"VideoURL"}
                    defaultValue={videoLink}
                    onChange={(event) => {
                      setVideoLink(event.currentTarget.value);
                    }}
                  />
                </Form.Control>
              </Tile>
            </Tile>
          </Tile>
          <Tile
            vertical
            kind="parent"
          >
            <Tile
              kind="child"
              renderAs={Form.Field}
            >
              <Form.Label>Recipe Instructions</Form.Label>
              <Form.Control>
                <Form.Textarea
                  placeholder="Recipe Instructions"
                  aria-label={"Instructions"}
                  style={{ whiteSpace: "pre-wrap" }}
                  defaultValue={instructions}
                  required
                  title="Please enter instructions"
                  onChange={(event) => {
                    setInstructions(event.currentTarget.value);
                  }}
                />
              </Form.Control>
            </Tile>
            <Tile
              kind="child"
              renderAs={Form.Field}
            >
              <Form.Label>Recipe Ingredients</Form.Label>
              <Form.Control>
                <CreatableSelect
                  placeholder="Ingredients"
                  aria-label={"Ingredients"}
                  required
                  options={ingredientOptions}
                  onCreateOption={(newIngredient) => {
                    setIngredientOptions([
                      ...ingredientOptions,
                      { value: 1, label: newIngredient },
                    ]);
                    setIngredients([
                      ...ingredients,
                      { ingredientName: newIngredient, quantity: 0, unitName: "" },
                    ]);
                  }}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setIngredients([
                        ...ingredients,
                        { ingredientName: selectedOption.label, quantity: 0, unitName: "" },
                      ]);
                    }
                  }}
                />
              </Form.Control>
              <br />
              <Table className="is-fullwidth is-hoverable is-striped">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                {ingredients?.map((ingredient, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td>
                          <Form.Input
                            value={ingredients[index].ingredientName}
                            onChange={(event) => {
                              handleIngredientPropertyChange(index, "ingredientName", event.currentTarget.value);
                            }}
                          />
                        </td>
                        <td>
                          <Form.Input
                            type="number"
                            value={Number(ingredients[index].quantity)}
                            onChange={(event) => {
                              handleIngredientPropertyChange(index, "quantity", event.target.value);
                            }}
                          ></Form.Input>
                        </td>
                        <td>
                          <Form.Input
                            value={ingredients[index].unitName}
                            onChange={(event) => {
                              handleIngredientPropertyChange(index, "unitName", event.target.value);
                            }}
                          ></Form.Input>
                        </td>
                        <td>
                          <Button
                            color="danger"
                            aria-label={`Remove ${ingredients[index].ingredientName}`}
                            outlined
                            onClick={() => {
                              setIngredients(ingredients.filter((i, j) => j !== index));
                            }}
                          >
                            <span className="icon is-small">
                              <FaTimes />
                            </span>
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </Table>
            </Tile>
            <Tile
              kind="child"
              renderAs={Form.Field}
              className="has-text-centered"
            >
              <Form.Input
                color="primary"
                aria-label="Submit"
                type="submit"
                value="Submit"
                style={{ display: "inline-block" }}
              />
            </Tile>
          </Tile>
        </Tile>
      </form>
    </>
  );
}

export default RecipeForm;
