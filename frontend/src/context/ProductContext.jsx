// src/context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [initialized, setInitialized] = useState(false); // Track if initial load is complete
  const [filters, setFilters] = useState({
    search: '',
    category: null,
    subcategory: null,
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    current: 1,
    totalPages: 0,
    total: 0,
    limit: 10
  });

  // Fetch products based on filters
  const fetchProducts = async (customFilters = {}, isInitialLoad = false) => {
    try {
      const filterParams = { ...filters, ...customFilters };
      
      // Only set loading for non-initial loads
      if (initialized && !isInitialLoad) {
        setLoading(true);
      }
      
      // Convert category/subcategory objects to IDs
      const params = {
        ...filterParams,
        category: filterParams.category?._id || filterParams.category,
        subcategory: filterParams.subcategory?._id || filterParams.subcategory
      };
      
      const response = await productService.getProducts(params);
      
      if (response.success) {
        // Update both products and pagination atomically
        const newProducts = response.data || [];
        const newPagination = response.pagination || {
          current: 1,
          totalPages: Math.ceil(newProducts.length / (params.limit || 10)),
          total: newProducts.length,
          limit: params.limit || 10
        };
        
        // Batch state updates to prevent flickering
        setProducts(newProducts);
        setPagination(newPagination);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // On error, handle gracefully
      if (isInitialLoad || !initialized) {
        setProducts([]);
        setPagination({
          current: 1,
          totalPages: 0,
          total: 0,
          limit: 10
        });
      }
    } finally {
      setLoading(false);
      if (isInitialLoad) {
        setInitialized(true);
      }
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
      setCategories([]);
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
      setSubcategories([]);
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
  const updateFilters = useCallback((newFilters) => {
    setFilters(currentFilters => {
      const updatedFilters = { ...currentFilters, ...newFilters, page: 1 };
      
      // Prevent unnecessary API calls if filters haven't actually changed
      if (JSON.stringify(updatedFilters) === JSON.stringify(currentFilters)) {
        return currentFilters;
      }
      
      // Call fetchProducts in the next tick to avoid stale closure
      setTimeout(() => {
        fetchProducts(updatedFilters);
      }, 0);
      
      return updatedFilters;
    });
  }, []);

  // Update page
  const updatePage = useCallback((page) => {
    setFilters(currentFilters => {
      // Prevent unnecessary API calls if page hasn't changed
      if (page === currentFilters.page) {
        return currentFilters;
      }
      
      const updatedFilters = { ...currentFilters, page };
      
      // Call fetchProducts in the next tick to avoid stale closure
      setTimeout(() => {
        fetchProducts(updatedFilters);
      }, 0);
      
      return updatedFilters;
    });
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Start all initial requests in parallel
        await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchProducts({}, true) // Pass true for initial load
        ]);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };

    // Only run once when component mounts
    if (!initialized) {
      initializeData();
    }
  }, []); // Empty dependency array - only run once on mount

  const value = {
    // State
    products,
    categories,
    subcategories,
    loading,
    initialized,
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