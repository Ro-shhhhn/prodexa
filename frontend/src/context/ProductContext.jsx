// src/context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: null,
    subcategory: null,
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    current: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  // Fetch products based on filters
  const fetchProducts = async (customFilters = {}) => {
    try {
      setLoading(true);
      const filterParams = { ...filters, ...customFilters };
      
      // Convert category/subcategory objects to IDs
      const params = {
        ...filterParams,
        category: filterParams.category?._id || filterParams.category,
        subcategory: filterParams.subcategory?._id || filterParams.subcategory
      };
      
      const response = await productService.getProducts(params);
      
      if (response.success) {
        setProducts(response.data || []);
        setPagination(response.pagination || pagination);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Keep existing products on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async (categoryId = null) => {
    try {
      const response = categoryId 
        ? await categoryService.getSubCategories(categoryId)
        : await categoryService.getAllSubCategories();
      
      if (response.success) {
        setSubcategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

  // Add new product
  const addProduct = async (productData) => {
    try {
      const response = await productService.createProduct(productData);
      if (response.success) {
        // Refresh products to show new product
        await fetchProducts();
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  };

  // Add new category
  const addCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      if (response.success) {
        setCategories(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  };

  // Add new subcategory
  const addSubCategory = async (categoryId, subcategoryData) => {
    try {
      const response = await categoryService.createSubCategory(categoryId, subcategoryData);
      if (response.success) {
        setSubcategories(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  // Update page
  const updatePage = (page) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
  }, []);

  const value = {
    // State
    products,
    categories,
    subcategories,
    loading,
    filters,
    pagination,
    
    // Actions
    fetchProducts,
    fetchCategories,
    fetchSubcategories,
    addProduct,
    addCategory,
    addSubCategory,
    updateFilters,
    updatePage
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};