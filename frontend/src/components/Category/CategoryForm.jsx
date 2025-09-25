// src/components/Category/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import Button from '../common/UI/Button';
import Input from '../common/UI/Input';
import categoryService from '../../services/categoryService';

const CategoryForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Category name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z0-9\s\-&]+$/.test(formData.name.trim())) {
      errors.name = 'Category name can only contain letters, numbers, spaces, hyphens, and ampersands';
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
      
      const response = await categoryService.createCategory({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      
      if (response.success) {
        setSuccess('Category created successfully!');
        
        // Reset form
        setFormData({
          name: '',
          description: ''
        });
        
        // Close modal after showing success message briefly
        setTimeout(() => {
          onSuccess(response.data);
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create category';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      
      <div className="border border-gray-300 rounded-lg p-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Category Name <span className="text-red-500">*</span>
  </label>
  <Input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Enter category name"
    className={validationErrors.name ? 'border-red-500' : ''}
    disabled={loading}
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
          placeholder="Enter category description"
          rows={3}
          disabled={loading}
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
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;