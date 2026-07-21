import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { mapEvent, mapIssue } from '@/lib/db/map'
import { campaignEvents, issues } from '@/lib/db/schema'
import { CATEGORIES, WARDS } from '@/lib/constants'
import { buildDashboard } from '@/lib/dashboard'

const text = (form: FormData, key: string) => String(form.get(key) || '').trim()

export async function GET() {
  const rows = await db.select().from(issues).orderBy(desc(issues.createdAt))
  return NextResponse.json(rows.map(mapIssue))
}

export async function POST(request: Request) {
  const form = await request.formData()
  const title = text(form, 'title')
  const description = text(form, 'description')
  const ward = text(form, 'ward')
  const category = text(form, 'category')
  const peopleCount = Number(form.get('peopleCount'))

  if (
    title.length < 5 ||
    description.length < 10 ||
    !WARDS.includes(ward as never) ||
    !CATEGORIES.includes(category as never) ||
    !Number.isInteger(peopleCount) ||
    peopleCount < 1
  ) {
    return NextResponse.json({ error: 'Please provide valid issue details.' }, { status: 400 })
  }

  await db.insert(issues).values({
    title,
    description,
    ward,
    category,
    peopleCount,
    station: text(form, 'station') || null,
    reporterName: text(form, 'reporterName') || null,
    reporterPhone: text(form, 'reporterPhone') || null,
  })

  return NextResponse.json({ ok: true })
}
