import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/SignUp';
import Home from './components/Home';
import AllBooks from './components/AllBooks';
import MyBooks from './components/MyBooks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/my-books" element={<MyBooks />} />
      </Routes>
    </Router>
  );
}

export default App;
