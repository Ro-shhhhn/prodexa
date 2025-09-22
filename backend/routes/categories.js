
const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  getSubCategories,
  getAllSubCategories,
  createSubCategory,
    getAllCategoriesWithSubcategories // Add this import

} = require('../controllers/categoryController');

// Category routes
router.get('/', getCategories);
router.post('/', createCategory);

// Subcategory routes
router.get('/subcategories/all', getAllSubCategories);
router.get('/:categoryId/subcategories', getSubCategories);
router.post('/subcategories', createSubCategory);
router.get('/with-subcategories', getAllCategoriesWithSubcategories); // Add this route

module.exports = router;