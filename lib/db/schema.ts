import { date, integer, pgTable, serial, text, time, timestamp } from 'drizzle-orm/pg-core'

export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  ward: text('ward').notNull(),
  station: text('station'),
  category: text('category').notNull(),
  priority: text('priority').notNull().default('medium'),
  status: text('status').notNull().default('pending'),
  peopleCount: integer('people_count').notNull().default(1),
  reporterName: text('reporter_name'),
  reporterPhone: text('reporter_phone'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const campaignEvents = pgTable('campaign_events', {
  id: serial('id').primaryKey(), title: text('title').notNull(), ward: text('ward').notNull(),
  venue: text('venue').notNull(), eventDate: date('event_date').notNull(), eventTime: time('event_time').notNull(),
  objective: text('objective').notNull(), status: text('status').notNull().default('scheduled'),
  attendance: integer('attendance'), expectedAttendance: integer('expected_attendance'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const campaignMetrics = pgTable('campaign_metrics', {
  id: serial('id').primaryKey(), metricKey: text('metric_key').notNull().unique(),
  metricValue: integer('metric_value').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Issue = typeof issues.$inferSelect
export type CampaignEvent = typeof campaignEvents.$inferSelect
