'use server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { issues } from '@/lib/db/schema'
import { CATEGORIES, WARDS } from '@/lib/constants'

const text = (f: FormData, k: string) => String(f.get(k) || '').trim()

export async function createIssue(form: FormData) {
  const title = text(form, 'title')
  const description = text(form, 'description')
  const ward = text(form, 'ward')
  const category = text(form, 'category')
  const peopleCount = Number(form.get('peopleCount'))

  if (
    title.length < 5 ||
    description.length < 10 ||
    !WARDS.includes(ward as never) ||
    !CATEGORIES.includes(category as never) ||
    !Number.isInteger(peopleCount) ||
    peopleCount < 1
  ) {
    throw new Error('Please provide valid issue details.')
  }

  await db.insert(issues).values({
    title,
    description,
    ward,
    category,
    peopleCount,
    station: text(form, 'station') || null,
    reporterName: text(form, 'reporterName') || null,
    reporterPhone: text(form, 'reporterPhone') || null,
  })

  revalidatePath('/')
  revalidatePath('/issues')
  revalidatePath('/transparency')
}
