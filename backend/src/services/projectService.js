const { Op } = require('sequelize');
const { Project, Task, sequelize } = require('../models');
const { ApiError } = require('./authService');

const SORTABLE_FIELDS = ['createdAt', 'name', 'status', 'startDate', 'endDate'];
const FIELD_MAP = {
  createdAt: 'created_at',
  name: 'name',
  status: 'status',
  startDate: 'start_date',
  endDate: 'end_date',
};

async function listProjects(userId, query) {
  const { search, status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = query;

  const where = { user_id: userId };
  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }
  if (status) {
    where.status = status;
  }

  const safeSortBy = SORTABLE_FIELDS.includes(sortBy) ? FIELD_MAP[sortBy] : 'created_at';
  const safeOrder = String(order).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const { rows, count } = await Project.findAndCountAll({
    where,
    order: [[safeSortBy, safeOrder]],
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    include: [{ model: Task, as: 'tasks', attributes: ['id', 'status'] }],
  });

  const data = rows.map((project) => formatProjectWithProgress(project));

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total: count,
      totalPages: Math.ceil(count / limitNum) || 1,
    },
  };
}

function formatProjectWithProgress(project) {
  const plain = project.get({ plain: true });
  const tasks = plain.tasks || [];
 const completed = tasks.filter(
  (t) => t.status === 'Completed'
).length;

const progress = tasks.length
  ? Math.round((completed / tasks.length) * 100)
  : plain.status === 'Completed'
    ? 100
    : plain.status === 'In Progress'
      ? 50
      : 0;
  return {
    id: plain.id,
    name: plain.name,
    description: plain.description,
    status: plain.status,
    startDate: plain.start_date,
    endDate: plain.end_date,
    createdAt: plain.created_at,
    updatedAt: plain.updated_at,
    taskCount: tasks.length,
    completedTaskCount: completed,
    progress,
  };
}

async function getProjectById(userId, projectId) {
  const project = await Project.findOne({
    where: { id: projectId, user_id: userId },
    include: [{ model: Task, as: 'tasks' }],
  });

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  return formatProjectWithProgress(project);
}

async function createProject(userId, payload) {
  const project = await Project.create({
    user_id: userId,
    name: payload.name,
    description: payload.description || null,
    status: payload.status || 'Not Started',
    start_date: payload.startDate || null,
    end_date: payload.endDate || null,
  });

  return getProjectById(userId, project.id);
}

async function updateProject(userId, projectId, payload) {
  const project = await Project.findOne({ where: { id: projectId, user_id: userId } });
  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  await project.update({
    name: payload.name ?? project.name,
    description: payload.description ?? project.description,
    status: payload.status ?? project.status,
    start_date: payload.startDate ?? project.start_date,
    end_date: payload.endDate ?? project.end_date,
  });

  return getProjectById(userId, project.id);
}

async function deleteProject(userId, projectId) {
  const project = await Project.findOne({ where: { id: projectId, user_id: userId } });
  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  await sequelize.transaction(async (t) => {
    await Task.destroy({ where: { project_id: project.id }, transaction: t });
    await project.destroy({ transaction: t });
  });
}

module.exports = { listProjects, getProjectById, createProject, updateProject, deleteProject };
