// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import Home from './pages/Home';
import Login from './pages/SigninPage'; // Updated to match your file name
import Signup from './pages/SignupPage'; // Updated to match your file name
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
          <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;