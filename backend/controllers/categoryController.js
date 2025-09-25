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

// Create category with better duplicate handling
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    // Sanitize input
    const trimmedName = name.trim().replace(/\s+/g, ' ');
    
    // Check for existing category (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `Category "${trimmedName}" already exists. Please choose a different name.`
      });
    }
    
    // Create new category
    const category = new Category({ 
      name: trimmedName, 
      description: description?.trim() 
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This category name already exists. Please choose a different name.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    
    // Generic error
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
    
    // Validate category ID
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }
    
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

// Create subcategory with better duplicate handling
const createSubCategory = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    
    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Sub category name is required'
      });
    }
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please select a category'
      });
    }
    
    // Sanitize input
    const trimmedName = name.trim().replace(/\s+/g, ' ');
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Selected category not found'
      });
    }
    
    // Check for existing subcategory in the same category (case-insensitive)
    const existingSubCategory = await SubCategory.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      category: category
    });
    
    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: `Sub category "${trimmedName}" already exists in "${categoryExists.name}". Please choose a different name.`
      });
    }
    
    // Create new subcategory
    const subcategory = new SubCategory({ 
      name: trimmedName, 
      category, 
      description: description?.trim() 
    });
    
    await subcategory.save();
    
    // Populate the category for response
    await subcategory.populate('category', 'name');
    
    res.status(201).json({
      success: true,
      message: 'Sub category created successfully',
      data: subcategory
    });
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      // Try to get the category name for better error message
      try {
        const categoryInfo = await Category.findById(req.body.category);
        const categoryName = categoryInfo ? categoryInfo.name : 'selected category';
        return res.status(400).json({
          success: false,
          message: `This sub category name already exists in ${categoryName}. Please choose a different name.`
        });
      } catch {
        return res.status(400).json({
          success: false,
          message: 'This sub category name already exists in the selected category. Please choose a different name.'
        });
      }
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    
    // Generic error
    res.status(500).json({
      success: false,
      message: 'Failed to create sub category',
      error: error.message
    });
  }
};

// Get all categories with their subcategories
const getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    // Get all active categories
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    // Get all active subcategories and populate category info
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

// Update category
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, isActive } = req.body;
    
    // Validate category ID
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }
    
    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // If name is being updated, check for duplicates
    if (name && name.trim() !== category.name) {
      const trimmedName = name.trim().replace(/\s+/g, ' ');
      
      const existingCategory = await Category.findOne({
        _id: { $ne: categoryId },
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: `Category "${trimmedName}" already exists. Please choose a different name.`
        });
      }
      
      category.name = trimmedName;
    }
    
    // Update other fields if provided
    if (description !== undefined) category.description = description?.trim();
    if (isActive !== undefined) category.isActive = isActive;
    
    await category.save();
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This category name already exists. Please choose a different name.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// Update subcategory
const updateSubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const { name, category, description, isActive } = req.body;
    
    // Validate subcategory ID
    if (!subCategoryId) {
      return res.status(400).json({
        success: false,
        message: 'Sub category ID is required'
      });
    }
    
    // Find the subcategory
    const subcategory = await SubCategory.findById(subCategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }
    
    // If category is being changed, verify it exists
    if (category && category !== subcategory.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Selected category not found'
        });
      }
      subcategory.category = category;
    }
    
    // If name is being updated, check for duplicates within the same category
    if (name && name.trim() !== subcategory.name) {
      const trimmedName = name.trim().replace(/\s+/g, ' ');
      const targetCategory = category || subcategory.category;
      
      const existingSubCategory = await SubCategory.findOne({
        _id: { $ne: subCategoryId },
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
        category: targetCategory
      });
      
      if (existingSubCategory) {
        const categoryInfo = await Category.findById(targetCategory);
        return res.status(400).json({
          success: false,
          message: `Sub category "${trimmedName}" already exists in "${categoryInfo.name}". Please choose a different name.`
        });
      }
      
      subcategory.name = trimmedName;
    }
    
    // Update other fields if provided
    if (description !== undefined) subcategory.description = description?.trim();
    if (isActive !== undefined) subcategory.isActive = isActive;
    
    await subcategory.save();
    await subcategory.populate('category', 'name');
    
    res.json({
      success: true,
      message: 'Sub category updated successfully',
      data: subcategory
    });
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This sub category name already exists in the selected category. Please choose a different name.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update sub category',
      error: error.message
    });
  }
};

// Delete category (soft delete)
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Validate category ID
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }
    
    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if there are active subcategories
    const activeSubcategories = await SubCategory.countDocuments({
      category: categoryId,
      isActive: true
    });
    
    if (activeSubcategories > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${activeSubcategories} active subcategories.`
      });
    }
    
    // Soft delete
    category.isActive = false;
    await category.save();
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

// Delete subcategory (soft delete)
const deleteSubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    
    // Validate subcategory ID
    if (!subCategoryId) {
      return res.status(400).json({
        success: false,
        message: 'Sub category ID is required'
      });
    }
    
    // Find the subcategory
    const subcategory = await SubCategory.findById(subCategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }
    
    // Soft delete
    subcategory.isActive = false;
    await subcategory.save();
    
    res.json({
      success: true,
      message: 'Sub category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete sub category',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  getCategories,
  createCategory,
  getSubCategories,
  getAllSubCategories,
  createSubCategory,
  getAllCategoriesWithSubcategories,
  updateCategory,
  updateSubCategory,
  deleteCategory,
  deleteSubCategory
};