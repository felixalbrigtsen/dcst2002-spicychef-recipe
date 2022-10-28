import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import NavBar from './components/NavBar';
import { Alerts } from './components/Alerts';
import { useLogin } from './hooks/Login';

import Home from './pages/Frontpage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RecipeList from './pages/RecipeListPage';
import RecipePage from './pages/RecipePage';
import IngredientPage from './pages/IngredientPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import LikePage from './pages/LikePage';
// import Footer from './components/Footer';


function App() {
  // Always resume session on page load
  const { getSessionUser } = useLogin();
  React.useEffect(() => {
    getSessionUser();
  }, []);

  return (
  <>
    <NavBar />
    <Alerts />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/ingredients" element={<IngredientPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/likes" element={<LikePage />} />
      </Routes>
    </Router>
    {/* <Footer /> */}
  </>
  );
}

export default App;
