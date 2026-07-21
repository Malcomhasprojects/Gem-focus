'use client'

import { useEffect, useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { EventsPlanner } from '@/components/events-planner'
import { fetchEvents } from '@/lib/api-client'
import type { CampaignEvent } from '@/lib/types'

export default function EventsPage() {
  const [events, setEvents] = useState<CampaignEvent[]>([])

  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => setEvents([]))
  }, [])

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Campaign planner</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Campaign planner & events</h1>
          <p className="mt-3 text-muted-foreground">Grassroots rallies, community assemblies, consultative forums, and town halls across Gem.</p>
        </header>
        <EventsPlanner events={events} />
      </main>
    </>
  )
}
