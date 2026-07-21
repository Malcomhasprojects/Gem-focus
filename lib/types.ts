export type Issue = {
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
  createdAt: string
  updatedAt: string
}

export type CampaignEvent = {
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
  createdAt: string
  updatedAt: string
}

export type CampaignMetric = {
  id: number
  metricKey: string
  metricValue: number
  updatedAt: string
}

export type Dashboard = {
  rows: Issue[]
  total: number
  resolved: number
  inProgress: number
  wards: number
}
