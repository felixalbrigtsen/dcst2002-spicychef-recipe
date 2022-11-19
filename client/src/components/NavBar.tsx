import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Button, Navbar, Image } from "react-bulma-components";

import {
  MdAdminPanelSettings,
  MdAccountCircle,
  MdLogout,
  MdListAlt,
  MdHome,
  MdSearch,
  MdThumbsUpDown,
} from "react-icons/md";
import { FaCarrot } from "react-icons/fa";
import { useLogin } from "../hooks/Login";

export default function NavBar() {
  const [isActive, setIsActive] = useState(false);
  const { user, logout } = useLogin();

  const handleClick = () => {
    setIsActive((current) => !current);
  };

  return (
    <Navbar color="link">
      <style>{`.navbar-item img { max-height: none !important; }`}</style>

      <Navbar.Brand>
        <Navbar.Item
          renderAs="a"
          href="/"
        >
          <Image
            src="/logo.png"
            alt="SpicyChef Logo"
            size={32}
          />
        </Navbar.Item>
        <Navbar.Burger
          className={isActive ? "is-active" : ""}
          onClick={handleClick}
        />
      </Navbar.Brand>
      <Navbar.Menu
        id="navbar-example"
        className={isActive ? "is-active" : ""}
      >
        <Navbar.Container>
          <Navbar.Item href="/">
            <span className="icon-text">
              <span className="icon">
                <MdHome size={64} />
              </span>
              <span>Home</span>
            </span>
          </Navbar.Item>
          <Navbar.Item href="/search">
            <span className="icon-text">
              <span className="icon">
                <MdSearch size={64} />
              </span>
              <span>Search</span>
            </span>
          </Navbar.Item>
          {user.googleId && (
            <Navbar.Item href="/likes">
              <span className="icon-text">
                <span className="icon">
                  <MdThumbsUpDown size={64} />
                </span>
                <span>My Likes</span>
              </span>
            </Navbar.Item>
          )}
          {user.googleId && (
            <Navbar.Item href="/list">
              <span className="icon-text">
                <span className="icon">
                  <MdListAlt size={64} />
                </span>
                <span>Shopping List</span>
              </span>
            </Navbar.Item>
          )}
          <Navbar.Item href="/ingredients">
            <span className="icon-text">
              <span className="icon">
                <FaCarrot size={64} />
              </span>
              <span>Ingredients</span>
            </span>
          </Navbar.Item>
          {user.isadmin && (
            <Navbar.Item href="/admin">
              <span className="icon-text">
                <span className="icon">
                  <MdAdminPanelSettings size={64} />
                </span>
                <span>Admin</span>
              </span>
            </Navbar.Item>
          )}
        </Navbar.Container>
        <Navbar.Container align="right">
          {user.googleId ? (
            <Navbar.Item
              href=""
              onClick={logout}
            >
              <span className="icon-text">
                <span className="icon">
                  <MdLogout size={64} />
                </span>
                <span>Logout</span>
              </span>
            </Navbar.Item>
          ) : (
            <Navbar.Item href="/login">
              <span className="icon-text">
                <span className="icon">
                  <MdAccountCircle size={64} />
                </span>
                <span>Login</span>
              </span>
            </Navbar.Item>
          )}
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  );
}
