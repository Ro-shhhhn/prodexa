// C:\prodexa\frontend\src\pages\SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/Auth/SignupForm';
import Button from '../components/common/UI/Button';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSignupSuccess = (userData, token) => {
    // Auto-login after successful registration
    login(userData, token);
    navigate('/'); // Redirect to home
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden flex items-center justify-center">
        {/* Background geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-16 h-16 bg-blue-600 transform rotate-45 opacity-50"></div>
          <div className="absolute top-40 right-32 w-12 h-12 bg-blue-500 transform rotate-12 opacity-60"></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-blue-400 transform -rotate-12 opacity-40"></div>
          <div className="absolute bottom-20 right-20 w-14 h-14 bg-blue-600 transform rotate-45 opacity-50"></div>
          
          {/* Large background shapes */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full transform translate-y-48 -translate-x-48 opacity-20"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600 rounded-full transform -translate-y-36 translate-x-36 opacity-30"></div>
        </div>

        <div className="relative z-10 text-center text-white px-8">
          <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-xl mb-8 opacity-90">
            To keep connected with us please<br />
            login with your personal info
          </p>
          <Link to="/login">
            <Button variant="secondary">
              SIGN IN
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-orange-500 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <SignupForm onSuccess={handleSignupSuccess} setError={setError} />
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;