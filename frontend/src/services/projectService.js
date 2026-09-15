import api from './api';

const projectService = {
  list: (params) => api.get('/projects', { params }).then((res) => res.data),
  getById: (id) => api.get(`/projects/${id}`).then((res) => res.data),
  create: (payload) => api.post('/projects', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/projects/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/projects/${id}`).then((res) => res.data),
};

export default projectService;
