// backend/config/cloudinary.js - FIXED VERSION
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit', quality: 'auto' },
      { fetch_format: 'auto' }
    ],
  },
});

// Configure multer with file filtering
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Middleware for creating new products (requires exactly 3 images)
const uploadProductImages = (req, res, next) => {
  const uploadMultiple = upload.array('images', 3);
  
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed'
      });
    }
    
    // For create operation, require exactly 3 images
    if (req.method === 'POST' && (!req.files || req.files.length !== 3)) {
      return res.status(400).json({
        success: false,
        message: 'Exactly 3 images are required'
      });
    }
    
    next();
  });
};

const uploadProductImagesForUpdate = (req, res, next) => {
  const uploadMultiple = upload.array('images', 3);
  
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed'
      });
    }
    
    
    if (req.files && req.files.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 3 images are allowed'
      });
    }
    
    next();
  });
};

// Function to delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

module.exports = {
  cloudinary,
  upload,
  uploadProductImages, // For creating products (requires exactly 3)
  uploadProductImagesForUpdate, // For updating products (allows 0-3)
  deleteImage
};