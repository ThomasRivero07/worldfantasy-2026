import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Transfer = sequelize.define('Transfer', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  team_id:       { type: DataTypes.UUID, allowNull: false },
  player_out_id: { type: DataTypes.UUID, allowNull: false },
  player_in_id:  { type: DataTypes.UUID, allowNull: false },
  matchday:      { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'transfers', timestamps: true, underscored: true });

export default Transfer;
