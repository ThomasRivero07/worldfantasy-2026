import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const PlayerStats = sequelize.define('PlayerStats', {
  id:              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  player_id:       { type: DataTypes.UUID, allowNull: false },
  match_id:        { type: DataTypes.STRING, allowNull: false },
  minutes_played:  { type: DataTypes.INTEGER, defaultValue: 0 },
  goals:           { type: DataTypes.INTEGER, defaultValue: 0 },
  assists:         { type: DataTypes.INTEGER, defaultValue: 0 },
  yellow_cards:    { type: DataTypes.INTEGER, defaultValue: 0 },
  red_cards:       { type: DataTypes.INTEGER, defaultValue: 0 },
  clean_sheet:     { type: DataTypes.BOOLEAN, defaultValue: false },
  shots_on_target: { type: DataTypes.INTEGER, defaultValue: 0 },
  penalties_saved: { type: DataTypes.INTEGER, defaultValue: 0 },
  own_goals:       { type: DataTypes.INTEGER, defaultValue: 0 },
  is_motm:         { type: DataTypes.BOOLEAN, defaultValue: false }, // Man of the Match
  fantasy_points:  { type: DataTypes.INTEGER, defaultValue: 0 },
  breakdown:       { type: DataTypes.JSONB, defaultValue: {} },
}, { tableName: 'player_stats', timestamps: true, underscored: true });

export default PlayerStats;
