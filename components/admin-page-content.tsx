'use client'

import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { checkAdmin, fetchEvents, fetchIssues, logoutAdmin } from '@/lib/api-client'
import type { CampaignEvent, Issue } from '@/lib/types'
import { SiteHeader } from '@/components/site-header'
import { AdminUnlock } from '@/components/admin-unlock'
import { AdminIssues } from '@/components/admin-issues'
import { AdminEvents } from '@/components/admin-events'
import { Button } from '@/components/ui/button'

export function AdminPageContent() {
  const [unlocked, setUnlocked] = useState(false)
  const [issues, setIssues] = useState<Issue[]>([])
  const [events, setEvents] = useState<CampaignEvent[]>([])

  async function refreshAdminData() {
    const isUnlocked = await checkAdmin()
    setUnlocked(isUnlocked)
    if (isUnlocked) {
      const [issueRows, eventRows] = await Promise.all([fetchIssues(), fetchEvents()])
      setIssues(issueRows)
      setEvents(eventRows)
    }
  }

  useEffect(() => {
    refreshAdminData()
  }, [])

  async function onLogout() {
    await logoutAdmin()
    setUnlocked(false)
    setIssues([])
    setEvents([])
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Campaign operations</p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Administration</h1>
            <p className="mt-3 text-muted-foreground">Manage constituent reports, campaign events, and published metrics.</p>
          </div>
          {unlocked && (
            <Button type="button" variant="outline" onClick={onLogout}>
              <LogOut data-icon="inline-start" />Lock workspace
            </Button>
          )}
        </header>
        {!unlocked ? (
          <AdminUnlock onUnlocked={refreshAdminData} />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Issue reports" value={issues.length} />
              <Stat label="People represented" value={issues.reduce((s, x) => s + x.peopleCount, 0)} />
              <Stat label="Campaign events" value={events.length} />
            </div>
            <AdminIssues issues={issues} />
            <AdminEvents events={events} onChanged={refreshAdminData} />
          </div>
        )}
      </main>
    </>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <strong className="mt-2 block font-serif text-4xl">{value}</strong>
    </section>
  )
}
