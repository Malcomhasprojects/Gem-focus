import 'server-only'
import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE = 'gem_admin_session'
function digest(value: string) { return createHash('sha256').update(value).digest() }
export function validKey(value: string) {
  const expected = process.env.ADMIN_ACCESS_KEY
  if (!expected || !value) return false
  return timingSafeEqual(digest(value), digest(expected))
}
export async function isAdmin() {
  const expected = process.env.ADMIN_ACCESS_KEY
  const token = (await cookies()).get(COOKIE)?.value
  return !!expected && !!token && timingSafeEqual(digest(token), digest(expected))
}
export async function setAdminCookie() {
  const expected = process.env.ADMIN_ACCESS_KEY!
  ;(await cookies()).set(COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
}
export async function clearAdminCookie() { (await cookies()).delete(COOKIE) }
