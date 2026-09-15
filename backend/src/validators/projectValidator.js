const { body } = require('express-validator');
const { PROJECT_STATUS } = require('../constants/projectStatus');

const projectValidator = [
  body('name').trim().notEmpty().withMessage('Project name is required').isLength({ max: 150 }),
  body('description').optional({ nullable: true, checkFalsy: true }).isString(),
  body('status').optional().isIn(PROJECT_STATUS).withMessage(`Status must be one of: ${PROJECT_STATUS.join(', ')}`),
  body('startDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Start date must be a valid date'),
  body('endDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (req.body.startDate && value && new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date cannot be before start date');
      }
      return true;
    }),
];

module.exports = { projectValidator };
