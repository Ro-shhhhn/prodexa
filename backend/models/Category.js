// backend/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters'],
    validate: {
      validator: function(value) {
        return /^[a-zA-Z0-9\s\-&]+$/.test(value);
      },
      message: 'Category name can only contain letters, numbers, spaces, hyphens, and ampersands'
    }
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

// Add a pre-save hook to ensure name is properly formatted
categorySchema.pre('save', function(next) {
  if (this.name) {
    // Trim and remove extra spaces
    this.name = this.name.trim().replace(/\s+/g, ' ');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);