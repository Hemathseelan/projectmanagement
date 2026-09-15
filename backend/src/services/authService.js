const bcrypt = require('bcrypt');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');

const SALT_ROUNDS = 12;

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function register({ fullName, email, password }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ApiError('An account with this email already exists', 409);
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ full_name: fullName, email, password: hashed });

  const token = generateToken(user.id);
  return { user: user.toSafeJSON(), token };
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError('Invalid email or password', 401);
  }

  const token = generateToken(user.id);
  return { user: user.toSafeJSON(), token };
}

async function getProfile(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  return user.toSafeJSON();
}

module.exports = { register, login, getProfile, ApiError };
