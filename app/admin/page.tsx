import type { Metadata } from 'next'
import { AdminPageContent } from '@/components/admin-page-content'

export const metadata: Metadata = { title: 'Campaign administration' }

export default function AdminPage() {
  return <AdminPageContent />
}
