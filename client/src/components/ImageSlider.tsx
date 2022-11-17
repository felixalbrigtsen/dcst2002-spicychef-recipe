import * as React from "react";
import { useState, useEffect } from "react";

import recipeService from "../services/recipe-service";
import { Recipe } from "../models/Recipe";
import { Columns } from "react-bulma-components";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

interface ImageSliderProps {
  slides: Recipe[];
}

const ImageSlider = (props: ImageSliderProps) => {
  const [current, setCurrent] = useState(0);

  const goToNext = () => {
    const isLastSlide = current === props.slides.length - 1;
    const newIndex = isLastSlide ? 0 : current + 1;
    setCurrent(newIndex);
  };

  // TODO: Give this a better/smoother transition

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <>
      {props.slides.map((slide, index) => {
        return (
          <div
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            {index === current && (
              <a href={`/recipes/${slide.id}`}>
                <img
                  src={slide && slide.imageUrl ? slide.imageUrl : "placeholder"}
                  alt="recipe"
                  className="image"
                />
              </a>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ImageSlider;
