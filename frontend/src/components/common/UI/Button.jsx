// src/components/common/UI/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-200 disabled:bg-orange-300',
    secondary: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200 disabled:border-gray-200 disabled:text-gray-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-200 disabled:bg-red-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    medium: 'px-6 py-3 text-base rounded-full',
    lg: 'px-8 py-4 text-lg rounded-full'
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${(disabled || loading) ? 'opacity-50' : ''} 
        ${className}
      `}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;