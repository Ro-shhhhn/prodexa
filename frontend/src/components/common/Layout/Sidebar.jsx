// src/components/common/Layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';

const Sidebar = ({ onCategoryFilter, onSubCategoryFilter, selectedCategory, selectedSubCategory }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback mock data for development
      setCategories([
        {
          _id: '1',
          name: 'Laptop',
          subcategories: [
            { _id: '1a', name: 'Hp', categoryId: '1' },
            { _id: '1b', name: 'Dell', categoryId: '1' },
          ]
        },
        {
          _id: '2',
          name: 'Tablet',
          subcategories: [
            { _id: '2a', name: 'iPad', categoryId: '2' },
            { _id: '2b', name: 'Samsung', categoryId: '2' },
          ]
        },
        {
          _id: '3',
          name: 'Headphones',
          subcategories: [
            { _id: '3a', name: 'Wireless', categoryId: '3' },
            { _id: '3b', name: 'Wired', categoryId: '3' },
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (category) => {
    if (onCategoryFilter) {
      onCategoryFilter(category);
    }
    // Auto-expand when category is selected
    if (!expandedCategories.has(category._id)) {
      toggleCategory(category._id);
    }
  };

  const handleSubCategoryClick = (subCategory) => {
    if (onSubCategoryFilter) {
      onSubCategoryFilter(subCategory);
    }
  };

  const clearFilters = () => {
    if (onCategoryFilter) onCategoryFilter(null);
    if (onSubCategoryFilter) onSubCategoryFilter(null);
  };

  if (loading) {
    return (
      <div className="w-64 bg-white shadow-sm h-full p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white shadow-sm h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          {(selectedCategory || selectedSubCategory) && (
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => clearFilters()}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              !selectedCategory 
                ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All categories
          </button>

          {categories.map((category) => (
            <div key={category._id} className="space-y-1">
              <div className="flex items-center">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory?._id === category._id
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <button
                    onClick={() => toggleCategory(category._id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg 
                      className={`h-4 w-4 transform transition-transform ${
                        expandedCategories.has(category._id) ? 'rotate-90' : ''
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {expandedCategories.has(category._id) && category.subcategories && (
                <div className="ml-4 space-y-1">
                  {category.subcategories.map((subCategory) => (
                    <button
                      key={subCategory._id}
                      onClick={() => handleSubCategoryClick(subCategory)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedSubCategory?._id === subCategory._id
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subCategory.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;