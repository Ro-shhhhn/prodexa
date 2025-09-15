const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Product routes working!' 
  });
});

// Product routes will be added here later
// GET /api/products - Get all products
// POST /api/products - Create new product
// GET /api/products/:id - Get single product
// PUT /api/products/:id - Update product
// DELETE /api/products/:id - Delete product

module.exports = router;