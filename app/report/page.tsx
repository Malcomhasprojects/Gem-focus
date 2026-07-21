import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { IssueForm } from '@/components/issue-form'
export const metadata:Metadata={title:'Report an issue'}
export default function ReportPage(){return <><SiteHeader/><main className="mx-auto max-w-3xl px-5 py-10 md:py-16"><header className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Community reporting</p><h1 className="mt-3 text-balance font-serif text-4xl sm:text-5xl">Tell the campaign what your community needs.</h1><p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">One report can represent one person or a whole group. Submissions appear publicly without names or phone numbers.</p></header><section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8"><IssueForm/></section><p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4"/>This platform is campaign-operated and is not an emergency service.</p></main></>}
