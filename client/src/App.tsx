import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import userService from './services/user-service';
import type { User } from './models/User';

import NavBar from './components/NavBar';
import { Alerts, useAlert } from './components/Alerts';

import Home from './pages/Frontpage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RecipeList from './pages/RecipeListPage';
import RecipePage from './pages/RecipePage';
import IngredientPage from './pages/IngredientPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import LikePage from './pages/LikePage';
// import Footer from './components/Footer';

const globalState = {
  user: {} as User,
  setUser: (user: User) => {
    globalState.user = user;
  },
};

export const globalStateContext = React.createContext(globalState);

function App() {
  const setUser = React.useContext(globalStateContext).setUser;
  const { appendAlert } = useAlert();
  // Fetch the current user in the active session
  React.useEffect(() => {
    userService.getSessionUser()
      .then((user) => {
        if (user) {
          setUser(user);
          console.log('User is logged in as ' + user.email);
        } else {
          console.log('No user in session');
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }, [setUser]);

  return (
  <>
    <globalStateContext.Provider value={globalState}>
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
    </globalStateContext.Provider>
  </>
  );
}

export default App;
