import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const COOKIE = 'gem_admin_session'

function digest(value: string) {
  return createHash('sha256').update(value).digest()
}

export function validKey(value: string) {
  const expected = process.env.ADMIN_ACCESS_KEY
  if (!expected || !value) return false
  return timingSafeEqual(digest(value), digest(expected))
}

export async function isAdminRequest(request: Request) {
  const expected = process.env.ADMIN_ACCESS_KEY
  if (!expected) return false

  const cookieHeader = request.headers.get('cookie') ?? ''
  const match = cookieHeader.match(/(?:^|;\s*)gem_admin_session=([^;]+)/)
  const token = match?.[1]
  if (!token) return false

  try {
    return timingSafeEqual(digest(decodeURIComponent(token)), digest(expected))
  } catch {
    return false
  }
}

export async function adminCookie(token: string) {
  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
}

export async function clearAdminCookie() {
  const store = await cookies()
  store.delete(COOKIE)
}

export async function isAdminFromCookies() {
  const expected = process.env.ADMIN_ACCESS_KEY
  const token = (await cookies()).get(COOKIE)?.value
  if (!expected || !token) return false
  try {
    return timingSafeEqual(digest(token), digest(expected))
  } catch {
    return false
  }
}
