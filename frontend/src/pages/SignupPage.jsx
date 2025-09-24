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
    <div className="fixed inset-0 flex">
      {/* Left Side - Welcome */}
      <div 
        className="flex-1 relative flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/signup-bg.jpg')" }}
      >
        <div className="relative z-10 text-center text-white px-8  rounded-lg">
          <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-xl mb-8 opacity-90">
            To keep connected with us please<br />
            login with your personal info
          </p>
          <Link to="/login">
  <Button variant="secondary" className="text-white">
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