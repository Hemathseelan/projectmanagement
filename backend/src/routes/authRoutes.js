const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerValidator, loginValidator } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', authLimiter, validate(registerValidator), authController.register);
router.post('/login', authLimiter, validate(loginValidator), authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
