// backend/controllers/productController.js - FIXED VERSION
const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const mongoose = require('mongoose');

// Update product - FIXED with proper image handling
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that ID is provided and valid
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required and cannot be undefined'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const { name, description, category, subcategory, variants, existingImages } = req.body;
    
    // Find existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Basic field validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    // Parse variants and existing images
    let parsedVariants;
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid variants format'
      });
    }

    let parsedExistingImages = [];
    try {
      parsedExistingImages = existingImages ? 
        (typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages) : 
        [];
    } catch (err) {
      console.warn('Error parsing existing images:', err);
      parsedExistingImages = [];
    }

    // Handle images - FIXED LOGIC
    let finalImages = [];
    
    // Get new uploaded images
    const newImageUrls = req.files ? req.files.map(file => file.path) : [];
    
    // Combine new images with existing ones
    // Priority: new uploads first, then existing images to fill gaps
    for (let i = 0; i < 3; i++) {
      if (newImageUrls[i]) {
        // New image uploaded for this position
        finalImages[i] = newImageUrls[i];
      } else if (product.images[i]) {
        // Keep existing image for this position
        finalImages[i] = product.images[i];
      }
    }

    // Add any additional existing images that should be kept
    parsedExistingImages.forEach(existingImg => {
      if (!finalImages.includes(existingImg) && finalImages.length < 3) {
        finalImages.push(existingImg);
      }
    });

    // Ensure we have valid images (at least the existing ones)
    if (finalImages.length === 0 && product.images.length > 0) {
      finalImages = product.images;
    }

    // Validate that we have at least one image
    if (finalImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    // Validate variants
    if (parsedVariants && Array.isArray(parsedVariants)) {
      for (const variant of parsedVariants) {
        if (!variant.ram || !variant.ram.trim()) {
          return res.status(400).json({
            success: false,
            message: 'RAM is required for each variant'
          });
        }
        if (!variant.price || parseFloat(variant.price) <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Valid price is required for each variant'
          });
        }
        if (variant.quantity === undefined || parseInt(variant.quantity) < 0) {
          return res.status(400).json({
            success: false,
            message: 'Valid quantity is required for each variant'
          });
        }
      }
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
      description: description?.trim() || product.description,
      category: category || product.category,
      subcategory: subcategory || product.subcategory,
      images: finalImages
    };

    // Only update variants if provided
    if (parsedVariants && Array.isArray(parsedVariants)) {
      updateData.variants = parsedVariants.map(variant => ({
        ram: variant.ram.trim(),
        price: parseFloat(variant.price),
        quantity: parseInt(variant.quantity)
      }));
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).populate(['category', 'subcategory']);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Keep all other existing functions unchanged
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      subcategory,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (subcategory) {
      query.subcategory = subcategory;
    }
    
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['variants.price'].$lte = parseFloat(maxPrice);
    }
    
    // Log for debugging
    console.log('Product query:', query);
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, variants } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }
    
    if (!subcategory) {
      return res.status(400).json({
        success: false,
        message: 'Sub category is required'
      });
    }

    let parsedVariants;
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid variants format'
      });
    }
    
    if (!parsedVariants || !Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one variant is required'
      });
    }

    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Exactly 3 images are required'
      });
    }
    
    const [categoryExists, subcategoryExists] = await Promise.all([
      Category.findById(category),
      SubCategory.findById(subcategory)
    ]);
    
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    if (!subcategoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }
    
    for (const variant of parsedVariants) {
      if (!variant.ram || !variant.ram.trim()) {
        return res.status(400).json({
          success: false,
          message: 'RAM is required for each variant'
        });
      }
      if (!variant.price || parseFloat(variant.price) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid price is required for each variant'
        });
      }
      if (variant.quantity === undefined || parseInt(variant.quantity) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid quantity is required for each variant'
        });
      }
    }

    const processedVariants = parsedVariants.map(variant => ({
      ram: variant.ram.trim(),
      price: parseFloat(variant.price),
      quantity: parseInt(variant.quantity)
    }));

    const imageUrls = req.files.map(file => file.path);
    
    const product = new Product({
      name: name.trim(),
      description: description ? description.trim() : '',
      category,
      subcategory,
      variants: processedVariants,
      images: imageUrls
    });
    
    await product.save();
    await product.populate(['category', 'subcategory']);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required and cannot be undefined'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const product = await Product.findOne({ _id: id, isActive: true })
      .populate('category', 'name')
      .populate('subcategory', 'name');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct  
};