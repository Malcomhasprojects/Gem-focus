import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { mapIssue } from '@/lib/db/map'
import { issues } from '@/lib/db/schema'
import { buildDashboard } from '@/lib/dashboard'

export async function GET() {
  const rows = await db.select().from(issues).orderBy(desc(issues.createdAt))
  return NextResponse.json(buildDashboard(rows.map(mapIssue)))
}
