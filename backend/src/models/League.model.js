import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const League = sequelize.define('League', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:        { type: DataTypes.STRING(50), allowNull: false },
  invite_code: { type: DataTypes.STRING(8), allowNull: false, unique: true },
  owner_id:    { type: DataTypes.UUID, allowNull: false },
  max_members: { type: DataTypes.INTEGER, defaultValue: 10 },
  budget:      { type: DataTypes.DECIMAL(10, 2), defaultValue: 100.00 },
  status:      { type: DataTypes.ENUM('waiting', 'draft', 'active', 'finished'), defaultValue: 'waiting' },
  draft_date:  { type: DataTypes.DATE, defaultValue: null },
}, { tableName: 'leagues', timestamps: true, underscored: true });

export default League;
