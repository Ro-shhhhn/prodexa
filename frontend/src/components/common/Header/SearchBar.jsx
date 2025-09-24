// src/components/common/Header/SearchBar.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

const SearchBar = ({
  placeholder = "Search any things",
  onSearch,
  className = "",
  size = "md"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const onSearchRef = useRef(onSearch);

  // Update ref when onSearch changes
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Create stable debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (onSearchRef.current) {
        onSearchRef.current(term);
      }
    }, 300),
    [] // Empty dependency array - function never changes
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = useCallback(() => {
    setSearchTerm('');
    // Immediately trigger search with empty term
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex">
      <div className="relative flex-1">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className={`${iconSizes[size]} text-gray-400`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`
            block w-full pl-10 pr-10 border border-gray-300 rounded-l-md
            focus:ring-orange-500 focus:border-orange-500 
            placeholder-gray-500 bg-white
            transition-colors duration-200
            ${sizeClasses[size]}
            ${className}
          `}
          placeholder={placeholder}
          aria-label="Search input"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg 
              className={`${iconSizes[size]} text-gray-400 hover:text-gray-600`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className={`
          px-4 bg-orange-500 text-white rounded-r-md border border-orange-500
          hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
          transition-colors duration-200
          ${sizeClasses[size]}
        `}
        aria-label="Submit search"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;