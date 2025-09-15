// src/components/common/Header/SearchBar.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

const SearchBar = ({ 
  placeholder = "Search any things", 
  onSearch, 
  className = "",
  size = "md" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (onSearch) {
        onSearch(term);
      }
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`
            block w-full pl-10 pr-20 border border-gray-300 rounded-l-md
            focus:ring-orange-500 focus:border-orange-500 
            placeholder-gray-500 bg-white
            ${sizeClasses[size]}
            ${className}
          `}
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0">
          <button
            type="submit"
            className={`
              px-6 bg-orange-500 hover:bg-orange-600 
              text-white font-medium rounded-r-md
              transition-colors duration-200
              ${sizeClasses[size]}
            `}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;