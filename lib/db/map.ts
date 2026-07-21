import type { CampaignEvent, Issue } from '@/lib/types'

function toIso(value: Date | string | null | undefined) {
  if (!value) return new Date().toISOString()
  return value instanceof Date ? value.toISOString() : String(value)
}

export function mapIssue(row: {
  id: number
  title: string
  description: string
  ward: string
  station: string | null
  category: string
  priority: string
  status: string
  peopleCount: number
  reporterName: string | null
  reporterPhone: string | null
  adminNotes: string | null
  createdAt: Date | string
  updatedAt: Date | string
}): Issue {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ward: row.ward,
    station: row.station,
    category: row.category,
    priority: row.priority,
    status: row.status,
    peopleCount: row.peopleCount,
    reporterName: row.reporterName,
    reporterPhone: row.reporterPhone,
    adminNotes: row.adminNotes,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  }
}

export function mapEvent(row: {
  id: number
  title: string
  ward: string
  venue: string
  eventDate: string
  eventTime: string
  objective: string
  status: string
  attendance: number | null
  expectedAttendance: number | null
  createdAt: Date | string
  updatedAt: Date | string
}): CampaignEvent {
  return {
    id: row.id,
    title: row.title,
    ward: row.ward,
    venue: row.venue,
    eventDate: String(row.eventDate),
    eventTime: String(row.eventTime),
    objective: row.objective,
    status: row.status,
    attendance: row.attendance,
    expectedAttendance: row.expectedAttendance,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  }
}
