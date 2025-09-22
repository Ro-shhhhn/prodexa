const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistItem
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.use(auth);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.get('/check/:productId', checkWishlistItem);

module.exports = router;