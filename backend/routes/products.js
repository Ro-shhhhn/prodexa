// backend/routes/products.js
const express = require('express');
const router = express.Router();
const { uploadProductImages } = require('../config/cloudinary');
const {
  getProducts,
  createProduct,
  getProductById
} = require('../controllers/productController');

// Product routes
router.get('/', getProducts);
router.post('/', uploadProductImages, createProduct); // Added image upload middleware
router.get('/:id', getProductById);

module.exports = router;