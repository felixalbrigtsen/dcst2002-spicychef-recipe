import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import RecipeCard from './components/RecipeCard';

function Home () {
    return (
        <>
            <h1>Home</h1>
            <RecipeCard />
        </>
    );
}

export default Home;
