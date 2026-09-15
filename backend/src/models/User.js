const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
  toSafeJSON() {
    const { id, full_name, email, created_at, updated_at } = this.get();
    return { id, fullName: full_name, email, createdAt: created_at, updatedAt: updated_at };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

module.exports = User;
