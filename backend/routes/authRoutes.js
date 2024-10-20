const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  verifyEmail, 
  verifyMobile, 
  resendOTP 
} = require('../controllers/authController');
const { validate, validationSchemas } = require('../utils/validation');

// Registration route
router.post('/register', validate(validationSchemas.registration), register);

// Login route
router.post('/login', validate(validationSchemas.login), login);

// Email verification route
router.post('/verify-email', validate(validationSchemas.emailVerification), verifyEmail);

// Mobile verification route
router.post('/verify-mobile', validate(validationSchemas.mobileVerification), verifyMobile);


module.exports = router;