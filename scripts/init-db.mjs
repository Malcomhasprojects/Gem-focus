import { config } from 'dotenv'
import pg from 'pg'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: new URL('../.env.local', import.meta.url).pathname })

const sql = `
CREATE TABLE IF NOT EXISTS issues (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  ward text NOT NULL,
  station text,
  category text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  people_count integer NOT NULL DEFAULT 1,
  reporter_name text,
  reporter_phone text,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_events (
  id serial PRIMARY KEY,
  title text NOT NULL,
  ward text NOT NULL,
  venue text NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  objective text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  attendance integer,
  expected_attendance integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_metrics (
  id serial PRIMARY KEY,
  metric_key text NOT NULL UNIQUE,
  metric_value integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
`

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
await pool.query(sql)
await pool.end()
console.log('Database tables ready.')
