// src/components/Product/EditProductForm.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import Button from '../common/UI/Button';
import Input from '../common/UI/Input';
import Select from '../common/Forms/Select';
import FileUpload from '../common/Forms/FileUpload';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const EditProductForm = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    description: product.description || '',
    category: product.category?._id || '',
    subcategory: product.subcategory?._id || '',
    variants: product.variants || [{ ram: '', price: '', quantity: '' }]
  });
  
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // FIXED: Better image state management
  const [imageState, setImageState] = useState({
    existing: product.images || [],
    new: [null, null, null], // Track new files for each position
    previews: [null, null, null] // Track preview URLs for new files
  });

  useEffect(() => {
    fetchCategories();
    if (product.category?._id) {
      fetchSubcategories(product.category._id);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await categoryService.getSubCategories(categoryId);
      if (response.success) setSubcategories(response.data);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
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
      setFormData(prev => ({ ...prev, variants: updatedVariants }));
    }
  };

  // FIXED: Improved image handling
  const handleImageSelect = (index, files) => {
    if (files.length > 0) {
      const file = files[0];
      
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      // Clean up previous preview
      if (imageState.previews[index]) {
        URL.revokeObjectURL(imageState.previews[index]);
      }

      const previewUrl = URL.createObjectURL(file);
      
      setImageState(prev => ({
        ...prev,
        new: prev.new.map((item, i) => i === index ? file : item),
        previews: prev.previews.map((item, i) => i === index ? previewUrl : item)
      }));
      
      setError('');
    }
  };

  const removeImage = (index) => {
    // Clean up preview URL
    if (imageState.previews[index]) {
      URL.revokeObjectURL(imageState.previews[index]);
    }
    
    setImageState(prev => ({
      ...prev,
      new: prev.new.map((item, i) => i === index ? null : item),
      previews: prev.previews.map((item, i) => i === index ? null : item)
    }));
  };

  // FIXED: Get current image for display (new or existing)
  const getCurrentImage = (index) => {
    if (imageState.previews[index]) {
      return imageState.previews[index]; // Show new image preview
    }
    if (imageState.existing[index]) {
      return imageState.existing[index]; // Show existing image
    }
    return null;
  };

  // FIXED: Check if image slot has any content (new or existing)
  const hasImageInSlot = (index) => {
    return !!(imageState.previews[index] || imageState.existing[index]);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.category) return 'Please select a category';
    if (!formData.subcategory) return 'Please select a sub category';
    
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];
      if (!variant.ram.trim()) return `RAM is required for variant ${i + 1}`;
      if (!variant.price || parseFloat(variant.price) <= 0) return `Valid price is required for variant ${i + 1}`;
      if (variant.quantity === '' || parseInt(variant.quantity) < 0) return `Valid quantity is required for variant ${i + 1}`;
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
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      
      const processedVariants = formData.variants.map(variant => ({
        ram: variant.ram.trim(),
        price: parseFloat(variant.price),
        quantity: parseInt(variant.quantity)
      }));
      formDataToSend.append('variants', JSON.stringify(processedVariants));
      
      // FIXED: Only append new images that were actually selected
      const hasNewImages = imageState.new.some(file => file !== null);
      if (hasNewImages) {
        imageState.new.forEach((file) => {
          if (file) {
            formDataToSend.append('images', file);
          }
        });
      }
      
      // FIXED: Always send existing images info for backend to handle properly
      formDataToSend.append('existingImages', JSON.stringify(imageState.existing));
      
      const response = await productService.updateProduct(product._id, formDataToSend);
      
      if (response.success) {
        // Clean up preview URLs
        imageState.previews.forEach(preview => {
          if (preview) URL.revokeObjectURL(preview);
        });
        onSuccess(response.data);
      } else {
        setError(response.message || 'Failed to update product');
      }
    } catch (error) {
      setError(error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      imageState.previews.forEach(preview => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, []);

  const categoryOptions = categories.map(cat => ({ value: cat._id, label: cat.name }));
  const subcategoryOptions = subcategories.map(sub => ({ value: sub._id, label: sub.name }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          placeholder="Select category"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
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

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Product Variants *</label>
          <Button type="button" variant="secondary" size="sm" onClick={addVariant}>
            Add Variant
          </Button>
        </div>
        
        <div className="space-y-3">
          {formData.variants.map((variant, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <Input
                type="text"
                placeholder="RAM (e.g., 8GB)"
                value={variant.ram}
                onChange={(e) => handleVariantChange(index, 'ram', e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                min="0"
                step="0.01"
                required
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={variant.quantity}
                onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                min="0"
                required
              />
              {formData.variants.length > 1 && (
               
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* FIXED: Improved Image Management Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <div className="text-xs text-gray-600 font-medium">
                {index === 0 ? 'Main Image' : `Sub Image ${index}`}
              </div>
              
              {hasImageInSlot(index) ? (
                <div className="space-y-2">
                  <div className="relative">
                    <img
                      src={getCurrentImage(index)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <div className="absolute top-1 right-1 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      {imageState.previews[index] ? 'New' : 'Current'}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <FileUpload onFileSelect={(files) => handleImageSelect(index, files)} accept="image/*">
                      <div className="flex-1 text-center px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded hover:bg-orange-200 transition-colors cursor-pointer">
                        Replace
                      </div>
                    </FileUpload>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="flex-1 text-center px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <FileUpload onFileSelect={(files) => handleImageSelect(index, files)} accept="image/*">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer">
                    <svg className="w-6 h-6 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <div className="text-xs text-gray-500">
                      Add Image
                    </div>
                  </div>
                </FileUpload>
              )}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          You can replace individual images or keep existing ones. At least one image is required.
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {loading ? 'Updating...' : 'Update Product'}
        </Button>
      </div>
    </form>
  );
};

export default EditProductForm;