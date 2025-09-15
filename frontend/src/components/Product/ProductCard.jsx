// src/components/Product/ProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/UI/Card';
import StarRating from '../common/UI/StarRating';

const ProductCard = ({ product, onAddToWishlist, onViewDetails }) => {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get the first variant or default values
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const price = firstVariant ? firstVariant.price : product.price || 529.99;
  const ram = firstVariant ? firstVariant.ram : product.ram || '8GB';

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    try {
      setIsInWishlist(!isInWishlist);
      if (onAddToWishlist) {
        await onAddToWishlist(product);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      setIsInWishlist(!isInWishlist); // Revert on error
    }
  };

  const handleCardClick = () => {
    // Navigate to product details page with product ID
    navigate(`/product/${product._id}`);
    
    // Also call the onViewDetails callback if provided (for additional functionality)
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <Card 
      className="relative group cursor-pointer" 
      hover={true}
      onClick={handleCardClick}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
          isInWishlist 
            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
        }`}
      >
        <svg 
          className="h-5 w-5" 
          fill={isInWishlist ? "currentColor" : "none"}
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>

      {/* Product Image */}
      <div className="aspect-w-16 aspect-h-12 mb-4">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}
          <img
            src={product.images && product.images.length > 0 
              ? product.images[0] 
              : "https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Product+Image"
            }
            alt={product.name || 'Product'}
            className={`w-full h-48 object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=No+Image";
              setImageLoaded(true);
            }}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 line-clamp-2">
          {product.name || 'HP AMD Ryzen 3'}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-lg font-semibold text-gray-900">
            ${price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* RAM Info if available */}
        {ram && (
          <div className="text-sm text-gray-600">
            RAM: {ram}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <StarRating rating={product.rating || 0} size="w-4 h-4" />
          <span className="text-sm text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <span className={`text-sm ${
            (firstVariant?.quantity || product.quantity || 0) > 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {(firstVariant?.quantity || product.quantity || 0) > 0 
              ? 'In Stock' 
              : 'Out of Stock'}
          </span>
          
          {product.variants && product.variants.length > 1 && (
            <span className="text-sm text-gray-500">
              {product.variants.length} variants
            </span>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 rounded-lg"></div>
    </Card>
  );
};

export default ProductCard;