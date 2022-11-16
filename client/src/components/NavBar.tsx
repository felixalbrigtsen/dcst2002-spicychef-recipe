import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Navbar, Image } from 'react-bulma-components';
import {useState} from 'react';
import { useLogin } from '../hooks/Login';

import Icon from '@mdi/react';
import { mdiAccountCircle, mdiLogout, mdiListBox, mdiHome, mdiMagnify, mdiThumbsUpDown, mdiCarrot } from '@mdi/js';
import { MdAdminPanelSettings } from 'react-icons/md';

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
        <Navbar.Container>
          <Navbar.Item href="/">
            <span className="icon-text">
              <Icon path={mdiHome} size={1} />
              <span>Home</span>
            </span>
          </Navbar.Item>
          <Navbar.Item href="/search">
            <span className="icon-text">
              <Icon path={mdiMagnify} size={1} />
              <span>Search</span>
            </span>
          </Navbar.Item>
          { user.googleId && 
            <Navbar.Item href="/likes">
              <span className="icon-text">
                <Icon path={mdiThumbsUpDown} size={1} />
                <span>My Likes</span>
              </span>
            </Navbar.Item>
          }
          { user.googleId &&
            <Navbar.Item href="/list">
              <span className="icon-text">
                <Icon path={mdiListBox} size={1} />
                <span>Shopping List</span>
              </span>
            </Navbar.Item>
          }
          <Navbar.Item href="/ingredients">
            <span className="icon-text">
              <Icon path={mdiCarrot} size={1} />
              <span>Ingredients</span>
            </span>
          </Navbar.Item>
          { user.isadmin && 
          <Navbar.Item href="/admin">
            <span className="icon-text">
              <span className='icon'><MdAdminPanelSettings size={64}/></span>
              <span>Admin</span>
            </span>
          </Navbar.Item>
          }
          </Navbar.Container>
          <Navbar.Container align='right'>
            { user.googleId ? 
              <Navbar.Item href='' onClick={logout}>
                <span className="icon-text">
                  <Icon path={mdiLogout} size={1} />
                  <span>Logout</span>
                </span>
              </Navbar.Item>
            :
              <Navbar.Item href="/login">
                <span className="icon-text">
                  <Icon path={mdiAccountCircle} size={1} />
                  <span>Login</span>
                </span>
              </Navbar.Item>
            }
        </Navbar.Container>
      </Navbar.Menu>
      </Navbar>
  );
}
