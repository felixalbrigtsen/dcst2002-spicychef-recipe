import * as React from 'react';
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

interface RecipeFormProps {
    recipe: Recipe;
}

type IngredientItem = {
  ingredientName: string;
  quantity: number;
  unitName: string;
}

function RecipeForm (props: RecipeFormProps) {

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

    useEffect(() => {
        setRecipe(props.recipe);
        setTitle(props.recipe.title);
        setSummary(props.recipe.summary);
        setServings(props.recipe.servings);
        setInstructions(props.recipe.instructions);
        setImageLink(props.recipe.imageUrl ? props.recipe.imageUrl : "");
        setVideoLink(props.recipe.videoUrl ? props.recipe.videoUrl : "");
        setStdIngredient(props.recipe.ingredients);
        setIngredients(props.recipe.ingredients.map((ingredient) => { return { ingredientName: ingredient.ingredientName, quantity: ingredient.quantity, unitName: ingredient.unitName } }));
        setTags(props.recipe.tags);
    }, [props.recipe]);

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
    }

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
                    <Form.Input placeholder="Recipe Title" defaultValue={title} 
                    onChange={(e) => {setTitle(e.currentTarget.value);}}
                    />
                  </Form.Control>
                </Tile>
                <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Summary</Form.Label>
                <Form.Control>
                  <Form.Textarea placeholder="Recipe Summary" defaultValue={summary} />
                </Form.Control>
              </Tile>
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Servings</Form.Label>
                <Form.Control>
                  <Form.Input type="number" placeholder="2" defaultValue={servings ? servings : 2} onChange={
                    (e) => {setServings(Number(e.currentTarget.value));}
                  }/>
                </Form.Control>
              </Tile>
              </Tile>
              <Tile kind="parent">
              <Tile kind="child" renderAs={Form.Field}>
                <Form.Label>Recipe Tags</Form.Label>
                <Form.Control>
                  <Form.Input placeholder="Recipe Tags" onKeyDown={
                    (e) => {
                        if (e.key === "Enter") {
                            setTags([...tags, e.currentTarget.value]);
                            e.currentTarget.value = "";
                        }
                        }
                  }/>
                </Form.Control>
                <br />
                <div className='buttons'>
                {tags?.map((tag, i) => (
                <Button color="danger" outlined key={i} onClick={
                    () => {setTags(tags.filter((t, j) => j !== i))}
                    }>
                    <span>{tag}</span>
                    <span className='icon is-small'>
                        <FaTimes />
                    </span>
                </Button>              
                ))}
                </div>
              </Tile>
              </Tile>
              <Tile kind="parent">
                <Tile kind="child" renderAs={Form.Field}>
                  <Form.Label>Recipe Image Link</Form.Label>
                  <Form.Control>
                    <Form.Input placeholder="Recipe Image" defaultValue={imageLink} onChange={
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
                    <Form.Input placeholder="Recipe Video" defaultValue={videoLink} onChange={
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
                  <Form.Textarea placeholder="Recipe Instructions" style={{whiteSpace: "pre-wrap"}} defaultValue={instructions} />
                </Form.Control>
              </Tile>
              <Tile kind="child" renderAs={Form.Field}>
                 {/* TODO: List all ingredients that exist when you enter the input field, creating a new one if it does not exist */}
                <Form.Label>Recipe Ingredients</Form.Label>
                <Form.Control>
                  <Form.Input placeholder="Recipe Ingredients" onKeyDown={
                    (e) => {
                        if (e.key === "Enter") {
                            setIngredients([...ingredients, {ingredientName: e.currentTarget.value, quantity: 0, unitName: ""}]);
                        }
                  }}/>
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
                    { stdIngredient ? stdIngredient.map((ingredient, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td><Form.Input value={ingredients[index].ingredientName} onChange={(e) => {handleIngredientPropertyChange(index, "ingredientName", e.currentTarget.value)}}/></td>
                                    <td><Form.Input type="number" value={Number(ingredients[index].quantity)} onChange={ e => handleIngredientPropertyChange(index, "quantity", e.target.value) }></Form.Input></td>
                                    <td><Form.Input value={ingredients[index].unitName} onChange={ e => handleIngredientPropertyChange(index, "unitName", e.target.value) }></Form.Input></td>
                                    <td>    
                                        <Button color="danger" outlined onClick={
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
                <Button color="primary"
                onClick={() => {handleRecipeSubmit()}}>Submit</Button>
              </Tile>
            </Tile>
          </Tile>
    );
}

export default RecipeForm;