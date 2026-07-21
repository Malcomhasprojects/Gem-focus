import { NextResponse } from 'next/server'
import { adminCookie, validKey } from '@/lib/admin-request'

export async function POST(request: Request) {
  try {
    if (!process.env.ADMIN_ACCESS_KEY) {
      return NextResponse.json({ ok: false, message: 'Admin authentication not configured.' }, { status: 500 })
    }

    const form = await request.formData()
    const key = String(form.get('key') || '')
    if (!validKey(key)) {
      return NextResponse.json({ ok: false, message: 'Incorrect access key.' })
    }

    await adminCookie(key)
    return NextResponse.json({ ok: true, message: 'Unlocked' })
  } catch (error) {
    console.error('[v0] Admin unlock error:', error)
    return NextResponse.json({ ok: false, message: 'Authentication failed. Please try again.' }, { status: 500 })
  }
}
