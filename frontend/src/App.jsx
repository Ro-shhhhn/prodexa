// src/App.jsx  
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/SigninPage';
import Signup from './pages/SignupPage';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import WishlistModal from './components/Wishlist/WishlistModal';
import './App.css';

const AuthenticatedApp = () => {
  return (
    <WishlistProvider>
      <ProductProvider>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        
        {/* Wishlist Modal - Now inside WishlistProvider */}
        <WishlistModal />
      </ProductProvider>
    </WishlistProvider>
  );
};

function App() {
  useEffect(() => {
    document.title = 'Prodexa - Product Management';
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - No providers needed */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* All protected routes wrapped with providers */}
          <Route path="/*" element={<AuthenticatedApp />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;