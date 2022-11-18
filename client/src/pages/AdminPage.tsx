import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import recipeService from "../services/recipe-service";
import { useEffect } from "react";
import { useLogin } from "../hooks/Login";
import { Recipe } from "../models/Recipe";
import ScrollButton from "../components/ScrollUp";
import NotAuthorized from "../components/NotAuthorized";

import {
  Table,
  Container,
  Heading,
  Tile,
  Box,
  Notification,
  Button,
  Modal,
  Form,
} from "react-bulma-components";
import { MdDeleteForever, MdEdit, MdRemoveRedEye, MdAddCircle, MdSearch } from "react-icons/md";
import { BiImport } from "react-icons/bi";

import { useAlert } from "../hooks/Alert";

function AdminView() {
  let [recipeList, setRecipeList] = React.useState<Recipe[]>([]);

  const updateRecipeList = () => {
    recipeService.getRecipesShort().then((data) => {
      setRecipeList(data);
    });
  }

  React.useEffect(updateRecipeList, []);

  const { user } = useLogin();
  const { appendAlert } = useAlert();

  const [confirmationState, setConfirmationState] = React.useState<boolean>(false);
  const [confirmItem, setConfirmItem] = React.useState<number>(-1);
  const [mealDBRecipe, setMealDBRecipe] = React.useState<number>(-1);

  function showConfirmation(id: number) {
    setConfirmItem(id);
    setConfirmationState(!confirmationState);
  }

  function handleDelete(id: number) {
    console.log("Deleting recipe with id: " + id);
    recipeService
      .deleteRecipe(id)
      .then(() => { appendAlert("Recipe deleted successfully", "success"); updateRecipeList(); })
      .catch(() => appendAlert("Recipe deletion failed", "danger"));
    setConfirmationState(!confirmationState);
    setConfirmItem(-1);
  }

  if(!user.isadmin) {
    return <Container className="mt-2"><NotAuthorized color={"danger"} /></Container>;
  }
    
  return (
    <>
      <Container className="mt-2">
        <Modal
          show={confirmationState}
          onClose={() => {
            setConfirmationState(!confirmationState);
          }}
        >
          <Modal.Card>
            <Modal.Card.Header>
              <Modal.Card.Title>Do you really want to delete this recipe?</Modal.Card.Title>
            </Modal.Card.Header>
            <Modal.Card.Footer>
              <Button
                color="danger"
                aria-label="confirm"
                onClick={() => handleDelete(confirmItem)}
              >
                Yes, Delete
              </Button>
              <Button
                aria-label="cancel"
                onClick={() => {
                  setConfirmationState(!confirmationState),
                    appendAlert("Cancelled deletion", "info");
                }}
              >
                Cancel
              </Button>
            </Modal.Card.Footer>
          </Modal.Card>
        </Modal>
        <Tile kind="ancestor">
          <Tile
            kind="parent"
            className="is-vertical"
          >
            <Tile kind="parent" className="is-justify-content-space-evenly">
              <Tile
                kind="child"
                size={8}
                className="has-text-centered"
                renderAs={Box}
              >
                <Link to="/create">
                  <Button
                    color="success"
                    style={{ width: "80%" }}
                    aria-label="NewRecipe"
                  >
                    <span>Create New</span>
                    <span className="icon">
                      <MdAddCircle />
                    </span>
                  </Button>
                </Link>
                <hr style={{backgroundColor:"lightslategray", borderColor: "lightslategray", color: "lightslategray", width: "85%", margin: "1em auto"}} />
                <Tile className="is-justify-content-space-evenly">
                  <Form.Control>
                  <Form.Input  
                    aria-label="mealdb-id"
                    placeholder="MealDB ID" 
                    type="number"
                    onInput={(e) => setMealDBRecipe(parseInt((e.target as HTMLInputElement).value))}
                  ></Form.Input>
                  </Form.Control>
                  <br />
                  <Button
                    color="link"
                    aria-label="ImportRecipe"
                    onClick={() => {
                      recipeService.importRecipe(mealDBRecipe)
                      .then(() => { appendAlert("Recipe imported successfully", "success"); updateRecipeList(); })
                      .catch(() => appendAlert("Recipe import failed", "danger"));
                    }}
                  >
                    <span>Import From MealDB</span>
                    <span className="icon">
                      <BiImport />
                    </span>
                  </Button>
                  </Tile>
              </Tile>
            </Tile>
            <br />
            {/* Add search */}
            <Box>
              <Table className="is-fullwidth is-hoverable is-striped">
                <thead>
                  <tr>
                    <th>Recipe Title</th>
                    <th className="has-text-centered">View</th>
                    <th className="has-text-centered">Edit</th>
                    <th className="has-text-centered">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {recipeList.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link
                          to={`/recipes/${item.id}`}
                          style={{ textDecoration: "none", color: "dark" }}
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="is-narrow has-text-centered"> 
                        <Link to={`/recipes/${item.id}`}>
                          <Button
                            color="dark"
                            className="is-rounded is-outlined"
                            aria-label={item.title}
                          >
                            <MdRemoveRedEye />
                          </Button>
                        </Link>
                      </td>
                      <td className="is-narrow has-text-centered">
                        <Link to={`/edit/${item.id}`}>
                          <Button
                            color="success"
                            className="is-rounded is-outlined"
                            aria-label={`Edit ${item.title}`}
                          >
                            <MdEdit />
                          </Button>
                        </Link>
                      </td>
                      <td className="is-narrow has-text-centered">
                        <Button
                          color="danger"
                          className="is-rounded is-outlined"
                          aria-label={`Delete ${item.title}`}
                          onClick={() => {
                            showConfirmation(item.id);
                          }}
                        >
                          <MdDeleteForever />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </Tile>
        </Tile>
        <ScrollButton />
      </Container>
    </>
  );
}

export default AdminView;
