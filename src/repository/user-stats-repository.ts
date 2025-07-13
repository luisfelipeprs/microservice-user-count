import mysql from 'mysql2/promise';
import { env } from '../config/env';
import 'dotenv/config';

export class UserStatsRepository {
  private pool: mysql.Pool;
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.STATS_DB_HOST,
      port: +(process.env.STATS_DB_PORT || 3306),
      user: process.env.STATS_DB_USER,
      password: process.env.STATS_DB_PASSWORD,
      database: process.env.STATS_DB_NAME,
    });
  }

  async getUserStats(userId: string): Promise<{ userId: string; max_clicks: number; clicks_per_second: number; last_click_at: Date | null }> {
    const [rows] = await this.pool.query(
      'SELECT user_id, max_clicks, clicks_per_second, last_click_at FROM user_stats WHERE user_id = ?',
      [userId]
    );
    const data = (rows as any[])[0];
    if (!data) {
      return { userId, max_clicks: 0, clicks_per_second: 0, last_click_at: null };
    }
    return {
      userId: data.user_id,
      max_clicks: data.max_clicks,
      clicks_per_second: data.clicks_per_second,
      last_click_at: data.last_click_at,
    };
  }
}
