// src/pages/ProductDetails.jsx - Enhanced with Better Error Handling and Wishlist
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

  // Wishlist and Auth
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    console.log('ProductDetails - ID from URL:', id); // Debug log
    fetchProduct();
  }, [id]);

  // Check wishlist status when product loads
  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [product, isInWishlist]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching product with ID:', id); // Debug log
      
      const response = await productService.getProductById(id);
      
      console.log('Product fetch response:', response); // Debug log
      
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

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxQuantity = selectedVariant?.quantity || 1;
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleEditSuccess = (updatedProduct) => {
    setProduct(updatedProduct);
    setShowEditModal(false);
  };

  // Wishlist toggle handler
  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        const success = await removeFromWishlist(product._id);
        if (success) setIsWishlisted(false);
      } else {
        const success = await addToWishlist(product);
        if (success) setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
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

  const currentPrice = selectedVariant?.price || product.variants[0]?.price;
  const maxQuantity = selectedVariant?.quantity || 1;
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
          <div className="bg-gray-100 rounded-2xl p-8 aspect-square">
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">
                ${currentPrice?.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500">Product ID: {product._id}</p>
          </div>

          {/* Category & Subcategory */}
          <div className="text-sm text-gray-600">
            <span>Category: </span>
            <span className="font-medium">{product.category?.name || 'Unknown'}</span>
            <span className="mx-2">|</span>
            <span>Subcategory: </span>
            <span className="font-medium">{product.subcategory?.name || 'Unknown'}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Availability:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? 'In stock' : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Stock Alert */}
          {inStock && maxQuantity <= 10 && (
            <div className="text-orange-600 text-sm">
              Hurry up! only {maxQuantity} product left in stock!
            </div>
          )}

          {/* RAM Variants */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">Ram:</label>
            <div className="flex space-x-3">
              {product.variants?.map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => handleVariantSelect(variant)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedVariant?._id === variant._id
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {variant.ram} - ${variant.price}
                </button>
              ))}
            </div>
            {selectedVariant && (
              <div className="mt-2 text-sm text-gray-600">
                Stock: {selectedVariant.quantity} units
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">Quantity:</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowEditModal(true)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full"
            >
              Edit product
            </Button>
            
            <Button
              disabled={!inStock}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full disabled:opacity-50"
            >
              Buy it now
            </Button>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full border transition-colors ${
                isWishlisted 
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg 
                className="h-6 w-6" 
                fill={isWishlisted ? "currentColor" : "none"}
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
            <div className="bg-gray-50 rounded-lg p-4">
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
    </Layout>
  );
};

export default ProductDetails;