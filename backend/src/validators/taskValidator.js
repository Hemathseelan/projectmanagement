const { body } = require('express-validator');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants/taskStatus');

const taskValidator = [
  body('projectId').notEmpty().withMessage('Project is required').isInt().withMessage('Project id must be a number'),
  body('name').trim().notEmpty().withMessage('Task name is required').isLength({ max: 150 }),
  body('description').optional({ nullable: true, checkFalsy: true }).isString(),
  body('priority').optional().isIn(TASK_PRIORITY).withMessage(`Priority must be one of: ${TASK_PRIORITY.join(', ')}`),
  body('status').optional().isIn(TASK_STATUS).withMessage(`Status must be one of: ${TASK_STATUS.join(', ')}`),
  body('dueDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Due date must be a valid date'),
];

module.exports = { taskValidator };
