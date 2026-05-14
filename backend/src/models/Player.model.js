import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Player = sequelize.define('Player', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  api_id:        { type: DataTypes.STRING, unique: true },
  name:          { type: DataTypes.STRING, allowNull: false },
  photo:         { type: DataTypes.STRING, defaultValue: null },
  nationality:   { type: DataTypes.STRING, defaultValue: null },
  team_name:     { type: DataTypes.STRING, defaultValue: null },
  team_logo:     { type: DataTypes.STRING, defaultValue: null },
  team_group:    { type: DataTypes.STRING, defaultValue: null },
  position:      { type: DataTypes.ENUM('Goalkeeper', 'Defender', 'Midfielder', 'Attacker') },
  number:        { type: DataTypes.INTEGER, defaultValue: null },
  age:           { type: DataTypes.INTEGER, defaultValue: null },
  fantasy_price: { type: DataTypes.DECIMAL(5, 1), defaultValue: 10.0 },
  goals:         { type: DataTypes.INTEGER, defaultValue: 0 },
  assists:       { type: DataTypes.INTEGER, defaultValue: 0 },
  yellow_cards:  { type: DataTypes.INTEGER, defaultValue: 0 },
  red_cards:     { type: DataTypes.INTEGER, defaultValue: 0 },
  clean_sheets:  { type: DataTypes.INTEGER, defaultValue: 0 },
  minutes_played:{ type: DataTypes.INTEGER, defaultValue: 0 },
  rating:        { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },
  ml_score:      { type: DataTypes.DECIMAL(4, 1), defaultValue: null },
  is_available:  { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'players', timestamps: true, underscored: true });

export default Player;
