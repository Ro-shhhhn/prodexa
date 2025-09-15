// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout/Layout';
import Button from '../components/common/UI/Button';
import StarRating from '../components/common/UI/StarRating';
import productService from '../services/productService';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      // Use mock data if no productId (for development)
      setProduct(getMockProduct());
      setSelectedVariant(getMockProduct().variants[0]);
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(productId);
      
      if (response.success) {
        setProduct(response.data);
        setSelectedVariant(response.data.variants?.[0] || null);
      } else {
        throw new Error(response.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError(error.message);
      // Fallback to mock data
      const mockProduct = getMockProduct();
      setProduct(mockProduct);
      setSelectedVariant(mockProduct.variants[0]);
    } finally {
      setLoading(false);
    }
  };

  const getMockProduct = () => ({
    _id: 'hp-amd-ryzen-3',
    name: 'HP AMD Ryzen 3',
    description: 'The Ryzen 7 is a more high-end processor that compares to the Intel Core i7 series. It offers excellent performance for gaming, content creation, and multitasking.',
    price: 529.99,
    originalPrice: 599.99,
    rating: 4.2,
    reviewCount: 128,
    images: [
      'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=HP+AMD+Ryzen+3+Main',
      'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=HP+AMD+Ryzen+3+Side',
      'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=HP+AMD+Ryzen+3+Back'
    ],
    variants: [
      { _id: '1', ram: '4 GB', price: 429.99, quantity: 25 },
      { _id: '2', ram: '8 GB', price: 529.99, quantity: 34 },
      { _id: '3', ram: '16 GB', price: 629.99, quantity: 15 }
    ],
    category: { name: 'Laptops' },
    subcategory: { name: 'HP' },
    inStock: true
  });

  // Event handlers
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxQuantity = selectedVariant?.quantity || 1;
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    // TODO: Implement wishlist API call
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log('Buy now:', { product, variant: selectedVariant, quantity });
  };

  const handleEditProduct = () => {
    // TODO: Open edit product modal or navigate to edit page
    console.log('Edit product:', product._id);
  };

  if (loading) {
    return (
      <Layout showSidebar={false}>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  if (error && !product) {
    return (
      <Layout showSidebar={false}>
        <div className="text-center py-16">
          <div className="text-red-600 text-lg mb-4">Failed to load product</div>
          <Button onClick={() => navigate(-1)} variant="primary" className="w-auto">
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const maxQuantity = selectedVariant?.quantity || 1;
  const inStock = maxQuantity > 0;

  return (
    <Layout showSidebar={false}>
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/dashboard')} className="hover:text-gray-700">
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
            <div className="relative h-full">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              )}
              <img
                src={product.images?.[selectedImageIndex] || product.images?.[0]}
                alt={product.name}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=Product+Image";
                  setImageLoaded(true);
                }}
              />
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-4">
              {product.images.slice(0, 3).map((image, index) => (
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
              
              {/* Add Image Placeholder */}
              <div className="bg-gray-100 rounded-xl p-4 w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Product Info */}
        <div className="space-y-6">
          {/* Product Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">
                ${currentPrice?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
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
          {inStock && maxQuantity <= 50 && (
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
                  {variant.ram}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">Quantity:</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="w-12 text-center font-medium">{quantity}</span>
              
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleEditProduct}
              variant="primary"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full"
            >
              Edit product
            </Button>
            
            <Button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy it now
            </Button>
            
            <button
              onClick={handleAddToWishlist}
              className={`p-3 rounded-full border transition-colors ${
                isInWishlist
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300'
              }`}
            >
              <svg className="w-6 h-6" fill={isInWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
    </Layout>
  );
};

export default ProductDetails;