const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants/taskStatus');

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM(...TASK_PRIORITY),
      allowNull: false,
      defaultValue: 'Medium',
    },
    status: {
      type: DataTypes.ENUM(...TASK_STATUS),
      allowNull: false,
      defaultValue: 'Pending',
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
  }
);

module.exports = Task;
