import type { Metadata } from 'next'
import { LogOut } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { AdminUnlock } from '@/components/admin-unlock'
import { AdminIssues } from '@/components/admin-issues'
import { AdminEvents } from '@/components/admin-events'
import { Button } from '@/components/ui/button'
import { isAdmin } from '@/lib/admin-auth'
import { getEvents, getIssues } from '@/lib/data'
import { logoutAdmin } from '@/app/actions/admin'
export const metadata:Metadata={title:'Campaign administration'};export const dynamic='force-dynamic'
export default async function AdminPage(){const unlocked=await isAdmin();const [issues,events]=unlocked?await Promise.all([getIssues(),getEvents()]):[[],[]];return <><SiteHeader/><main className="mx-auto max-w-7xl px-5 py-10"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Campaign operations</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">Administration</h1><p className="mt-3 text-muted-foreground">Manage constituent reports, campaign events, and published metrics.</p></div>{unlocked&&<form action={logoutAdmin}><Button type="submit" variant="outline"><LogOut data-icon="inline-start"/>Lock workspace</Button></form>}</header>{!unlocked?<AdminUnlock/>:<div className="flex flex-col gap-6"><div className="grid gap-4 sm:grid-cols-3"><Stat label="Issue reports" value={issues.length}/><Stat label="People represented" value={issues.reduce((s,x)=>s+x.peopleCount,0)}/><Stat label="Campaign events" value={events.length}/></div><AdminIssues issues={issues}/><AdminEvents events={events}/></div>}</main></>}
function Stat({label,value}:{label:string,value:number}){return <section className="rounded-2xl border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><strong className="mt-2 block font-serif text-4xl">{value}</strong></section>}
