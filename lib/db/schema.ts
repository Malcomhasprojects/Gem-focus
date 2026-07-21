import { date, int, mysqlTable, text, time, timestamp, varchar } from 'drizzle-orm/mysql-core'

export const issues = mysqlTable('issues', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  ward: varchar('ward', { length: 100 }).notNull(),
  station: varchar('station', { length: 200 }),
  category: varchar('category', { length: 100 }).notNull(),
  priority: varchar('priority', { length: 20 }).notNull().default('medium'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  peopleCount: int('people_count').notNull().default(1),
  reporterName: varchar('reporter_name', { length: 200 }),
  reporterPhone: varchar('reporter_phone', { length: 50 }),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export const campaignEvents = mysqlTable('campaign_events', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 500 }).notNull(),
  ward: varchar('ward', { length: 100 }).notNull(),
  venue: varchar('venue', { length: 300 }).notNull(),
  eventDate: date('event_date').notNull(),
  eventTime: time('event_time').notNull(),
  objective: text('objective').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('scheduled'),
  attendance: int('attendance'),
  expectedAttendance: int('expected_attendance'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export const campaignMetrics = mysqlTable('campaign_metrics', {
  id: int('id').primaryKey().autoincrement(),
  metricKey: varchar('metric_key', { length: 100 }).notNull().unique(),
  metricValue: int('metric_value').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
})

export type Issue = typeof issues.$inferSelect
export type CampaignEvent = typeof campaignEvents.$inferSelect
