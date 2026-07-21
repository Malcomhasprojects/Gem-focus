import type { Metadata } from 'next'
import { TransparencyContent } from '@/components/transparency-content'

export const metadata: Metadata = { title: 'Public transparency' }

export default function Transparency() {
  return <TransparencyContent />
}
