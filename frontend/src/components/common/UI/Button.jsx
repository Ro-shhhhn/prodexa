import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full py-3 px-6 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-4';
  
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-200',
    secondary: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 focus:ring-white/20'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;