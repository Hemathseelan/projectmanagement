const projectService = require('../services/projectService');
const { success, error } = require('../utils/response');

async function list(req, res, next) {
  try {
    const { data, meta } = await projectService.listProjects(req.user.id, req.query);
    return success(res, { message: 'Projects fetched successfully', data, meta });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.user.id, req.params.id);
    return success(res, { message: 'Project fetched successfully', data: project });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    return success(res, { message: 'Project created successfully', data: project, statusCode: 201 });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const project = await projectService.updateProject(req.user.id, req.params.id, req.body);
    return success(res, { message: 'Project updated successfully', data: project });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await projectService.deleteProject(req.user.id, req.params.id);
    return success(res, { message: 'Project deleted successfully', data: null });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
