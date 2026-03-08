"use client"

import { useEffect, useRef, useState } from "react"
import { type Language } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"

// easeOutQuart: t => 1 - (1 - t)^4
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

interface SalaryCardProps {
  lang: Language
  icon: string
  level: "junior" | "midlevel" | "senior"
  salary: number
  gradient: string
}

function SalaryCard({ lang, icon, level, salary, gradient }: SalaryCardProps) {
  const t = getTranslations(lang)
  const [animatedValue, setAnimatedValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true
            const duration = 2500
            const start = performance.now()

            const tick = (now: number) => {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = easeOutQuart(progress)
              setAnimatedValue(Math.round(eased * salary))
              if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick)
              } else {
                setAnimatedValue(salary)
              }
            }
            rafRef.current = requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [salary])

  const formatNumber = (num: number): string => {
    if (lang === 'cs') {
      return num.toLocaleString('cs-CZ')
    } else {
      return num.toLocaleString('en-US')
    }
  }

  const levelKey = level === 'junior' ? 'junior' : level === 'midlevel' ? 'midlevel' : 'senior'

  return (
    <div ref={containerRef} className={`bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl p-5 sm:p-6 text-white`}>
      <div className="text-4xl sm:text-5xl mb-3 text-center">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">
        {t.home.salaries[levelKey]}
      </h3>
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl lg:text-3xl">{t.home.salaries.upTo} </span>
        <span>{formatNumber(animatedValue)}</span>
        <span className="text-xl sm:text-2xl lg:text-3xl"> {t.home.salaries.currency}</span>
      </div>
      <p className="text-xs sm:text-sm text-blue-100 text-center leading-relaxed">
        {t.home.salaries.disclaimer}
      </p>
    </div>
  )
}

export default SalaryCard

