require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'project_management',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
