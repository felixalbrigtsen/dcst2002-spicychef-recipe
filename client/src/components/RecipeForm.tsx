import * as React from 'react';
// @ts-ignore
import CreatableSelect, { useCreatable } from 'react-select/creatable'
import makeAnimated from 'react-select/animated';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';

import { Form, Button, Tile, Image, Table, Container } from 'react-bulma-components';

import { useState, useEffect } from 'react';

import { Recipe } from '../models/Recipe';
import { RecipeIngredient } from '../models/RecipeIngredient';
import { FaTimes } from 'react-icons/fa';
import recipeService from '../services/recipe-service';
import ingredientService from '../services/ingredient-service';
import { Ingredient } from '../models/Ingredient';

interface RecipeFormProps {
    recipe: Recipe;
}

type IngredientItem = {
  ingredientName: string;
  quantity: number;
  unitName: string;
}

const animatedComponents = makeAnimated();

function RecipeForm (props: RecipeFormProps) {

  
    // Values used in multiselect and createable select components
    let [ingredientOptions, setIngredientOptions] = useState<{"value": number, "label": string}[]>([])
    let [tagOptions, setTagOptions] = useState<{"value": string, "label": string}[]>([])
    let [defaultTags, setDefaultTags] = useState<{"value": string, "label": string}[]>([])

    // Values used in normal input field and textarea, as well as the recipe object
    let [ recipe, setRecipe ] = React.useState<Recipe>(props.recipe);
    let [ title , setTitle ] = React.useState<string>(props.recipe.title);
    let [ summary , setSummary ] = React.useState<string>(props.recipe.summary);
    let [ servings , setServings ] = React.useState<number>(props.recipe.servings);
    let [ instructions , setInstructions ] = React.useState<string>(props.recipe.instructions);
    let [ imageLink , setImageLink ] = React.useState<string>(props.recipe.imageUrl ? props.recipe.imageUrl : "");
    let [ videoLink , setVideoLink ] = React.useState<string>(props.recipe.videoUrl ? props.recipe.videoUrl : "");
    let [ stdIngredient, setStdIngredient ] = React.useState<RecipeIngredient[]>([]);
    let [ ingredients, setIngredients ] = React.useState<IngredientItem[]>([]);
    let [ tags, setTags ] = React.useState<string[]>([]);

    // Setting all the values
    useEffect(() => {
        setRecipe(props.recipe);
        setTitle(props.recipe.title);
        setSummary(props.recipe.summary);
        setServings(props.recipe.servings != 0 ? props.recipe.servings : 2);
        setInstructions(props.recipe.instructions);
        setImageLink(props.recipe.imageUrl ? props.recipe.imageUrl : "");
        setVideoLink(props.recipe.videoUrl ? props.recipe.videoUrl : "");
        setStdIngredient(props.recipe.ingredients);
        setIngredients(props.recipe.ingredients.map((ingredient) => { return { ingredientName: ingredient.ingredientName, quantity: ingredient.quantity, unitName: ingredient.unitName } }));
        setTags(props.recipe.tags);
    }, [props.recipe]);

    // Getting ingredients and tags from the database
    useEffect(() => {
        ingredientService.getIngredients()
        .then(res => {
            setIngredientOptions(res.map((ingredient: Ingredient) => {
                return {"value": ingredient.id, "label": ingredient.name}
            }))
        })
    }, [])

    useEffect(() => {
      recipeService.getRecipesShort()
      .then(res => {
        let tags = res.map(r => r.tags).flat()
        let uniqueTags = [...new Set(tags)]
        let tagObjects = uniqueTags.map(t => {return {"value": t, "label": t}})
        setTagOptions(tagObjects)
      })
    }, [])

    // set tags to be options for react-select
    useEffect(() => {
      let tagObjects = tags.map(t => {return {"value": t, "label": t}})
      setDefaultTags(tagObjects)
    }, [tags])


    // Setting the recipe object on submit
    function handleRecipeSubmit() {
        let newRecipe = {id: 0, title: "", summary: "", servings: 0, instructions: "", imageUrl: "", videoUrl: "", ingredients: [{ingredientName: "", quantity: 0, unitName: ""}], tags: [""]};
        newRecipe.id = props.recipe.id || -1;
        newRecipe.title = title;
        newRecipe.summary = summary;
        newRecipe.servings = servings;
        newRecipe.instructions = instructions;
        newRecipe.imageUrl = imageLink;
        newRecipe.videoUrl = videoLink;
        newRecipe.ingredients = ingredients
        newRecipe.tags = tags;
        console.log(newRecipe);
        props.recipe.id !== -1 ? recipeService.updateRecipe(newRecipe) : recipeService.createRecipe(newRecipe);
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
        <Tile kind="ancestor">
          <Tile size={4} vertical>
              <Tile kind="parent" vertical>
                <Tile kind="child" renderAs={Form.Field}>
                  <Form.Label>Recipe Title</Form.Label>
                  <Form.Control>
                    <Form.Input placeholder="Recipe Title" aria-label={"Title"} defaultValue={title} 
                    onChange={(e) => {setTitle(e.currentTarget.value);}}
                    />
                  </Form.Control>
                </Tile>
                <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Summary</Form.Label>
                <Form.Control>
                  <Form.Textarea placeholder="Recipe Summary" aria-label={"Summary"} defaultValue={summary} />
                </Form.Control>
              </Tile>
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Servings</Form.Label>
                <Form.Control>
                  <Form.Input type="number" placeholder="2" aria-label={"Servings"} defaultValue={servings ? servings : 2} onChange={
                    (e) => {setServings(Number(e.currentTarget.value));}
                  }/>
                </Form.Control>
              </Tile>
              </Tile>
              <Tile kind="parent">
              <Tile kind="child" renderAs={Form.Field}>
                <form data-testid='tags-form'>
                <Form.Label>Recipe Tags</Form.Label>
                <Form.Control>
                  <CreatableSelect placeholder="Tags" aria-label={"Tags"} inputId='tags' components={animatedComponents} value={defaultTags.map((tag) => tag)} isMulti options={tagOptions} onCreateOption={
                    (newTag) => {
                      setTags([...tags, newTag]);
                      setTagOptions([...tagOptions, {"value": newTag, "label": newTag}]);
                    }
                  }
                  onChange={
                    (selectedTags) => {
                      selectedTags ? setTags(selectedTags.map((tag) => tag.value)) : setTags([]);
                    }
                  }
                   />
                </Form.Control>
                </form>
              </Tile>
              </Tile>
              <Tile kind="parent">
                <Tile kind="child" renderAs={Form.Field}>
                  <Form.Label>Recipe Image Link</Form.Label>
                  <Form.Control>
                    <Form.Input placeholder="Recipe Image" aria-label={"ImageURL"} defaultValue={imageLink} onChange={
                        (e) => {setImageLink(e.currentTarget.value);}
                    }/>
                  </Form.Control>
                {imageLink && <Image src={imageLink} size={128} />}
                </Tile>
              </Tile>
              <Tile kind="parent" vertical>
                <Tile kind="child" renderAs={Form.Field}>
                  <Form.Label>Recipe Video Link</Form.Label>
                  <Form.Control>
                    <Form.Input placeholder="Recipe Video" aria-label={"VideoURL"} defaultValue={videoLink} onChange={
                        (e) => {setVideoLink(e.currentTarget.value)}
                    } />
                  </Form.Control>
                </Tile>
              </Tile>
            </Tile>
            <Tile vertical kind="parent">
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Instructions</Form.Label>
                <Form.Control>
                  <Form.Textarea placeholder="Recipe Instructions" aria-label={"Instructions"} style={{whiteSpace: "pre-wrap"}} defaultValue={instructions} onChange={
                    (e) => {setInstructions(e.currentTarget.value)}
                  } />
                </Form.Control>
              </Tile>
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Ingredients</Form.Label>
                <Form.Control>
                  <CreatableSelect placeholder="Ingredients" aria-label={"Ingredients"} options={ingredientOptions} onCreateOption={
                    (newIngredient) => {
                      setIngredientOptions([...ingredientOptions, {"value": 1, "label": newIngredient}]);
                      setIngredients([...ingredients, {ingredientName: newIngredient, quantity: 0, unitName: ""}]);
                    }
                  }
                  onChange={
                    (selectedOption) => {
                        if (selectedOption) {
                            setIngredients([...ingredients, {ingredientName: selectedOption.label, quantity: 0, unitName: ""}]);
                            // clear value?
                        }
                    }}
                  />
                </Form.Control>
                <br />
                <Table className='is-fullwidth is-hoverable is-striped'>
                    <thead>
                        <tr>
                            <th>Ingredient</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    { ingredients ? ingredients.map((ingredient, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td><Form.Input value={ingredients[index].ingredientName} onChange={(e) => {handleIngredientPropertyChange(index, "ingredientName", e.currentTarget.value)}}/></td>
                                    <td><Form.Input type="number" value={Number(ingredients[index].quantity)} onChange={ e => handleIngredientPropertyChange(index, "quantity", e.target.value) }></Form.Input></td>
                                    <td><Form.Input value={ingredients[index].unitName} onChange={ e => handleIngredientPropertyChange(index, "unitName", e.target.value) }></Form.Input></td>
                                    <td>    
                                        <Button color="danger" aria-label={`Remove ${ingredients[index].ingredientName}`} outlined onClick={
                                            () => {setIngredients(ingredients.filter((i, j) => j !== index))}
                                            }>
                                            <span className='icon is-small'>
                                                <FaTimes />
                                            </span>
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }) : null }
                </Table>
              </Tile>
              <Tile kind="child" renderAs={Form.Field} className="has-text-centered">
                <Button color="primary" aria-label='Submit'
                onClick={() => {handleRecipeSubmit()}}>Submit</Button>
              </Tile>
            </Tile>
          </Tile>
    );
}

export default RecipeForm;