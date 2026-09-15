const taskService = require('../services/taskService');
const { success, error } = require('../utils/response');

async function list(req, res, next) {
  try {
    const { data, meta } = await taskService.listTasks(req.user.id, req.query);
    return success(res, { message: 'Tasks fetched successfully', data, meta });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    return success(res, { message: 'Task fetched successfully', data: task });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return success(res, { message: 'Task created successfully', data: task, statusCode: 201 });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    return success(res, { message: 'Task updated successfully', data: task });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    return success(res, { message: 'Task deleted successfully', data: null });
  } catch (err) {
    if (err.statusCode) return error(res, { message: err.message, statusCode: err.statusCode });
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
