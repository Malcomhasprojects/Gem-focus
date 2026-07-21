'use client'
import { useEffect } from 'react'

export function ThemeScript() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('gem-theme')
      if (theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme:dark)').matches)) {
        document.documentElement.classList.add('dark')
      }
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }, [])
  return null
}
