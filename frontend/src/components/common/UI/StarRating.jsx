// src/components/common/UI/StarRating.jsx
import React from 'react';

const StarRating = ({ rating = 0, maxRating = 5, size = 'w-4 h-4', readonly = true, onRatingChange }) => {
  const handleStarClick = (starIndex) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, index) => (
        <svg
          key={index}
          className={`${size} ${
            index < rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          } ${!readonly ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => handleStarClick(index)}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;