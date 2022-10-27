import React from 'react';
import { globalStateContext } from '../App';
import 'bulma/css/bulma.min.css';
import { Button, Navbar, Image } from 'react-bulma-components';
import {useState} from 'react';

export default function NavBar() {
  const [isActive, setIsActive] = useState(false);
  const user = React.useContext(globalStateContext).user;

  const handleClick = () => {
    setIsActive(current => !current);
  };

  return (
    <div>
        <style>{`
        .navbar-item img {
          max-height: none !important; 
        }`}</style>
        <Navbar color="link">
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
              <Navbar.Item href="/cart">Shopping Cart</Navbar.Item>
              {user ? 
                <Navbar.Item href={process.env.REACT_APP_API_URL+"/auth/logout"}>Log out</Navbar.Item>
              :
                <Navbar.Item href="/login">Login</Navbar.Item>
              }
            
              <Navbar.Item href="/admin">Admin</Navbar.Item>
              <Navbar.Item target="_blank" href="/api-docs/">Documentation</Navbar.Item>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
    </div>
  );
}
