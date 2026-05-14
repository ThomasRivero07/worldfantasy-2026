import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.PG_DB || 'worldfantasy',
  process.env.PG_USER || 'postgres',
  process.env.PG_PASSWORD || 'postgres',
  {
    host: process.env.PG_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

export const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL error:', err.message);
    console.error('❌ Full error:', err);
    process.exit(1);
  }
};
