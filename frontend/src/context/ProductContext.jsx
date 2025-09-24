// src/context/ProductContext.jsx - FIXED VERSION
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
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
 const [filters, setFilters] = useState({
  search: '',
  category: null,
  subcategories: [], // Changed from subcategory to subcategories array
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
// Update the fetchProducts function to handle multiple subcategories
// In ProductContext.jsx - Update the fetchProducts function
// In ProductContext.jsx - Update the fetchProducts function
const fetchProducts = async (customFilters = {}, isInitialLoad = false) => {
  try {
    const filterParams = { ...filters, ...customFilters };
    
    if (initialized && !isInitialLoad) {
      setLoading(true);
    }
    
    // Build the params object
    const params = {
      page: filterParams.page || 1,
      limit: filterParams.limit || 10,
      search: filterParams.search || '',
      category: filterParams.category?._id || filterParams.category || '',
      // Handle multiple subcategories - join IDs with comma
      subcategories: Array.isArray(filterParams.subcategories) 
        ? filterParams.subcategories.map(sub => sub._id || sub).filter(Boolean).join(',')
        : ''
    };

    // Remove empty parameters
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });

    console.log('Fetching products with params:', params);
    
    const response = await productService.getProducts(params);
    
    if (response.success) {
      const newProducts = response.data || [];
      const newPagination = response.pagination || {
        current: 1,
        totalPages: Math.ceil(newProducts.length / (params.limit || 10)),
        total: newProducts.length,
        limit: params.limit || 10
      };
      
      setProducts(newProducts);
      setPagination(newPagination);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
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

  // FIXED: Add new product - no duplicates
  const addProduct = async (productData) => {
    try {
      const response = await productService.createProduct(productData);
      if (response.success) {
        // Instead of refreshing all products, just add the new one to the current list
        // This prevents the duplicate issue
        setProducts(prevProducts => [response.data, ...prevProducts]);
        
        // Update pagination total count
        setPagination(prev => ({
          ...prev,
          total: prev.total + 1,
          totalPages: Math.ceil((prev.total + 1) / prev.limit)
        }));
        
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  };

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

  // FIXED: Add new subcategory - corrected method signature
  const addSubCategory = async (subcategoryData) => {
    try {
      // The subcategoryData should include the categoryId
      const response = await categoryService.createSubCategory(subcategoryData.category, subcategoryData);
      if (response.success) {
        setSubcategories(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  };

  const updateFilters = useCallback((newFilters) => {
    setFilters(currentFilters => {
      const updatedFilters = { ...currentFilters, ...newFilters, page: 1 };
      
      if (JSON.stringify(updatedFilters) === JSON.stringify(currentFilters)) {
        return currentFilters;
      }
      
      setTimeout(() => {
        fetchProducts(updatedFilters);
      }, 0);
      
      return updatedFilters;
    });
  }, []);

  const updatePage = useCallback((page) => {
    setFilters(currentFilters => {
      if (page === currentFilters.page) {
        return currentFilters;
      }
      
      const updatedFilters = { ...currentFilters, page };
      
      setTimeout(() => {
        fetchProducts(updatedFilters);
      }, 0);
      
      return updatedFilters;
    });
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchProducts({}, true)
        ]);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };

    if (!initialized) {
      initializeData();
    }
  }, []);

  const value = {
    products,
    categories,
    subcategories,
    loading,
    initialized,
    filters,
    pagination,
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