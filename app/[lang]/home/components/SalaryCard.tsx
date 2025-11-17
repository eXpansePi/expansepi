"use client"

import { useEffect, useRef, useState } from "react"
import anime from "animejs/lib/anime.es.js"
import { type Language } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"

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
  const animationRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // Check if component is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true
            // Start animation
            const anim = anime({
              targets: { value: 0 },
              value: salary,
              duration: 2000,
              easing: 'easeOutCubic',
              update: (anim: any) => {
                setAnimatedValue(Math.floor(anim.progress * salary / 100))
              },
              complete: () => {
                setAnimatedValue(salary)
              }
            })
            animationRef.current = anim
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
      if (animationRef.current) {
        animationRef.current.pause()
      }
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

