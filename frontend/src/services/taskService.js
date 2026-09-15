import api from './api';

const taskService = {
  list: (params) => api.get('/tasks', { params }).then((res) => res.data),
  getById: (id) => api.get(`/tasks/${id}`).then((res) => res.data),
  create: (payload) => api.post('/tasks', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
};

export default taskService;
