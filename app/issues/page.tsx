import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { IssuesList } from '@/components/issues-list'
import { getIssues } from '@/lib/data'
export const metadata:Metadata={title:'Constituent issues'};export const dynamic='force-dynamic'
export default async function IssuesPage(){const issues=await getIssues();return <><SiteHeader/><main className="mx-auto max-w-6xl px-5 py-10 md:py-16"><header className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Constituent issues</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">What Gem residents are raising</h1><p className="mt-3 text-muted-foreground">Public, privacy-safe reports classified by category, ward, priority, and action status.</p></header><IssuesList issues={issues}/></main></>}
