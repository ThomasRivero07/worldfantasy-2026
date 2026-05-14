import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const PointsLog = sequelize.define('PointsLog', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  team_id:   { type: DataTypes.UUID, allowNull: false },
  player_id: { type: DataTypes.STRING, allowNull: false },
  match_id:  { type: DataTypes.STRING, allowNull: false },
  points:    { type: DataTypes.INTEGER, defaultValue: 0 },
  breakdown: { type: DataTypes.JSONB, defaultValue: {} },
}, { tableName: 'points_log', timestamps: true, underscored: true });

export default PointsLog;
