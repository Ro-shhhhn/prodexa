// src/services/productService.js - COMPLETE UPDATED VERSION
import apiService from './api.js';

class ProductService {
  // Get all products with optional filters - FIXED
  async getAllProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query parameters
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      
      // FIXED: Handle multiple subcategories (plural)
      if (filters.subcategories) {
        queryParams.append('subcategories', filters.subcategories);
      }
      
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const endpoint = queryParams.toString() ? `/products?${queryParams}` : '/products';
      
      console.log('Fetching products from:', endpoint); // Debug log
      
      return await apiService.get(endpoint);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products');
    }
  }

  // Keep the original getProducts method for backward compatibility
  async getProducts(filters = {}) {
    return this.getAllProducts(filters);
  }

  // Get single product by ID
  async getProductById(productId) {
    try {
      // Validate productId before making the request
      if (!productId || productId === 'undefined' || productId === 'null') {
        throw new Error('Product ID is required and cannot be undefined');
      }
      
      return await apiService.get(`/products/${productId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product');
    }
  }

  // Create product with images (FormData for Cloudinary upload)
  async createProductWithImages(formData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create product');
    }
  }

  // DEPRECATED: Old create product method (kept for backward compatibility)
  async createProduct(productData) {
    try {
      // If productData is FormData, use the new method
      if (productData instanceof FormData) {
        return this.createProductWithImages(productData);
      }
      
      // Otherwise use the old JSON method (will fail if images are required)
      return await apiService.post('/products', productData);
    } catch (error) {
      throw new Error(error.message || 'Failed to create product');
    }
  }

  // Update product with images (FormData for new images)
  async updateProduct(productId, formData) {
    try {
      // Validate productId
      if (!productId || productId === 'undefined' || productId === 'null') {
        throw new Error('Product ID is required for update');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${productId}`, {
        method: 'PUT',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update product');
    }
  }

  // Legacy JSON update method (for backward compatibility when no images involved)
  async updateProductJSON(productId, productData) {
    try {
      // Validate productId
      if (!productId || productId === 'undefined' || productId === 'null') {
        throw new Error('Product ID is required for update');
      }

      return await apiService.put(`/products/${productId}`, productData);
    } catch (error) {
      throw new Error(error.message || 'Failed to update product');
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      // Validate productId
      if (!productId || productId === 'undefined' || productId === 'null') {
        throw new Error('Product ID is required for deletion');
      }

      return await apiService.delete(`/products/${productId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product');
    }
  }

  // Search products
  async searchProducts(searchTerm, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add search term
      if (searchTerm) queryParams.append('search', searchTerm);
      
      // Add additional filters
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.subcategories) queryParams.append('subcategories', filters.subcategories);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.page) queryParams.append('page', filters.page || 1);
      if (filters.limit) queryParams.append('limit', filters.limit || 10);

      const endpoint = `/products?${queryParams}`;
      return await apiService.get(endpoint);
    } catch (error) {
      throw new Error(error.message || 'Failed to search products');
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      return await apiService.get('/products/featured');
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch featured products');
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('category', categoryId);
      
      // Add additional filters
      if (filters.subcategories) queryParams.append('subcategories', filters.subcategories);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.page) queryParams.append('page', filters.page || 1);
      if (filters.limit) queryParams.append('limit', filters.limit || 10);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const endpoint = `/products?${queryParams}`;
      return await apiService.get(endpoint);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products by category');
    }
  }

  // Get products by subcategories (multiple)
  async getProductsBySubCategories(subcategoryIds, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Handle multiple subcategory IDs
      const subcategoriesString = Array.isArray(subcategoryIds) 
        ? subcategoryIds.join(',') 
        : subcategoryIds;
      
      queryParams.append('subcategories', subcategoriesString);
      
      // Add additional filters
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.page) queryParams.append('page', filters.page || 1);
      if (filters.limit) queryParams.append('limit', filters.limit || 10);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const endpoint = `/products?${queryParams}`;
      return await apiService.get(endpoint);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products by subcategories');
    }
  }

  // Upload product image to Cloudinary (helper method)
  async uploadProductImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/product-image`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to upload image');
    }
  }

  // Bulk operations (if needed)
  async bulkDeleteProducts(productIds) {
    try {
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        throw new Error('Product IDs array is required');
      }

      return await apiService.post('/products/bulk-delete', { productIds });
    } catch (error) {
      throw new Error(error.message || 'Failed to delete products');
    }
  }

  // Get product statistics (for dashboard/analytics)
  async getProductStats() {
    try {
      return await apiService.get('/products/stats');
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product statistics');
    }
  }
}

export default new ProductService();