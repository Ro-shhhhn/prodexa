// src/components/Product/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  onAddToWishlist, 
  onViewDetails,
  emptyMessage = "No products found",
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg 
            className="mx-auto h-24 w-24 text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8v2a1 1 0 01-1 1H8a1 1 0 01-1-1V5" 
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No products available
          </h3>
          <p className="mt-1 text-gray-500">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onAddToWishlist={onAddToWishlist}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default ProductGrid;