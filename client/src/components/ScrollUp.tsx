import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useState } from "react";
import { Button } from "react-bulma-components";

import { FaArrowCircleUp } from "react-icons/fa";

function ScrollButton() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* You can also use 'auto' behaviour
           in place of 'smooth' */
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <Button
      aria-label={"scrollUp"}
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "-1rem",
        fontSize: "2rem",
        zIndex: 1,
        display: visible ? "inline" : "none",
      }}
      className="is-ghost is-small"
    >
      <span className="icon is-small">
        <FaArrowCircleUp style={{ fontSize: "2rem" }} />
      </span>
    </Button>
  );
}

export default ScrollButton;
