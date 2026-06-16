const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getUser);

module.exports = router;