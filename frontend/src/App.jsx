import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
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
      <WishlistProvider>
        <ProductProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Global Wishlist Modal */}
              <WishlistModal />
            </div>
          </Router>
        </ProductProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;