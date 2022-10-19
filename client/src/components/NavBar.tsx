import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Navbar } from 'react-bulma-components';
import {useState} from 'react';

export default function NavBar() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(current => !current);
  };

  return (
    <div>
      <>
        <Navbar color="link">
          <Navbar.Brand>
            <Navbar.Item renderAs="a" href="#">
              <img
                src="https://bulma.io/images/bulma-logo.png"
                alt="Bulma: a modern CSS framework based on Flexbox"
              />
            </Navbar.Item>
            <Navbar.Burger 
            className= {isActive ? "is-active" : ""}
            onClick={handleClick} />
          </Navbar.Brand>
          <Navbar.Menu 
          id="navbar-example"
          className= {isActive ? "is-active" : ""}>
            <Navbar.Container >
              <Navbar.Item href="/">Home</Navbar.Item>
              <Navbar.Item href="/search">Search</Navbar.Item>
              <Navbar.Item href="/likes">Likes</Navbar.Item>
              <Navbar.Item href="/cart">Shopping Cart</Navbar.Item>
              <Navbar.Item href="/login">Login</Navbar.Item>
              <Navbar.Item href="/admin">Admin</Navbar.Item>
              <Navbar.Item href="https://gitlab.stud.idi.ntnu.no/felixalb/dcst2002-recipe-gr2">Documentation</Navbar.Item>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
      </>
    </div>
  );
}