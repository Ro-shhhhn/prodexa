const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'wishlist',
        populate: [
          { path: 'category', select: 'name' },
          { path: 'subcategory', select: 'name' }
        ]
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.wishlist || [],
      count: user.wishlist ? user.wishlist.length : 0
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    // Return updated wishlist with populated data
    await user.populate({
      path: 'wishlist',
      populate: [
        { path: 'category', select: 'name' },
        { path: 'subcategory', select: 'name' }
      ]
    });

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: user.wishlist,
      count: user.wishlist.length
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message
    });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID is required'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => !id.equals(productId));
    await user.save();

    // Return updated wishlist with populated data
    await user.populate({
      path: 'wishlist',
      populate: [
        { path: 'category', select: 'name' },
        { path: 'subcategory', select: 'name' }
      ]
    });

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: user.wishlist,
      count: user.wishlist.length
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message
    });
  }
};

// Check if product is in wishlist
exports.checkWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID is required'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isInWishlist = user.wishlist.includes(productId);

    res.json({
      success: true,
      data: { isInWishlist }
    });
  } catch (error) {
    console.error('Check wishlist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist item',
      error: error.message
    });
  }
};