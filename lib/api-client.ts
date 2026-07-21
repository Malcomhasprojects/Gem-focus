import type { CampaignEvent, Dashboard, Issue } from '@/lib/types'

const base = process.env.NEXT_PUBLIC_API_URL ?? '/api'
const ext = process.env.NEXT_PUBLIC_API_EXT ?? (process.env.NODE_ENV === 'development' ? '' : '.php')

function endpoint(path: string) {
  return `${base}${path}${ext}`
}

async function parse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Request failed')
  return data as T
}

export async function fetchIssues(): Promise<Issue[]> {
  return parse(await fetch(endpoint('/issues'), { cache: 'no-store' }))
}

export async function fetchEvents(): Promise<CampaignEvent[]> {
  return parse(await fetch(endpoint('/events'), { cache: 'no-store' }))
}

export async function fetchDashboard(): Promise<Dashboard> {
  return parse(await fetch(endpoint('/dashboard'), { cache: 'no-store' }))
}

export async function createIssue(form: FormData): Promise<void> {
  await parse(await fetch(endpoint('/issues'), { method: 'POST', body: form }))
}

export async function saveEvent(form: FormData): Promise<void> {
  await parse(await fetch(endpoint('/events'), { method: 'POST', body: form }))
}

export async function deleteEvent(id: number): Promise<void> {
  await parse(await fetch(`${endpoint('/events')}?id=${id}`, { method: 'DELETE' }))
}

export async function unlockAdmin(key: string): Promise<{ ok: boolean; message: string }> {
  try {
    const form = new FormData()
    form.set('key', key)
    const res = await fetch(endpoint('/admin/unlock'), { method: 'POST', body: form, credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    
    if (!res.ok) {
      return {
        ok: false,
        message: (data as { message?: string }).message ?? 'Authentication failed',
      }
    }
    return data as { ok: boolean; message: string }
  } catch (error) {
    console.error('[v0] Unlock error:', error)
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

export async function logoutAdmin(): Promise<void> {
  await parse(await fetch(endpoint('/admin/logout'), { method: 'POST', credentials: 'include' }))
}

export async function checkAdmin(): Promise<boolean> {
  const data = await parse<{ ok: boolean }>(await fetch(endpoint('/admin/check'), { credentials: 'include', cache: 'no-store' }))
  return data.ok
}
