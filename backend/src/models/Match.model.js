import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Match = sequelize.define('Match', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  match_id:    { type: DataTypes.STRING, unique: true }, // ej: 'A-1' grupo A partido 1
  home_team:   { type: DataTypes.STRING, allowNull: false },
  away_team:   { type: DataTypes.STRING, allowNull: false },
  home_goals:  { type: DataTypes.INTEGER, defaultValue: null },
  away_goals:  { type: DataTypes.INTEGER, defaultValue: null },
  match_date:  { type: DataTypes.DATE },
  group:       { type: DataTypes.STRING },
  status:      { type: DataTypes.ENUM('upcoming', 'live', 'finished'), defaultValue: 'upcoming' },
  matchday:    { type: DataTypes.INTEGER, defaultValue: 1 },
}, { tableName: 'matches', timestamps: true, underscored: true });

export default Match;
