import * as React from "react";
import { Link } from "react-router-dom";
import { Tile, Notification, Container, Heading, Image, Button } from "react-bulma-components";

type NotAuthorizedProps = {
  color: string;
};

function NotAuthorized(props: NotAuthorizedProps) {
  return (
    <>
      <Tile
        className="is-vertical has-text-centered"
        color={props.color}
        renderAs={Notification}
      >
        <Heading>You are not authorized to view this page</Heading>
      </Tile>
      <Tile className="is-vertical has-text-centered is-align-items-center">
        <Heading subtitle>Please log in to view this page.</Heading>
        <Link to="/login">
          <Button
            outlined
            className="is-rounded"
            color="link"
          >
            <Heading subtitle>Login</Heading>
          </Button>
        </Link>
      </Tile>
    </>
  );
}

export default NotAuthorized;
