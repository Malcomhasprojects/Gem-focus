'use client'
import { useState } from 'react'
import { CalendarPlus, Pencil, Trash2, X } from 'lucide-react'
import type { CampaignEvent } from '@/lib/types'
import { EVENT_STATUSES, WARDS } from '@/lib/constants'
import { deleteEvent, saveEvent } from '@/lib/api-client'
import { Button } from '@/components/ui/button'

export function AdminEvents({ events, onChanged }: { events: CampaignEvent[]; onChanged: () => void }) {
  const [editing, setEditing] = useState<Partial<CampaignEvent> | null>(null)

  async function handleDelete(id: number) {
    if (!confirm('Delete this event?')) return
    await deleteEvent(id)
    onChanged()
  }

  return (
    <section className="rounded-2xl border bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl">Campaign planner & events</h2>
          <p className="text-sm text-muted-foreground">Schedule and manage field activity.</p>
        </div>
        <Button onClick={() => setEditing({ status: 'scheduled' })}><CalendarPlus data-icon="inline-start" />Schedule event</Button>
      </div>
      <div className="grid gap-3">
        {events.map(x => (
          <div key={x.id} className="flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
            <div>
              <strong>{x.title}</strong>
              <p className="text-sm text-muted-foreground">{x.eventDate} · {x.eventTime.slice(0, 5)} · {x.ward} · {x.venue}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(x)}><Pencil /></Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(x.id)}><Trash2 /></Button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <form
            action={async f => {
              await saveEvent(f)
              setEditing(null)
              onChanged()
            }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl"
          >
            <div className="mb-5 flex justify-between">
              <h3 className="font-serif text-2xl">{editing.id ? 'Edit' : 'Schedule'} event</h3>
              <Button type="button" variant="ghost" size="icon" onClick={() => setEditing(null)}><X /></Button>
            </div>
            <input type="hidden" name="id" value={editing.id || ''} />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Event title"><input required name="title" defaultValue={editing.title || ''} /></F>
              <F label="Ward"><select name="ward" defaultValue={editing.ward || ''} required><option value="">Select</option>{WARDS.map(x => <option key={x}>{x}</option>)}</select></F>
              <F label="Venue"><input required name="venue" defaultValue={editing.venue || ''} /></F>
              <F label="Date"><input required type="date" name="eventDate" defaultValue={editing.eventDate || ''} /></F>
              <F label="Time"><input required type="time" name="eventTime" defaultValue={editing.eventTime || ''} /></F>
              <F label="Status"><select name="status" defaultValue={editing.status || 'scheduled'}>{EVENT_STATUSES.map(x => <option key={x}>{x}</option>)}</select></F>
              <F label="Expected attendance"><input type="number" min="0" name="expectedAttendance" defaultValue={editing.expectedAttendance || ''} /></F>
              <F label="Actual attendance"><input type="number" min="0" name="attendance" defaultValue={editing.attendance || ''} /></F>
            </div>
            <F label="Campaign objective"><textarea required rows={4} name="objective" defaultValue={editing.objective || ''} /></F>
            <Button type="submit" className="mt-4">Save event</Button>
          </form>
        </div>
      )}
    </section>
  )
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-2 text-sm font-medium [&_input]:h-10 [&_input]:rounded-lg [&_input]:border [&_input]:bg-background [&_input]:px-3 [&_select]:h-10 [&_select]:rounded-lg [&_select]:border [&_select]:bg-background [&_select]:px-3 [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:bg-background [&_textarea]:p-3">{label}{children}</label>
}
