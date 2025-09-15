// src/components/Product/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import Button from '../common/UI/Button';
import Input from '../common/UI/Input';
import Select from '../common/Forms/Select';
import FileUpload from '../common/Forms/FileUpload';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const ProductForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    variants: [{ ram: '', price: '', quantity: '' }],
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  }, [formData.category]);

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

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await categoryService.getSubCategories(categoryId);
      if (response.success) {
        setSubcategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
    if (error) setError('');
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ram: '', price: '', quantity: '' }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        variants: updatedVariants
      }));
    }
  };

  const handleImageUpload = (files) => {
    // For now, we'll store file URLs as placeholders
    // In a real app, you'd upload to a server first
    const imageUrls = Array.from(files).map((file, index) => 
      `https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Image+${index + 1}`
    );
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.category) return 'Please select a category';
    if (!formData.subcategory) return 'Please select a sub category';
    
    // Validate variants
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];
      if (!variant.ram.trim()) return `RAM is required for variant ${i + 1}`;
      if (!variant.price || parseFloat(variant.price) <= 0) return `Valid price is required for variant ${i + 1}`;
      if (!variant.quantity || parseInt(variant.quantity) < 0) return `Valid quantity is required for variant ${i + 1}`;
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Convert variant values to proper types
      const processedVariants = formData.variants.map(variant => ({
        ram: variant.ram.trim(),
        price: parseFloat(variant.price),
        quantity: parseInt(variant.quantity)
      }));

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subcategory: formData.subcategory,
        variants: processedVariants,
        images: formData.images
      };
      
      const response = await productService.createProduct(productData);
      
      if (response.success) {
        onSuccess(response.data);
      } else {
        setError(response.message || 'Failed to create product');
      }
    } catch (error) {
      setError(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name
  }));

  const subcategoryOptions = subcategories.map(sub => ({
    value: sub._id,
    label: sub.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Category */}
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

      {/* Sub Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub Category *
        </label>
        <Select
          name="subcategory"
          value={formData.subcategory}
          onChange={handleChange}
          options={subcategoryOptions}
          placeholder="Select sub category"
          disabled={!formData.category}
          required
        />
      </div>

      {/* Variants */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Product Variants *
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addVariant}
          >
            Add Variant
          </Button>
        </div>
        
        <div className="space-y-3">
          {formData.variants.map((variant, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="RAM (e.g., 8GB)"
                  value={variant.ram}
                  onChange={(e) => handleVariantChange(index, 'ram', e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={variant.quantity}
                  onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                  min="0"
                  required
                />
              </div>
              {formData.variants.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeVariant(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        <FileUpload
          onFileSelect={handleImageUpload}
          accept="image/*"
          multiple
          className="mb-3"
        />
        
        {formData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
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
          Add Product
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;