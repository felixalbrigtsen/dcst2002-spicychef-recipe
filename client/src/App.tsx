import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

function Home () {
  return <h1>Home</h1>;
}

function SearchPage () {
  return <h1>Search</h1>;
}

function LoginPage () {
  return <h1>Login</h1>;
}

function App() {
  return (
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  </>
  );
}

export default App;
