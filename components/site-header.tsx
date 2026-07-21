'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BarChart3, CalendarDays, MapPin, Menu, Moon, Shield, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), [])
  function toggleTheme() { const next = !dark; setDark(next); document.documentElement.classList.toggle('dark', next); localStorage.setItem('gem-theme', next ? 'dark' : 'light') }
  const links = [{ href: '/issues', label: 'Constituent issues', icon: MapPin }, { href: '/transparency', label: 'Transparency', icon: BarChart3 }, { href: '/events', label: 'Events', icon: CalendarDays }, { href: '/admin', label: 'Admin', icon: Shield }]
  return <header className="border-b border-border bg-background/95">
    <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between px-5">
      <Link href="/" className="flex items-center gap-3" aria-label="Gem Forward home"><span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground"><MapPin /></span><span><strong className="block font-serif text-xl leading-none">Gem Forward</strong><small className="text-muted-foreground">Community campaign platform</small></span></Link>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">{links.map(({href,label}) => <Link key={href} href={href} className="text-sm font-medium hover:text-primary">{label}</Link>)}<Button nativeButton={false} render={<Link href="/report" />}>Report an issue</Button><Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle color theme">{dark ? <Sun /> : <Moon />}</Button></nav>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <nav className="flex flex-col gap-2 border-t border-border px-5 py-4 md:hidden" aria-label="Mobile navigation">{links.map(({href,label,icon:Icon}) => <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-muted"><Icon className="size-5" />{label}</Link>)}<Button nativeButton={false} render={<Link href="/report" />} className="mt-2">Report an issue</Button><Button variant="outline" onClick={toggleTheme}>{dark ? 'Use light mode' : 'Use dark mode'}</Button></nav>}
  </header>
}
