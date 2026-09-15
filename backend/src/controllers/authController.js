const authService = require('../services/authService');
const { success, error } = require('../utils/response');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return success(res, { message: 'Account created successfully', data: result, statusCode: 201 });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return success(res, { message: 'Logged in successfully', data: result });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function logout(req, res) {
  // Stateless JWT: client discards the token. Endpoint kept for a clean API contract.
  return success(res, { message: 'Logged out successfully' });
}

async function getProfile(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.id);
    return success(res, { message: 'Profile fetched successfully', data: user });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

module.exports = { register, login, logout, getProfile };
