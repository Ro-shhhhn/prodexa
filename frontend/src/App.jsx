import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;