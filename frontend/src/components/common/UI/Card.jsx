// src/components/common/UI/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  shadow = 'md',
  padding = 'p-4',
  rounded = 'rounded-lg',
  ...props 
}) => {
  const baseClasses = 'bg-white border border-gray-200';
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: 'shadow-none'
  };
  
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-300 cursor-pointer' : '';
  
  const classes = `${baseClasses} ${shadowClasses[shadow]} ${padding} ${rounded} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;