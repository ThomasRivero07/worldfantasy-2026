import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  username:      { type: DataTypes.STRING(30), allowNull: false, unique: true },
  email:         { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  avatar_url:    { type: DataTypes.STRING, defaultValue: null },
  total_points:  { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'users', timestamps: true, underscored: true });

export default User;
