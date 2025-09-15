// backend/models/SubCategory.js
const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sub category name is required'],
    trim: true,
    minlength: [2, 'Sub category name must be at least 2 characters'],
    maxlength: [50, 'Sub category name cannot exceed 50 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique sub category name within a category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);