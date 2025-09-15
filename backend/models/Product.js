// backend/models/Product.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  ram: {
    type: String,
    required: [true, 'RAM is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: [true, 'Sub category is required']
  },
  variants: {
    type: [variantSchema],
    required: [true, 'At least one variant is required'],
    validate: {
      validator: function(variants) {
        return variants && variants.length > 0;
      },
      message: 'Product must have at least one variant'
    }
  },
  images: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for total quantity across all variants
productSchema.virtual('totalQuantity').get(function() {
  return this.variants.reduce((total, variant) => total + variant.quantity, 0);
});

// Virtual for price range
productSchema.virtual('priceRange').get(function() {
  if (!this.variants || this.variants.length === 0) return null;
  
  const prices = this.variants.map(v => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  return { min: minPrice, max: maxPrice };
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });

module.exports = mongoose.model('Product', productSchema);