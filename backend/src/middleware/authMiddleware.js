const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { error } = require('../utils/response');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return error(res, { message: 'Authentication required', statusCode: 401 });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = { id: decoded.userId };
    return next();
  } catch (err) {
    return error(res, { message: 'Invalid or expired token', statusCode: 401 });
  }
}

module.exports = authMiddleware;
