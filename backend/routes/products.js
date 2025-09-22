const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  uploadProductImages, 
  uploadProductImagesForUpdate 
} = require('../config/cloudinary');
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct
} = require('../controllers/productController');

// ALL routes require authentication
router.get('/', auth, getProducts);
router.get('/:id', auth, getProductById);
router.post('/', auth, uploadProductImages, createProduct);
router.put('/:id', auth, uploadProductImagesForUpdate, updateProduct);

module.exports = router;