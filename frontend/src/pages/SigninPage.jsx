import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import Button from '../components/common/UI/Button';

const SigninPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome */}
      <div className="flex-1 bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative overflow-hidden flex items-center justify-center">
        {/* Background geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-16 h-16 bg-green-600 transform rotate-45 opacity-50"></div>
          <div className="absolute top-40 right-32 w-12 h-12 bg-green-500 transform rotate-12 opacity-60"></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-green-400 transform -rotate-12 opacity-40"></div>
          <div className="absolute bottom-20 right-20 w-14 h-14 bg-green-600 transform rotate-45 opacity-50"></div>
          
          {/* Large background shapes */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-700 rounded-full transform translate-y-48 -translate-x-48 opacity-20"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-600 rounded-full transform -translate-y-36 translate-x-36 opacity-30"></div>
        </div>

        <div className="relative z-10 text-center text-white px-8">
          <h1 className="text-5xl font-bold mb-4">Hello, Friend!</h1>
          <p className="text-xl mb-8 opacity-90">
            Enter your personal details<br />
            and start journey with us
          </p>
          <Link to="/signup">
            <Button variant="secondary">
              SIGN UP
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Side - Form */}
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

          <LoginForm onSuccess={handleLoginSuccess} />
          
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
    </div>
  );
};

export default SigninPage;