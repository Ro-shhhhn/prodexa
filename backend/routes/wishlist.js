const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Wishlist routes working!' 
  });
});

// Wishlist routes will be added here later
// GET /api/wishlist - Get user wishlist
// POST /api/wishlist - Add product to wishlist
// DELETE /api/wishlist/:productId - Remove from wishlist

module.exports = router;