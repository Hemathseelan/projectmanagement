const { Project, Task } = require('../models');

async function getDashboardStats(userId) {
  const projects = await Project.findAll({
    where: { user_id: userId },
    include: [{ model: Task, as: 'tasks', attributes: ['id', 'status'] }],
  });

  let totalTasks = 0;
  let completedTasks = 0;
  let pendingTasks = 0;
let inProgressTasks = 0;
  projects.forEach((project) => {
    const tasks = project.tasks || [];
    totalTasks += tasks.length;
    completedTasks += tasks.filter((t) => t.status === 'Completed').length;
    pendingTasks += tasks.filter((t) => t.status === 'Pending').length;
   inProgressTasks += tasks.filter(
  (task) => task.status === 'In Progress'
).length;
  });

  return {
    totalProjects: projects.length,
    totalTasks,
    completedTasks,
    pendingTasks,
  inProgressTasks,
  };
}

module.exports = { getDashboardStats };
