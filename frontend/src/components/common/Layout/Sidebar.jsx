// src/components/common/Layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';

const Sidebar = ({ onCategoryFilter, onSubCategoryFilter, selectedCategory, selectedSubCategories = [] }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedSubs, setSelectedSubs] = useState(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Sync with parent's selected subcategories
    if (selectedSubCategories && Array.isArray(selectedSubCategories)) {
      setSelectedSubs(new Set(selectedSubCategories.map(sub => sub._id)));
    }
  }, [selectedSubCategories]);

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

  const handleSubCategoryToggle = (subCategory) => {
    const newSelected = new Set(selectedSubs);
    
    if (newSelected.has(subCategory._id)) {
      newSelected.delete(subCategory._id);
    } else {
      newSelected.add(subCategory._id);
    }
    
    setSelectedSubs(newSelected);
    
    // Pass array of selected subcategories to parent
    if (onSubCategoryFilter) {
      const selectedSubCategoriesArray = Array.from(newSelected).map(id => {
        // Find the full subcategory object
        for (let cat of categories) {
          const sub = cat.subcategories?.find(s => s._id === id);
          if (sub) return sub;
        }
        return null;
      }).filter(Boolean);
      
      onSubCategoryFilter(selectedSubCategoriesArray);
    }
  };

  const clearFilters = () => {
    if (onCategoryFilter) onCategoryFilter(null);
    if (onSubCategoryFilter) onSubCategoryFilter([]);
    setSelectedSubs(new Set());
  };

  if (loading) {
    return (
      <div className="w-full h-full p-4">
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

  // Get selected subcategory names for breadcrumb
  const getSelectedSubNames = () => {
    const names = [];
    selectedSubs.forEach(subId => {
      for (let cat of categories) {
        const sub = cat.subcategories?.find(s => s._id === subId);
        if (sub) names.push(sub.name);
      }
    });
    return names;
  };

  return (
    <div className="w-full h-full">
      <div className="p-4">
        <nav className="flex flex-wrap items-center text-sm text-gray-500 mb-4 pb-3 border-b">
          <span className="font-medium">Home</span>
          {selectedCategory && (
            <>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-700">{selectedCategory.name}</span>
            </>
          )}
          {selectedSubs.size > 0 && (
            <>
              <span className="mx-2">/</span>
              <span className="text-xs text-gray-600">
                {getSelectedSubNames().join(', ')}
              </span>
            </>
          )}
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          {(selectedCategory || selectedSubs.size > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => clearFilters()}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              !selectedCategory && selectedSubs.size === 0
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
                
                
              </div>

              {/* Subcategories with checkboxes */}
              {expandedCategories.has(category._id) && category.subcategories && (
                <div className="ml-4 space-y-1">
                  {category.subcategories.map((subCategory) => (
                    <label
                      key={subCategory._id}
                      className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubs.has(subCategory._id)}
                        onChange={() => handleSubCategoryToggle(subCategory)}
                        className="custom-checkbox"
                      />
                      <span className="ml-3 text-sm text-gray-600">
                        {subCategory.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-checkbox {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 3px;
          background-color: white;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .custom-checkbox:checked {
          background-color: #6b7280;
          border-color: #6b7280;
        }

        .custom-checkbox:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 14px;
          font-weight: bold;
          line-height: 1;
        }

        .custom-checkbox:hover:not(:checked) {
          border-color: #9ca3af;
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;