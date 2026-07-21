import 'server-only'
import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { campaignEvents, campaignMetrics, issues } from '@/lib/db/schema'

export async function getIssues() { return db.select().from(issues).orderBy(desc(issues.createdAt)) }
export async function getEvents() { return db.select().from(campaignEvents).orderBy(desc(campaignEvents.eventDate)) }
export async function getMetrics() { return db.select().from(campaignMetrics) }
export async function getDashboard() {
  const rows = await getIssues()
  const total = rows.reduce((sum, row) => sum + row.peopleCount, 0)
  const resolved = rows.filter(x => x.status === 'resolved').reduce((sum, row) => sum + row.peopleCount, 0)
  return { rows, total, resolved, inProgress: rows.filter(x => x.status === 'in-progress').reduce((sum, row) => sum + row.peopleCount, 0), wards: new Set(rows.map(x => x.ward)).size }
}
