const { body } = require('express-validator');

const registerValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

const loginValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidator, loginValidator };
