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
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Sub category name is required');
      return;
    }
    
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // FIXED: Using the correct service method signature
      const response = await categoryService.createSubCategory({
        name: formData.name,
        category: formData.category,
        description: formData.description
      });
      
      if (response.success) {
        setSuccess('Sub category created successfully!');
        
        // Close modal after showing success message briefly
        setTimeout(() => {
          onSuccess(response.data);
        }, 1000);
      } else {
        setError(response.message || 'Failed to create sub category');
      }
    } catch (error) {
      setError(error.message || 'Failed to create sub category');
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        {categoriesLoading ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
        ) : (
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            placeholder="Select category"
            required
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub Category Name *
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter sub category name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter sub category description (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
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
        >
          {loading ? 'Adding...' : 'Add Sub Category'}
        </Button>
      </div>
    </form>
  );
};

export default SubCategoryForm;