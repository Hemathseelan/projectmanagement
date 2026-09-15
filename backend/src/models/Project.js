const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { PROJECT_STATUS } = require('../constants/projectStatus');

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
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
    status: {
      type: DataTypes.ENUM(...PROJECT_STATUS),
      allowNull: false,
      defaultValue: 'Not Started',
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
  }
);

module.exports = Project;
