import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const FantasyTeam = sequelize.define('FantasyTeam', {
  id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:             { type: DataTypes.STRING(40), allowNull: false },
  user_id:          { type: DataTypes.UUID, allowNull: false },
  league_id:        { type: DataTypes.UUID, allowNull: false },
  budget_remaining: { type: DataTypes.DECIMAL(10, 2), defaultValue: 100.00 },
  total_points:     { type: DataTypes.INTEGER, defaultValue: 0 },
  players:          { type: DataTypes.JSONB, defaultValue: [] },
}, { tableName: 'fantasy_teams', timestamps: true, underscored: true });

export default FantasyTeam;
