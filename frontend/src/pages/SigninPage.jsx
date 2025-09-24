// C:\prodexa\frontend\src\pages\SigninPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import Button from '../components/common/UI/Button';

const SigninPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const message = location.state?.message;

  useEffect(() => {
    document.title = 'Sign In - Prodexa';
    
    // Cleanup on unmount
    return () => {
      document.title = 'Prodexa - Product Management';
    };
  }, []);

  const handleLoginSuccess = (userData, token) => {
    login(userData, token);
    navigate('/'); // Redirect to home after successful login
  };

  return (
    <div className="fixed inset-0 flex">
      {/* Left Side - Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-orange-500 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600">Welcome back! Please sign in to continue</p>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <LoginForm onSuccess={handleLoginSuccess} setError={setError} />
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Welcome with Image */}
      <div 
        className="flex-1 relative flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/signup-bg.jpg')" }}
      >
        <div className="relative z-10 text-center text-white px-8 rounded-lg">
          <h1 className="text-5xl font-bold mb-4">Hello, Friend!</h1>
          <p className="text-xl mb-8 opacity-90">
            Enter your personal details<br />
            and start journey with us
          </p>
          <Link to="/signup">
            <Button variant="secondary" className="text-white">
              SIGN UP
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;