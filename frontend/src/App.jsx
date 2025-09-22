import React from 'react';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Only Login and Signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - Everything else */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WishlistProvider>
                  <ProductProvider>
                    <Home />
                  </ProductProvider>
                </WishlistProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WishlistProvider>
                  <ProductProvider>
                    <Home />
                  </ProductProvider>
                </WishlistProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <WishlistProvider>
                  <ProductProvider>
                    <ProductDetails />
                  </ProductProvider>
                </WishlistProvider>
              </ProtectedRoute>
            }
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Global Wishlist Modal - Only for authenticated users */}
        <WishlistProvider>
          <WishlistModal />
        </WishlistProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;