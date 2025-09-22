const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getCategories,
  createCategory,
  getSubCategories,
  getAllSubCategories,
  createSubCategory,
  getAllCategoriesWithSubcategories
} = require('../controllers/categoryController');

// ALL routes require authentication
router.get('/', auth, getCategories);
router.get('/subcategories/all', auth, getAllSubCategories);
router.get('/:categoryId/subcategories', auth, getSubCategories);
router.get('/with-subcategories', auth, getAllCategoriesWithSubcategories);
router.post('/', auth, createCategory);
router.post('/subcategories', auth, createSubCategory);

module.exports = router;