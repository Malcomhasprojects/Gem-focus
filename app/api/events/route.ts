import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-request'
import { db } from '@/lib/db'
import { mapEvent } from '@/lib/db/map'
import { campaignEvents } from '@/lib/db/schema'

const text = (form: FormData, key: string) => String(form.get(key) || '').trim()

export async function GET() {
  const rows = await db.select().from(campaignEvents).orderBy(desc(campaignEvents.eventDate))
  return NextResponse.json(rows.map(mapEvent))
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await request.formData()
  const id = Number(form.get('id'))
  const values = {
    title: text(form, 'title'),
    ward: text(form, 'ward'),
    venue: text(form, 'venue'),
    eventDate: text(form, 'eventDate'),
    eventTime: text(form, 'eventTime'),
    objective: text(form, 'objective'),
    status: text(form, 'status') || 'scheduled',
    attendance: Number(form.get('attendance')) || null,
    expectedAttendance: Number(form.get('expectedAttendance')) || null,
  }

  if (!values.title || !values.ward || !values.venue || !values.eventDate || !values.eventTime) {
    return NextResponse.json({ error: 'Complete all required fields.' }, { status: 400 })
  }

  if (id) await db.update(campaignEvents).set(values).where(eq(campaignEvents.id, id))
  else await db.insert(campaignEvents).values(values)

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!id) return NextResponse.json({ error: 'Missing event id' }, { status: 400 })

  await db.delete(campaignEvents).where(eq(campaignEvents.id, id))
  return NextResponse.json({ ok: true })
}
