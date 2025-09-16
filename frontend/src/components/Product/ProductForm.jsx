// src/components/Product/ProductForm.jsx - FINAL FIX
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
    variants: [{ ram: '', price: '', quantity: '' }]
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([null, null, null]);

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

      const newFiles = [...selectedFiles];
      newFiles[index] = {
        file,
        preview: URL.createObjectURL(file)
      };
      setSelectedFiles(newFiles);
      setError('');
    }
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    if (newFiles[index]) {
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles[index] = null;
    }
    setSelectedFiles(newFiles);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.category) return 'Please select a category';
    if (!formData.subcategory) return 'Please select a sub category';
    
    const validImages = selectedFiles.filter(f => f !== null);
    if (validImages.length !== 3) return 'Please select exactly 3 images';
    
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
      
      selectedFiles.forEach((fileObj) => {
        if (fileObj) {
          formDataToSend.append('images', fileObj.file);
        }
      });
      
      const response = await productService.createProductWithImages(formDataToSend);
      
      if (response.success) {
        // Clean up preview URLs
        selectedFiles.forEach(fileObj => {
          if (fileObj) URL.revokeObjectURL(fileObj.preview);
        });
        
        // Call success callback - FIXED: Just pass the product data
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

  useEffect(() => {
    return () => {
      selectedFiles.forEach(fileObj => {
        if (fileObj) URL.revokeObjectURL(fileObj.preview);
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
          <Button type="button" variant="secondary" size="sm" onClick={addVariant}>Add Variant</Button>
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
                <Button type="button" variant="danger" size="sm" onClick={() => removeVariant(index)}>
                  Remove
                </Button>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images * (3 required)</label>
        <div className="grid grid-cols-3 gap-4">
          {['Main Image', 'Sub Image 1', 'Sub Image 2'].map((label, index) => (
            <div key={index} className="space-y-2">
              <div className="text-xs text-gray-600 font-medium">{label}</div>
              
              {!selectedFiles[index] ? (
                <FileUpload
                  onFileSelect={(files) => handleImageSelect(index, files)}
                  accept="image/*"
                  className="w-full"
                >
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-500">Click to select</div>
                  </div>
                </FileUpload>
              ) : (
                <div className="relative">
                  <img
                    src={selectedFiles[index].preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;