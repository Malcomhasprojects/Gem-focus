import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { EventsPlanner } from '@/components/events-planner'
import { getEvents } from '@/lib/data'
export const metadata:Metadata={title:'Campaign planner & events'};export const dynamic='force-dynamic'
export default async function EventsPage(){const events=await getEvents();return <><SiteHeader/><main className="mx-auto max-w-6xl px-5 py-10 md:py-16"><header className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Campaign planner</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">Campaign planner & events</h1><p className="mt-3 text-muted-foreground">Grassroots rallies, community assemblies, consultative forums, and town halls across Gem.</p></header><EventsPlanner events={events}/></main></>}
