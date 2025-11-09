"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function LangSetter() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Extract language from pathname (/cs/..., /en/..., /ru/...)
    const langMatch = pathname.match(/^\/(cs|en|ru)/)
    const lang = langMatch ? langMatch[1] : 'cs'
    
    // Set lang attribute on html element
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [pathname])

  return null
}

