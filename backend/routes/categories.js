const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Category routes working!' 
  });
});

// Category routes will be added here later
// GET /api/categories - Get all categories
// POST /api/categories - Create new category
// GET /api/categories/:id/subcategories - Get subcategories
// POST /api/categories/:id/subcategories - Create subcategory

module.exports = router;