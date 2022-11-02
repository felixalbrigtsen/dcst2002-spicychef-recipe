import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useState } from 'react';

import RecipeCard from '../components/RecipeCard';
import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';

import { Columns, Box, Button } from 'react-bulma-components';
import { FaArrowCircleUp } from 'react-icons/fa';

function ScrollButton() {
  const [visible, setVisible] = useState(false)
  
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300){
      setVisible(true)
    } 
    else if (scrolled <= 300){
      setVisible(false)
    }
  };
  
  const scrollToTop = () =>{
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  window.addEventListener('scroll', toggleVisible);
  
  return (
     <FaArrowCircleUp 
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '90%',
        fontSize: '2.5rem',
        zIndex: 1,
        display: visible ? 'inline' : 'none'
      }} />
  );
}

export default function RecipeList() {
    let [ recipeList, setRecipeList ] = React.useState<Recipe[]>([]);

    React.useEffect(() => {
        recipeService.getRecipesShort()
        .then(data => {setRecipeList(data)});
    }, []);
    return (
        <>
          <Columns className="is-multiline is-centered" style={{marginTop: '2rem', marginLeft: 'auto', marginRight: 'auto'}}>
          {recipeList.map((recipe) => (
            <Columns.Column className='is-one-quarter' key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Columns.Column>
          ))}
          </Columns>
          <ScrollButton />
        </>
    );
}