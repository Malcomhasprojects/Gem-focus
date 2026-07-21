'use client'

import { useState } from 'react'
import { EyeOff, KeyRound } from 'lucide-react'
import { unlockAdmin } from '@/lib/api-client'
import { Button } from '@/components/ui/button'

export function AdminUnlock({ onUnlocked }: { onUnlocked: () => void }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const key = new FormData(event.currentTarget).get('key')
      const result = await unlockAdmin(String(key || ''))
      if (result.ok) onUnlocked()
      else setError(result.message)
    } catch (err) {
      console.error('[v0] Submit error:', err)
      setError('An unexpected error occurred')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-3xl border bg-card">
      <div aria-hidden className="grid blur-md select-none pointer-events-none sm:grid-cols-3">
        <div className="h-48 border p-8">247 reports</div>
        <div className="h-48 border p-8">61% actioned</div>
        <div className="h-48 border p-8">82 resolved</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/55 p-5 backdrop-blur-sm">
        <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border bg-card p-7 shadow-xl">
          <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <EyeOff />
          </span>
          <h2 className="font-serif text-2xl">Protected campaign data</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Enter the campaign administrator key to reveal private reports and management tools.
          </p>
          <label className="mt-5 flex flex-col gap-2 text-sm font-medium">
            Admin access key
            <div className="flex items-center rounded-lg border bg-background px-3">
              <KeyRound className="size-4 text-muted-foreground" />
              <input
                name="key"
                type="password"
                required
                className="h-11 min-w-0 flex-1 bg-transparent px-3 outline-none"
                autoComplete="current-password"
              />
            </div>
          </label>
          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="mt-5 w-full" disabled={busy}>
            {busy ? 'Checking key…' : 'Unlock workspace'}
          </Button>
        </form>
      </div>
    </div>
  )
}
