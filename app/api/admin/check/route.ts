import { NextResponse } from 'next/server'
import { isAdminFromCookies } from '@/lib/admin-request'

export async function GET() {
  return NextResponse.json({ ok: await isAdminFromCookies() })
}
