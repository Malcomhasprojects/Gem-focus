'use client'

import { useEffect, useState } from 'react'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { IssuesList } from '@/components/issues-list'
import { fetchIssues } from '@/lib/api-client'
import type { Issue } from '@/lib/types'

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    fetchIssues().then(setIssues).catch(() => setIssues([]))
  }, [])

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Constituent issues</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">What Gem residents are raising</h1>
          <p className="mt-3 text-muted-foreground">Public, privacy-safe reports classified by category, ward, priority, and action status.</p>
        </header>
        <IssuesList issues={issues} />
      </main>
    </>
  )
}
