import * as React from "react";
import { Link } from "react-router-dom";

import { Tile, Notification, Container, Heading, Image, Button } from "react-bulma-components";

export default function PageNotFound() {
  return (
    <Container className="mt-2">
      <Tile
        className="is-vertical has-text-centered"
        color="info"
        renderAs={Notification}
      >
        <Heading>404 - Page Not Found</Heading>
      </Tile>
      <Tile className="is-vertical has-text-centered is-align-items-center">
        <Heading subtitle>Sorry, the page you are looking for does not exist.</Heading>
        <Image
          style={{ width: "25%", margin: "1rem" }}
          src="/404.gif"
          alt="Page not found"
        />
        <Link to="/">
          <Button
            outlined
            className="is-rounded"
            color="link"
          >
            <Heading subtitle>Go home!</Heading>
          </Button>
        </Link>
      </Tile>
    </Container>
  );
}
