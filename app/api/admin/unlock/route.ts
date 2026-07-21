import { NextResponse } from 'next/server'
import { adminCookie, validKey } from '@/lib/admin-request'

export async function POST(request: Request) {
  const form = await request.formData()
  const key = String(form.get('key') || '')
  if (!validKey(key)) {
    return NextResponse.json({ ok: false, message: 'Incorrect access key.' })
  }

  await adminCookie(key)
  return NextResponse.json({ ok: true, message: 'Unlocked' })
}
