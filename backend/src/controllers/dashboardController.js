const dashboardService = require('../services/dashboardService');
const { success } = require('../utils/response');

async function getStats(req, res, next) {
  try {
    const stats = await dashboardService.getDashboardStats(req.user.id);
    return success(res, { message: 'Dashboard statistics fetched successfully', data: stats });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getStats };
