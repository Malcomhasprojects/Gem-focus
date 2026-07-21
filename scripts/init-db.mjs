import { config } from 'dotenv'
import mysql from 'mysql2/promise'

config({ path: new URL('../.env.local', import.meta.url).pathname })

function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  return {
    host: process.env.DB_HOST ?? '127.0.0.1',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'gem_focus',
  }
}

const sql = `
CREATE TABLE IF NOT EXISTS issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  ward VARCHAR(100) NOT NULL,
  station VARCHAR(200) NULL,
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  people_count INT NOT NULL DEFAULT 1,
  reporter_name VARCHAR(200) NULL,
  reporter_phone VARCHAR(50) NULL,
  admin_notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS campaign_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  ward VARCHAR(100) NOT NULL,
  venue VARCHAR(300) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  objective TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  attendance INT NULL,
  expected_attendance INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS campaign_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  metric_key VARCHAR(100) NOT NULL UNIQUE,
  metric_value INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

const connection = await mysql.createConnection(getPoolConfig())
for (const statement of sql.split(';').map(s => s.trim()).filter(Boolean)) {
  await connection.query(statement)
}
await connection.end()
console.log('MySQL tables ready.')
