// src/components/Product/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/UI/Card';
import StarRating from '../common/UI/StarRating';

const ProductCard = ({ product, onViewDetails }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  useEffect(() => {
    if (user) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [product._id, isInWishlist, user]);

  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const price = firstVariant ? firstVariant.price : product.price || 529.99;
  const ram = firstVariant ? firstVariant.ram : product.ram || '8GB';

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'error' ? 'bg-red-500' : 'bg-orange-500'
    } text-white`;
    
    toast.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <div>
          <div class="font-medium">Login Required</div>
          <div class="text-sm opacity-90">${message}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      showToast('Please login to add items to wishlist');
      // Navigate to login after showing message
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    try {
      if (isWishlisted) {
        const success = await removeFromWishlist(product._id);
        if (success) {
          setIsWishlisted(false);
        }
      } else {
        const success = await addToWishlist(product);
        if (success) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      showToast('Failed to update wishlist. Please try again.', 'error');
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
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
          user && isWishlisted 
            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
            : !user
            ? 'bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-500'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
        }`}
        title={
          !user 
            ? "Login to add to wishlist" 
            : isWishlisted 
            ? "Remove from wishlist" 
            : "Add to wishlist"
        }
      >
        <svg 
          className="h-5 w-5" 
          fill={user && isWishlisted ? "currentColor" : "none"}
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

        {ram && (
          <div className="text-sm text-gray-600">
            RAM: {ram}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <StarRating rating={product.rating || 0} size="w-4 h-4" />
          <span className="text-sm text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>

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

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 rounded-lg"></div>
    </Card>
  );
};

export default ProductCard;