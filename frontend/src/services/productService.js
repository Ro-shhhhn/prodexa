// src/services/productService.js
import apiService from './api.js';

class ProductService {
  // Get all products with optional filters
  async getProducts(filters = {}) {
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

  // Get single product by ID
  async getProductById(productId) {
    try {
      return await apiService.get(`/products/${productId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product');
    }
  }

  // Create new product
  async createProduct(productData) {
    try {
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

  // Search products by name
  async searchProducts(searchTerm, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('search', searchTerm);
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.subcategory) queryParams.append('subcategory', filters.subcategory);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      return await apiService.get(`/products/search?${queryParams}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to search products');
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const endpoint = queryParams.toString() 
        ? `/products/category/${categoryId}?${queryParams}`
        : `/products/category/${categoryId}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products by category');
    }
  }

  // Get products by subcategory
  async getProductsBySubCategory(subCategoryId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const endpoint = queryParams.toString() 
        ? `/products/subcategory/${subCategoryId}?${queryParams}`
        : `/products/subcategory/${subCategoryId}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products by subcategory');
    }
  }

  // Upload product images
  async uploadProductImages(productId, imageFiles) {
    try {
      const formData = new FormData();
      
      if (Array.isArray(imageFiles)) {
        imageFiles.forEach((file, index) => {
          formData.append('images', file);
        });
      } else {
        formData.append('images', imageFiles);
      }

      const response = await fetch(`${apiService.baseURL}/products/${productId}/images`, {
        method: 'POST',
        headers: {
          ...apiService.getAuthHeaders(),
          // Remove Content-Type to let browser set it with boundary for FormData
          'Content-Type': undefined,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload images');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload product images');
    }
  }

  // Add product variant
  async addProductVariant(productId, variantData) {
    try {
      return await apiService.post(`/products/${productId}/variants`, variantData);
    } catch (error) {
      throw new Error(error.message || 'Failed to add product variant');
    }
  }

  // Update product variant
  async updateProductVariant(productId, variantId, variantData) {
    try {
      return await apiService.put(`/products/${productId}/variants/${variantId}`, variantData);
    } catch (error) {
      throw new Error(error.message || 'Failed to update product variant');
    }
  }

  // Delete product variant
  async deleteProductVariant(productId, variantId) {
    try {
      return await apiService.delete(`/products/${productId}/variants/${variantId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product variant');
    }
  }

  // Get product variants
  async getProductVariants(productId) {
    try {
      return await apiService.get(`/products/${productId}/variants`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product variants');
    }
  }

  // Filter products by price range
  async filterProductsByPrice(minPrice, maxPrice, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('minPrice', minPrice);
      queryParams.append('maxPrice', maxPrice);
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.subcategory) queryParams.append('subcategory', filters.subcategory);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      return await apiService.get(`/products/filter/price?${queryParams}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to filter products by price');
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    try {
      return await apiService.get(`/products/featured?limit=${limit}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch featured products');
    }
  }

  // Toggle product featured status
  async toggleFeaturedStatus(productId) {
    try {
      return await apiService.put(`/products/${productId}/featured`);
    } catch (error) {
      throw new Error(error.message || 'Failed to toggle featured status');
    }
  }
}

export default new ProductService();