import * as React from "react";
import { MdDeleteForever } from "react-icons/md";
import {
  Box,
  Button,
  Container,
  Heading,
  Notification,
  Table,
  Tile,
} from "react-bulma-components";
import { useEffect } from "react";
import NotAuthorized from "../components/NotAuthorized";

import listService from "../services/list-service";

import { useLogin } from "../hooks/Login";
import { useAlert } from "../hooks/Alert";

export default function ShoppingListPage() {
  const { user, getSessionUser } = useLogin();
  const { appendAlert } = useAlert();

  function handleRemove(ingredientId: number) {
    listService
      .removeIngredient(ingredientId)
      .then(getSessionUser)
      .catch((error) => {
        appendAlert("Error removing ingredient", "danger");
      });
  }

  const [listItems, setListItems] = React.useState<Array<{ id: number; name: string }>>([]);

  function updateListItems() {
    listService
      .getShoppingListItems(user)
      .then((items) => {
        setListItems(items);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(updateListItems, [user]);

  if (!user.googleId) {
    return (
      <Container className="mt-2">
        <NotAuthorized color={"info"} />
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-2">
        <Tile kind="ancestor">
          <Tile
            kind="parent"
            className="is-vertical"
          >
            <Tile
              kind="child"
              renderAs={Notification}
              color="warning"
              className="has-text-centered is-12"
            >
              <Heading> Shopping List </Heading>
            </Tile>
            <Box className="has-text-right">
              <Button
                color="danger"
                aria-label="clearList"
                className="is-rounded"
                onClick={() => {
                  listItems?.map((item, index) => {
                    handleRemove(item.id);
                  });
                  updateListItems();
                }}
              >
                Clear all
              </Button>
            </Box>
            <Box>
              <Table className="is-fullwidth is-hoverable is-striped">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className="is-narrow">
                        <Button
                          color="danger"
                          className="is-rounded is-outlined"
                          onClick={() => {
                            handleRemove(item.id);
                          }}
                          aria-label={`Remove ${item.name} from shopping list`}
                          aria-required="true"
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
      </Container>
    </>
  );
}
