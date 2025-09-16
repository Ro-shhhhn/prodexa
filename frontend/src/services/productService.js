// src/services/productService.js - UPDATED WITH CLOUDINARY SUPPORT
import apiService from './api.js';

class ProductService {
  // Get all products with optional filters
  async getAllProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query parameters
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.subcategory) queryParams.append('subcategory', filters.subcategory);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const endpoint = queryParams.toString() ? `/products?${queryParams}` : '/products';
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
      return await apiService.get(`/products/${productId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product');
    }
  }

  // NEW: Create product with images (FormData for Cloudinary upload)
  async createProductWithImages(formData) {
    try {
      // Use fetch directly for FormData uploads
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

  // Update product
  async updateProduct(productId, productData) {
    try {
      return await apiService.put(`/products/${productId}`, productData);
    } catch (error) {
      throw new Error(error.message || 'Failed to update product');
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      return await apiService.delete(`/products/${productId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product');
    }
  }
}

export default new ProductService();