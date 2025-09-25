// src/components/Wishlist/WishlistSidebar.jsx
import React, { useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const WishlistSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    wishlistItems, 
    wishlistCount, 
    isModalOpen, 
    closeWishlistModal, 
    removeFromWishlist,
    loading 
  } = useWishlist();

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27 && isModalOpen) {
        closeWishlistModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, closeWishlistModal]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleViewProduct = (productId) => {
    closeWishlistModal();
    navigate(`/product/${productId}`);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeWishlistModal();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Sidebar Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-96 bg-white shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Items</h2>
          </div>
          <button
            onClick={closeWishlistModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Sign In</h3>
              <p className="text-sm text-gray-500 mb-4">You need to sign in to view your wishlist</p>
              <button
                onClick={() => {
                  closeWishlistModal();
                  navigate('/login');
                }}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-sm text-gray-500">Start adding products to see them here</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-4">
                {wishlistItems.map((product) => (
                  <div 
                    key={product._id} 
                    className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div 
                      className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden cursor-pointer flex-shrink-0"
                      onClick={() => handleViewProduct(product._id)}
                    >
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/64'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-medium text-gray-900 text-sm truncate cursor-pointer hover:text-orange-500 transition-colors"
                        onClick={() => handleViewProduct(product._id)}
                      >
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-1 mt-1">
                        {/* Star Rating */}
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className="w-3 h-3 text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-gray-900">
                          ${product.variants?.[0]?.price || 0}
                        </span>
                        <button
                          onClick={() => handleRemove(product._id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove from wishlist"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {wishlistItems.length > 0 && user && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-sm text-gray-500">
              {wishlistCount} item{wishlistCount !== 1 ? 's' : ''} in wishlist
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistSidebar;