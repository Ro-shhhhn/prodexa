// backend/controllers/categoryController.js
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    const category = new Category({ name, description });
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Get subcategories by category
const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const subcategories = await SubCategory.find({ 
      category: categoryId, 
      isActive: true 
    }).populate('category', 'name').sort({ name: 1 });
    
    res.json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message
    });
  }
};

// Get all subcategories
const getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({ isActive: true })
      .populate('category', 'name')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message
    });
  }
};

// Create subcategory
const createSubCategory = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Sub category name is required'
      });
    }
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const subcategory = new SubCategory({ name, category, description });
    await subcategory.save();
    
    // Populate the category for response
    await subcategory.populate('category', 'name');
    
    res.status(201).json({
      success: true,
      message: 'Sub category created successfully',
      data: subcategory
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Sub category with this name already exists in this category'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create sub category',
      error: error.message
    });
  }
};

const getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    // Get all subcategories and populate category info
    const subcategories = await SubCategory.find({ isActive: true })
      .populate('category', 'name')
      .sort({ name: 1 });
    
    // Group subcategories by category
    const categoriesWithSubcategories = categories.map(category => {
      const categorySubcategories = subcategories.filter(
        sub => sub.category._id.toString() === category._id.toString()
      );
      
      return {
        ...category.toObject(),
        subcategories: categorySubcategories
      };
    });
    
    res.json({
      success: true,
      data: categoriesWithSubcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories with subcategories',
      error: error.message
    });
  }
};

// Export it
module.exports = {
  getCategories,
  createCategory,
  getSubCategories,
  getAllSubCategories,
  createSubCategory,
  getAllCategoriesWithSubcategories // Add this
};

