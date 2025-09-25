// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout/Layout';
import Button from '../components/common/UI/Button';
import Modal from '../components/common/UI/Modal';
import productService from '../services/productService';
import EditProductForm from '../components/Product/EditProductForm';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // Wishlist and Auth
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    console.log('ProductDetails - ID from URL:', id);
    fetchProduct();
  }, [id]);

  // Check wishlist status when product loads
  useEffect(() => {
    if (product && user) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [product, isInWishlist, user]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching product with ID:', id);
      
      const response = await productService.getProductById(id);
      
      console.log('Product fetch response:', response);
      
      if (response.success) {
        setProduct(response.data);
        setSelectedVariant(response.data.variants?.[0] || null);
      } else {
        setError(response.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError(error.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-orange-500'
    } text-white`;
    
    toast.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <div>
          <div class="font-medium">${type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Login Required'}</div>
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

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    // Only set quantity to 1 if the variant has stock
    setQuantity(variant.quantity > 0 ? 1 : 0);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxQuantity = selectedVariant?.quantity ?? 0;
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleEditSuccess = (updatedProduct) => {
    setProduct(updatedProduct);
    setShowEditModal(false);
  };

  const handleBuyNow = () => {
    setShowComingSoonModal(true);
  };

  // Wishlist toggle handler
  const handleWishlistToggle = async () => {
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
          showToast('Removed from wishlist', 'success');
        }
      } else {
        const success = await addToWishlist(product);
        if (success) {
          setIsWishlisted(true);
          showToast('Added to wishlist', 'success');
        }
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      showToast('Failed to update wishlist. Please try again.', 'error');
    }
  };

  // Coming Soon Modal Component
  const ComingSoonModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center transform transition-all">
          {/* Animated Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Coming Soon!
          </h3>
          <p className="text-gray-600 mb-2">
            We're working hard to bring you the best shopping experience.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The checkout feature will be available soon. Stay tuned!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleWishlistToggle}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
            >
              {isWishlisted ? 'Already in Wishlist ❤️' : 'Add to Wishlist ❤️'}
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout showSidebar={false}>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
            <p className="text-sm text-gray-400 mt-2">Product ID: {id}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showSidebar={false}>
        <div className="text-center py-16">
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-2">{error}</p>
            <p className="text-sm text-gray-400">Product ID: {id}</p>
          </div>
          <div className="space-y-3">
            <Button onClick={() => fetchProduct()} variant="outline">
              Try Again
            </Button>
            <br />
            <Button onClick={() => navigate('/')} variant="primary">
              Go Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout showSidebar={false}>
        <div className="text-center py-16">
          <div className="text-gray-600 text-lg mb-4">Product not found</div>
          <Button onClick={() => navigate('/')} variant="primary">
            Go Home
          </Button>
        </div>
      </Layout>
    );
  }

  const currentPrice = selectedVariant?.price ?? product.variants[0]?.price;
  const maxQuantity = selectedVariant?.quantity ?? 0;
  const inStock = maxQuantity > 0;

  return (
    <Layout showSidebar={false}>
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-gray-700">
          Home
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Product details</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-white rounded-2xl p-8 aspect-square">
            <img
              src={product.images?.[selectedImageIndex] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=Product+Image";
              }}
            />
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`bg-gray-100 rounded-xl p-4 w-24 h-24 border-2 transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-orange-500' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100x100/f3f4f6/9ca3af?text=Img";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Product Info */}
        <div className="space-y-6">
          {/* Product Title */}
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              {product.name || 'HP AMD Ryzen 3'}
            </h1>
            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">
                ${currentPrice?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Availability:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </div>

            {inStock && maxQuantity <= 50 && (
              <div className="text-gray-600 text-sm">
                Hurry up! only {maxQuantity} product left in stock!
              </div>
            )}
          </div>

          {/* RAM Variants */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">Ram:</label>
            <div className="flex space-x-3">
              {product.variants?.map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => handleVariantSelect(variant)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedVariant?._id === variant._id
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {variant.ram}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">Quantity :</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
              >
                -
              </button>
              <span className="w-12 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors"
            >
              Edit product
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium disabled:opacity-50 transition-colors"
            >
              Buy it now
            </button>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full border transition-colors ${
                user && isWishlisted 
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                  : !user
                  ? 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
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
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
        size="lg"
      >
        <EditProductForm
          product={product}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
      />
    </Layout>
  );
};

export default ProductDetails;