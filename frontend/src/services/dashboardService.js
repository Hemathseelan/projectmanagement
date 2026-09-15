import api from './api';

const dashboardService = {
  getStats: () => api.get('/dashboard').then((res) => res.data),
};

export default dashboardService;
