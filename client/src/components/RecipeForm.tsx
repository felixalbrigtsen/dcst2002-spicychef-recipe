import * as React from "react";
// @ts-ignore
import CreatableSelect, { useCreatable } from "react-select/creatable";
import makeAnimated from "react-select/animated";

import { Form, Button, Tile, Image, Table, Container } from "react-bulma-components";

import { Recipe } from "../models/Recipe";
import { RecipeIngredient } from "../models/RecipeIngredient";
import { FaTimes } from "react-icons/fa";
import recipeService from "../services/recipe-service";
import ingredientService from "../services/ingredient-service";
import { Ingredient } from "../models/Ingredient";

import { useAlert } from "../hooks/Alert";

interface RecipeFormProps {
  recipe: Recipe;
}

type IngredientItem = {
  ingredientName: string;
  quantity: number;
  unitName: string;
};

const animatedComponents = makeAnimated();

function RecipeForm(props: RecipeFormProps) {
  // Values used in multiselect and createable select components
  const [ingredientOptions, setIngredientOptions] = React.useState<{ value: number; label: string }[]>([]);
  const [tagOptions, setTagOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [defaultTags, setDefaultTags] = React.useState<{ value: string; label: string }[]>([]);

  // Values used in normal input field and textarea, as well as the recipe object
  const [recipe, setRecipe] = React.useState<Recipe>(props.recipe);
  const [title, setTitle] = React.useState<string>(props.recipe.title);
  const [summary, setSummary] = React.useState<string>(props.recipe.summary);
  const [servings, setServings] = React.useState<number>(props.recipe.servings);
  const [instructions, setInstructions] = React.useState<string>(props.recipe.instructions);
  const [imageLink, setImageLink] = React.useState<string>(
    props.recipe.imageUrl ? props.recipe.imageUrl : ""
  );
  const [videoLink, setVideoLink] = React.useState<string>(
    props.recipe.videoUrl ? props.recipe.videoUrl : ""
  );
  const [stdIngredient, setStdIngredient] = React.useState<RecipeIngredient[]>([]);
  const [ingredients, setIngredients] = React.useState<IngredientItem[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);

  const { appendAlert } = useAlert();

  // Setting all the values
  React.useEffect(() => {
    setRecipe(props.recipe);
    setTitle(props.recipe.title);
    setSummary(props.recipe.summary);
    setServings(props.recipe.servings != 0 ? props.recipe.servings : 2);
    setInstructions(props.recipe.instructions);
    setImageLink(props.recipe.imageUrl ? props.recipe.imageUrl : "");
    setVideoLink(props.recipe.videoUrl ? props.recipe.videoUrl : "");
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
  React.useEffect(() => {
    ingredientService.getIngredients().then((res) => {
      setIngredientOptions(
        res.map((ingredient: Ingredient) => {
          return { value: ingredient.id, label: ingredient.name };
        })
      );
    });

    recipeService.getRecipesShort().then((res) => {
      const tags = res.map((r) => r.tags).flat();
      const uniqueTags = [...new Set(tags)];
      const tagObjects = uniqueTags.map((t) => {
        return { value: t, label: t };
      });
      setTagOptions(tagObjects);
    });
  }, []);

  // set tags to be options for react-select
  React.useEffect(() => {
    const tagObjects = tags.map((t) => {
      return { value: t, label: t };
    });
    setDefaultTags(tagObjects);
  }, [tags]);

  const submitRef = React.useRef<HTMLFormElement>(null);
  // Setting the recipe object on submit
  function handleRecipeSubmit(e: any) {
  if(submitRef.current?.reportValidity()) {
    e.preventDefault();

    const newRecipe = {
      id: props.recipe.id,
      title: title,
      summary: summary,
      servings: servings,
      instructions: instructions,
      imageUrl: imageLink,
      videoUrl: videoLink,
      ingredients: ingredients,
      tags: tags,
    };

    if(ingredients.length > 0) {
      const submitMethod = (props.recipe.id === -1
      ? recipeService.createRecipe
      : recipeService.updateRecipe);

    submitMethod(newRecipe)
      .then((res) => {
        appendAlert("Recipe saved successfully","success");
        window.location.assign("/admin");
      })
      .catch((err) => {
        console.error(err);
        appendAlert("Something went wrong", "danger");
      });
    } else {
      appendAlert("Please add at least one ingredient", "danger");
    }    
  }
}

  // Updating an ingredient in the ingredients array
  function handleIngredientPropertyChange(index: number, property: string, value: string) {
    let newIngredients = [...ingredients];
    if (property === "ingredientName") {
      newIngredients[index].ingredientName = value;
    } else if (property === "quantity") {
      let newQuantity = parseFloat(value);
      if (isNaN(newQuantity)) {
        newQuantity = 0;
      }
      newIngredients[index].quantity = Math.abs(newQuantity);
    } else if (property === "unitName") {
      newIngredients[index].unitName = value;
    }
    setIngredients(newIngredients);
  }

  return (
    <>
    <form ref={submitRef}>
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
                onChange={(e) => {
                  setTitle(e.currentTarget.value);
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
                onChange={(e) => {
                  setSummary(e.currentTarget.value);
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
                onChange={(e) => {
                  setServings(Number(e.currentTarget.value));
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
                  selectedTags ? setTags(selectedTags.map((tag) => tag.value)) : setTags([]);
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
                onChange={(e) => {
                  setImageLink(e.currentTarget.value);
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
                onChange={(e) => {
                  setVideoLink(e.currentTarget.value);
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
              onChange={(e) => {
                setInstructions(e.currentTarget.value);
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
                setIngredientOptions([...ingredientOptions, { value: 1, label: newIngredient }]);
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
                  // clear value?
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
            {ingredients
              && ingredients.map((ingredient, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td>
                          <Form.Input
                            value={ingredients[index].ingredientName}
                            onChange={(e) => {
                              handleIngredientPropertyChange(
                                index,
                                "ingredientName",
                                e.currentTarget.value
                              );
                            }}
                          />
                        </td>
                        <td>
                          <Form.Input
                            type="number"
                            value={Number(ingredients[index].quantity)}
                            onChange={(e) =>
                              handleIngredientPropertyChange(index, "quantity", e.target.value)
                            }
                          ></Form.Input>
                        </td>
                        <td>
                          <Form.Input
                            value={ingredients[index].unitName}
                            onChange={(e) =>
                              handleIngredientPropertyChange(index, "unitName", e.target.value)
                            }
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
                })
              }
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
            onClick={handleRecipeSubmit}
            value="Submit"
            style={{display: "inline-block"}}
          />
        </Tile>
      </Tile>
    </Tile>
    </form>
    </>
  );
}

export default RecipeForm;
