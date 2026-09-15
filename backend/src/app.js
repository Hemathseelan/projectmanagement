const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundMiddleware, errorMiddleware } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
