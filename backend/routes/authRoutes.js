import express from 'express';
import { 
  register, 
  login, 
  verifyEmail, 
  verifyMobile, 
} from '../controllers/authController.js';
import { validate, validationSchemas } from '../utils/validation.js';

const router = express.Router();

// Registration route
router.post('/register', validate(validationSchemas.registration), register);

// Login route
router.post('/login', validate(validationSchemas.login), login);

// Email verification route
router.post('/verify-email', validate(validationSchemas.emailVerification), verifyEmail);

// Mobile verification route
router.post('/verify-mobile', validate(validationSchemas.mobileVerification), verifyMobile);

export default router;