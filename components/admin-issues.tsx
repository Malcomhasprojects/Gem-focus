'use client'
import type { Issue } from '@/lib/types'
import { STATUSES } from '@/lib/constants'
export function AdminIssues({issues}:{issues:Issue[]}){
  return (
    <section className="rounded-2xl border bg-card">
      <div className="border-b p-5">
        <h2 className="font-serif text-2xl">Constituent issues</h2>
        <p className="text-sm text-muted-foreground">Review private contact data. Issues cannot be edited or deleted after reporting.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-4">Issue / details</th>
              <th className="p-4">Location</th>
              <th className="p-4">People</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(x => (
              <tr key={x.id} className="border-t">
                <td className="max-w-md p-4">
                  <strong>{x.title}</strong>
                  <p className="mt-1 text-muted-foreground">{x.description}</p>
                  <small className="text-muted-foreground">Private: {x.reporterName || 'Anonymous'} · {x.reporterPhone || 'No phone'}</small>
                </td>
                <td className="p-4">
                  {x.ward}
                  <small className="block text-muted-foreground">{x.station}</small>
                </td>
                <td className="p-4">{x.peopleCount}</td>
                <td className="p-4 capitalize">{x.priority}</td>
                <td className="p-4 capitalize">{x.status.replace('-', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
