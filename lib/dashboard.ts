import type { Dashboard, Issue } from '@/lib/types'

export function buildDashboard(rows: Issue[]): Dashboard {
  const total = rows.reduce((sum, row) => sum + row.peopleCount, 0)
  const resolved = rows.filter(x => x.status === 'resolved').reduce((sum, row) => sum + row.peopleCount, 0)
  const inProgress = rows.filter(x => x.status === 'in-progress').reduce((sum, row) => sum + row.peopleCount, 0)
  return {
    rows,
    total,
    resolved,
    inProgress,
    wards: new Set(rows.map(x => x.ward)).size,
  }
}
