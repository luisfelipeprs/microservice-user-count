import 'dotenv/config';

export const env = {
  STATS_DB_HOST: process.env.STATS_DB_HOST || 'localhost',
  STATS_DB_PORT: +(process.env.STATS_DB_PORT || 3306),
  STATS_DB_USER: process.env.STATS_DB_USER || 'root',
  STATS_DB_PASSWORD: process.env.STATS_DB_PASSWORD || 'root',
  STATS_DB_NAME: process.env.STATS_DB_NAME || 'app_db',
};
