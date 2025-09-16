// backend/controllers/productController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// Get all products with filters and pagination
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
    
    // Search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Subcategory filter
    if (subcategory) {
      query.subcategory = subcategory;
    }
    
    // Price filter
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['variants.price'].$lte = parseFloat(maxPrice);
    }
    
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

// Create product with image upload
const createProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, variants } = req.body;
    
    // Validation
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

    // Parse variants if it's a string (from FormData)
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

    // Validate images - exactly 3 required
    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Exactly 3 images are required'
      });
    }
    
    // Check if category and subcategory exist
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
    
    // Validate variants
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

    // Process variants
    const processedVariants = parsedVariants.map(variant => ({
      ram: variant.ram.trim(),
      price: parseFloat(variant.price),
      quantity: parseInt(variant.quantity)
    }));

    // Get image URLs from Cloudinary upload
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
    
    // Populate for response
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

// Get single product
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ _id: id, isActive: true })
      .populate('category', 'name')
      .populate('subcategory', 'name');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
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
  getProductById
};