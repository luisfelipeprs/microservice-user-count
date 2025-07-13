import mysql from 'mysql2/promise';
import 'dotenv/config'
// Conexão para o banco de usuários
const userDb = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: +(process.env.DB_PORT || 3306),
});

// Conexão para o banco de stats
const statsDb = mysql.createPool({
  host: process.env.STATS_DB_HOST,
  user: process.env.STATS_DB_USER,
  password: process.env.STATS_DB_PASSWORD,
  database: process.env.STATS_DB_NAME,
  port: +(process.env.STATS_DB_PORT || 3306),
});

async function seedUsers() {
  await userDb.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const users = [
    { id: '1', name: 'Alice Johnson', email: 'alice.johnson@gmail.com', address: '123 Main St, New York, NY', created_at: '2022-11-21 14:21:31' },
    { id: '2', name: 'Lucas Silva', email: 'lucas.silva@gmail.com', address: 'Rua das Palmeiras, 99, São Paulo, SP', created_at: '2023-01-10 08:00:00' },
    { id: '3', name: 'Maria Eduarda', email: 'maria.eduarda@hotmail.com', address: 'Av. Atlantica, 450, Rio de Janeiro, RJ', created_at: '2024-02-12 12:00:00' },
    { id: '4', name: 'Itadori Yuuji', email: 'itadori.yuuji@jujutsu.com', address: 'Kichijoji, Tokyo, Japão', created_at: '2021-06-15 17:45:00' },
    { id: '5', name: 'Lipe Santos', email: 'lipe.santos@holder.dev', address: 'Av. Brasil, 150, Belo Horizonte, MG', created_at: '2022-08-30 09:12:33' }
  ];

  for (const u of users) {
    await userDb.query(
      `INSERT INTO users (id, name, email, address, created_at) VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), address=VALUES(address), created_at=VALUES(created_at)`,
      [u.id, u.name, u.email, u.address, u.created_at]
    );
  }
  console.log('Seed de usuários concluído.');
}

async function seedStats() {
  await statsDb.query(`
    CREATE TABLE IF NOT EXISTS user_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      max_clicks INT DEFAULT 0,
      clicks_per_second FLOAT DEFAULT 0,
      last_click_at DATETIME
    );
  `);

  const stats = [
    { user_id: '1', max_clicks: 37, clicks_per_second: 2.5, last_click_at: '2024-07-13 10:01:10' },
    { user_id: '2', max_clicks: 54, clicks_per_second: 3.9, last_click_at: '2024-07-12 22:55:40' },
    { user_id: '3', max_clicks: 21, clicks_per_second: 1.1, last_click_at: '2024-07-13 09:47:18' },
    { user_id: '4', max_clicks: 78, clicks_per_second: 7.5, last_click_at: '2024-07-13 00:00:00' },
    { user_id: '5', max_clicks: 9, clicks_per_second: 0.2, last_click_at: '2024-07-11 11:11:11' }
  ];

  for (const s of stats) {
    await statsDb.query(
      `INSERT INTO user_stats (user_id, max_clicks, clicks_per_second, last_click_at)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE max_clicks=VALUES(max_clicks), clicks_per_second=VALUES(clicks_per_second), last_click_at=VALUES(last_click_at)`,
      [s.user_id, s.max_clicks, s.clicks_per_second, s.last_click_at]
    );
  }
  console.log('Seed de stats concluído.');
}

async function main() {
  await seedUsers();
  await seedStats();
  await userDb.end();
  await statsDb.end();
  console.log('Seed completo!');
}

main();
