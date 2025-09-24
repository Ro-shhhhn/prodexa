// backend/models/Product.js - Updated with Optimized Search Indexes
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

// OPTIMIZED INDEXES FOR PARTIAL SEARCH AND FILTERING

// 1. PRIMARY SEARCH INDEXES - For partial string matching (regex queries)
productSchema.index({ name: 1 }); // Essential for name-based partial search
productSchema.index({ description: 1 }); // For description-based partial search

// 2. CORE FILTERING INDEXES
productSchema.index({ isActive: 1, createdAt: -1 }); // Most common query: active products by date
productSchema.index({ category: 1, isActive: 1 }); // Filter by category (active products)
productSchema.index({ subcategory: 1, isActive: 1 }); // Filter by subcategory (active products)

// 3. COMPOUND INDEXES FOR COMPLEX QUERIES
productSchema.index({ 
  category: 1, 
  subcategory: 1, 
  isActive: 1 
}); // Category + subcategory filtering with active status

productSchema.index({ 
  isActive: 1, 
  category: 1, 
  'variants.price': 1 
}); // Active products by category with price range

// 4. PRICE FILTERING INDEXES
productSchema.index({ 'variants.price': 1 }); // For price range queries
productSchema.index({ 'variants.price': 1, isActive: 1 }); // Price + active status

// 5. FEATURED PRODUCTS INDEX
productSchema.index({ isFeatured: 1, isActive: 1, createdAt: -1 }); // Featured products display

// 6. RATING AND SORTING INDEXES
productSchema.index({ rating: -1, isActive: 1 }); // Sort by rating (highest first)
productSchema.index({ reviewCount: -1, isActive: 1 }); // Sort by review count

// 7. TEXT SEARCH INDEX (Fallback for advanced search)
productSchema.index({ 
  name: 'text', 
  description: 'text' 
}, {
  weights: {
    name: 10,        // Higher priority for name matches
    description: 5   // Lower priority for description matches
  },
  name: 'product_text_search'
});

// 8. SPARSE INDEXES (Only for documents that have the field)
productSchema.index({ rating: -1 }, { sparse: true }); // Only products with ratings
productSchema.index({ reviewCount: -1 }, { sparse: true }); // Only products with reviews

module.exports = mongoose.model('Product', productSchema);