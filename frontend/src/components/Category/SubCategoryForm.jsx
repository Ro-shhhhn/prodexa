// src/components/Category/SubCategoryForm.jsx
import React, { useState, useEffect } from 'react';
import Button from '../common/UI/Button';
import Input from '../common/UI/Input';
import Select from '../common/Forms/Select';
import categoryService from '../../services/categoryService';

const SubCategoryForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Sub category name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Sub category name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Sub category name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z0-9\s\-&]+$/.test(formData.name.trim())) {
      errors.name = 'Sub category name can only contain letters, numbers, spaces, hyphens, and ampersands';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await categoryService.createSubCategory({
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim()
      });
      
      if (response.success) {
        setSuccess('Sub category created successfully!');
        
        // Reset form
        setFormData({
          name: '',
          category: formData.category, // Keep the category selected
          description: ''
        });
        
        // Close modal after showing success message briefly
        setTimeout(() => {
          onSuccess(response.data);
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create sub category';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{success}</span>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        {categoriesLoading ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
        ) : categories.length === 0 ? (
          <div className="text-sm text-gray-500 p-2 border border-gray-200 rounded">
            No categories available. Please create a category first.
          </div>
        ) : (
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            placeholder="Select a category"
            className={validationErrors.category ? 'border-red-500' : ''}
            disabled={loading}
          />
        )}
        {validationErrors.category && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg p-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Sub Category Name <span className="text-red-500">*</span>
  </label>
  <Input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Enter sub category name"
    className={validationErrors.name ? 'border-red-500' : ''}
    disabled={loading || categories.length === 0}
  />
  {validationErrors.name && (
    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
  )}
  <p className="mt-1 text-xs text-gray-500">
    {formData.name.length}/50 characters
  </p>
</div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter sub category description"
          rows={3}
          disabled={loading || categories.length === 0}
          className={`w-full px-3 py-2 border ${validationErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading || categories.length === 0}
        >
          {loading ? 'Creating...' : 'Create Sub Category'}
        </Button>
      </div>
    </form>
  );
};

export default SubCategoryForm;