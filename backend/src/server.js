const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');

    if (env.nodeEnv !== 'production') {
      await sequelize.sync({ alter: true });
      logger.info('Database models synced');
    }

    app.listen(env.port, () => {
      logger.info(`TaskFlow API listening on port ${env.port}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

start();
