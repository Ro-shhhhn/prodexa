// backend/routes/products.js - FIXED VERSION
const express = require('express');
const router = express.Router();
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

// Product routes
router.get('/', getProducts);
router.post('/', uploadProductImages, createProduct); // Use strict 3-image requirement for creation
router.get('/:id', getProductById);
router.put('/:id', uploadProductImagesForUpdate, updateProduct); // Use flexible image handling for updates

module.exports = router;