// src/services/categoryService.js
import apiService from './api.js';

class CategoryService {
  // Get all categories
  async getCategories() {
    try {
      return await apiService.get('/categories');
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch categories');
    }
  }

  // Get single category by ID
  async getCategoryById(categoryId) {
    try {
      return await apiService.get(`/categories/${categoryId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch category');
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
      return await apiService.post('/categories', categoryData);
    } catch (error) {
      throw new Error(error.message || 'Failed to create category');
    }
  }

  // Update category
  async updateCategory(categoryId, categoryData) {
    try {
      return await apiService.put(`/categories/${categoryId}`, categoryData);
    } catch (error) {
      throw new Error(error.message || 'Failed to update category');
    }
  }

  // Delete category
  async deleteCategory(categoryId) {
    try {
      return await apiService.delete(`/categories/${categoryId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to delete category');
    }
  }

  // Get subcategories for a specific category
  async getSubCategories(categoryId) {
    try {
      return await apiService.get(`/categories/${categoryId}/subcategories`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch subcategories');
    }
  }

  // Get all subcategories
  async getAllSubCategories() {
    try {
      return await apiService.get('/categories/subcategories/all');
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch all subcategories');
    }
  }

  // FIXED: Create new subcategory - now matches backend route
  async createSubCategory(subCategoryData) {
    try {
      return await apiService.post('/categories/subcategories', subCategoryData);
    } catch (error) {
      throw new Error(error.message || 'Failed to create subcategory');
    }
  }

  // Update subcategory
  async updateSubCategory(categoryId, subCategoryId, subCategoryData) {
    try {
      return await apiService.put(`/categories/${categoryId}/subcategories/${subCategoryId}`, subCategoryData);
    } catch (error) {
      throw new Error(error.message || 'Failed to update subcategory');
    }
  }

  // Delete subcategory
  async deleteSubCategory(categoryId, subCategoryId) {
    try {
      return await apiService.delete(`/categories/${categoryId}/subcategories/${subCategoryId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to delete subcategory');
    }
  }

  // Get subcategory by ID
  async getSubCategoryById(categoryId, subCategoryId) {
    try {
      return await apiService.get(`/categories/${categoryId}/subcategories/${subCategoryId}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch subcategory');
    }
  }
}

export default new CategoryService();