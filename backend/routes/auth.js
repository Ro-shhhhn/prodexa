const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateSignup, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

module.exports = router;