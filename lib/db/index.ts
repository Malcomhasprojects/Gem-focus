import 'server-only'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL
  // Only use DATABASE_URL if it's a valid connection string (contains protocol or @)
  if (url && (url.includes('://') || url.includes('@'))) return url
  
  const host = process.env.DB_HOST
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD ?? ''
  const database = process.env.DB_NAME
  if (host && user && database) {
    const encodedPassword = encodeURIComponent(password)
    return `mysql://${user}:${encodedPassword}@${host}:3306/${database}`
  }
  return undefined
}

const globalForDb = globalThis as unknown as { pool?: mysql.Pool }
const url = getDatabaseUrl()

export const pool =
  globalForDb.pool ??
  mysql.createPool(url ?? 'mysql://root@127.0.0.1:3306/gem_focus')

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool
export const db = drizzle(pool, { schema, mode: 'default' })
