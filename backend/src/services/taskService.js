const { Op } = require('sequelize');
const { Task, Project } = require('../models');
const { ApiError } = require('./authService');

const SORTABLE_FIELDS = ['createdAt', 'name', 'dueDate', 'priority', 'status'];
const FIELD_MAP = {
  createdAt: 'created_at',
  name: 'name',
  dueDate: 'due_date',
  priority: 'priority',
  status: 'status',
};

function formatTask(task) {
  const plain = task.get ? task.get({ plain: true }) : task;
  return {
    id: plain.id,
    projectId: plain.project_id,
    projectName: plain.project ? plain.project.name : undefined,
    name: plain.name,
    description: plain.description,
    priority: plain.priority,
    status: plain.status,
    dueDate: plain.due_date,
    createdAt: plain.created_at,
    updatedAt: plain.updated_at,
  };
}

async function assertProjectOwnership(userId, projectId) {
  const project = await Project.findOne({ where: { id: projectId, user_id: userId } });
  if (!project) {
    throw new ApiError('Project not found', 404);
  }
  return project;
}

async function listTasks(userId, query) {
  const {
    search,
    status,
    priority,
    projectId,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const where = {};
  if (search) where.name = { [Op.like]: `%${search}%` };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (projectId) where.project_id = projectId;

  const safeSortBy = SORTABLE_FIELDS.includes(sortBy) ? FIELD_MAP[sortBy] : 'created_at';
  const safeOrder = String(order).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const { rows, count } = await Task.findAndCountAll({
    where,
    include: [
      {
        model: Project,
        as: 'project',
        attributes: ['id', 'name', 'user_id'],
        where: { user_id: userId },
        required: true,
      },
    ],
    order: [[safeSortBy, safeOrder]],
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  return {
    data: rows.map(formatTask),
    meta: {
      page: pageNum,
      limit: limitNum,
      total: count,
      totalPages: Math.ceil(count / limitNum) || 1,
    },
  };
}

async function getTaskById(userId, taskId) {
  const task = await Task.findOne({
    where: { id: taskId },
    include: [
      { model: Project, as: 'project', attributes: ['id', 'name', 'user_id'], where: { user_id: userId }, required: true },
    ],
  });

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  return formatTask(task);
}

async function createTask(userId, payload) {
  await assertProjectOwnership(userId, payload.projectId);

  const task = await Task.create({
    project_id: payload.projectId,
    name: payload.name,
    description: payload.description || null,
    priority: payload.priority || 'Medium',
    status: payload.status || 'Pending',
    due_date: payload.dueDate || null,
  });

  return getTaskById(userId, task.id);
}

async function updateTask(userId, taskId, payload) {
  const existing = await getTaskById(userId, taskId);

  if (payload.projectId && payload.projectId !== existing.projectId) {
    await assertProjectOwnership(userId, payload.projectId);
  }

  const task = await Task.findByPk(taskId);
  await task.update({
    project_id: payload.projectId ?? task.project_id,
    name: payload.name ?? task.name,
    description: payload.description ?? task.description,
    priority: payload.priority ?? task.priority,
    status: payload.status ?? task.status,
    due_date: payload.dueDate ?? task.due_date,
  });

  return getTaskById(userId, task.id);
}

async function deleteTask(userId, taskId) {
  await getTaskById(userId, taskId); // ownership check
  await Task.destroy({ where: { id: taskId } });
}

module.exports = { listTasks, getTaskById, createTask, updateTask, deleteTask };
