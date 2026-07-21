import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Lora } from 'next/font/google'
import { ThemeScript } from '@/components/theme-script'
import './globals.css'
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const serif = Lora({ subsets: ['latin'], variable: '--font-serif' })
export const metadata: Metadata = { title: { default:'Gem Forward', template:'%s | Gem Forward' }, description:'Transparent constituent issue reporting and campaign action across Gem.' }
export const viewport: Viewport = { width:'device-width', initialScale:1, themeColor:[{media:'(prefers-color-scheme: light)',color:'#f5f1e8'},{media:'(prefers-color-scheme: dark)',color:'#111312'}] }
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en" suppressHydrationWarning className="bg-background"><head><ThemeScript /></head><body className={`${sans.variable} ${serif.variable} font-sans antialiased`}>{children}{process.env.NODE_ENV==='production'&&<Analytics />}</body></html> }
