import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Navbar, Image } from 'react-bulma-components';
import {useState} from 'react';
import { useLogin } from '../hooks/Login';

export default function NavBar() {
  const [isActive, setIsActive] = useState(false);
  const { user, logout } = useLogin();

  const handleClick = () => {
    setIsActive(current => !current);
  };

  return (
    <Navbar color="link">
      <style>
      {`.navbar-item img { max-height: none !important; }`}
      </style>

      <Navbar.Brand>
        <Navbar.Item renderAs="a" href="/">
          <Image
            src="/logo.png"
            alt="SpicyChef Logo"
            size={32}
          />
        </Navbar.Item>
        <Navbar.Burger
        className= {isActive ? "is-active" : ""}
        onClick={handleClick}
        />
      </Navbar.Brand>
      <Navbar.Menu 
      id="navbar-example"
      className= {isActive ? "is-active" : ""}>
        <Navbar.Container >
          <Navbar.Item href="/">Home</Navbar.Item>
          <Navbar.Item href="/search">Search</Navbar.Item>
          <Navbar.Item href="/likes">Likes</Navbar.Item>
          <Navbar.Item href="/list">Shopping List</Navbar.Item>
          {user.googleId ? 
            <Navbar.Item href='' onClick={logout}>Log out</Navbar.Item>
          :
            <Navbar.Item href="/login">Login</Navbar.Item>
          }
        
          <Navbar.Item href="/admin">Admin</Navbar.Item>
          <Navbar.Item target="_blank" href="/api-docs/">Documentation</Navbar.Item>
        </Navbar.Container>
      </Navbar.Menu>
      </Navbar>
  );
}
