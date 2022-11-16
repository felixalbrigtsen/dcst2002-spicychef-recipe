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
import IngredientsPage from './pages/IngredientsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import LikePage from './pages/LikePage';
import AdminPage from './pages/AdminPage';
import CreateRecipe from './pages/CreateRecipePage';
import EditRecipe from './pages/EditRecipePage';
import PageNotFound from './pages/PageNotFound';
import ImportPage from './pages/ImportPage';
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
        <Route path="/search/" element={<SearchPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/list" element={<ShoppingListPage />} />
        <Route path="/likes" element={<LikePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/edit/:id" element={<EditRecipe />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
    <style>{` html { background-color: #f5f5f5; } `}</style>
    {/* <Footer /> */}
  </>
  );
}

export default App;
