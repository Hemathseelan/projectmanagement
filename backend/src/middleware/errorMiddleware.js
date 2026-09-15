const env = require('../config/env');
const logger = require('../utils/logger');
const { error } = require('../utils/response');

function notFoundMiddleware(req, res) {
  return error(res, { message: 'Route not found', statusCode: 404 });
}

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'A record with these details already exists';
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 422;
    message = 'Validation failed';
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference to a related record';
  } else if (env.nodeEnv === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  return error(res, { message, statusCode });
}

module.exports = { notFoundMiddleware, errorMiddleware };
