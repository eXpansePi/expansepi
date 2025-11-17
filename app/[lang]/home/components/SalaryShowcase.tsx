"use client"

import { useState, useEffect, useRef } from "react"
import { type Language } from "@/i18n/config"

interface SalaryShowcaseProps {
  lang: Language
}

interface SalaryData {
  emoji: string
  label: string
  amount: number
  currency: string
}

export default function SalaryShowcase({ lang }: SalaryShowcaseProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({})
  const [boomEffects, setBoomEffects] = useState<{ [key: string]: boolean }>({})
  const sectionRef = useRef<HTMLDivElement>(null)

  // Salary data based on locale
  const salaryData: SalaryData[] = lang === 'cs'
    ? [
        { emoji: '🔧', label: 'Junior', amount: 70000, currency: 'Kč' },
        { emoji: '⚙️', label: 'Mid-level', amount: 110000, currency: 'Kč' },
        { emoji: '🚀', label: 'Senior', amount: 180000, currency: 'Kč' },
      ]
    : [
        { emoji: '🔧', label: 'Junior', amount: 3500, currency: 'EUR' },
        { emoji: '⚙️', label: 'Mid-level', amount: 5000, currency: 'EUR' },
        { emoji: '🚀', label: 'Senior', amount: 7500, currency: 'EUR' },
      ]

  const tooltipText = lang === 'cs'
    ? 'Hrubá měsíční mzda. Reálné horní hranice podle ČSÚ a praxe.'
    : lang === 'en'
    ? 'Gross monthly salary. Upper realistic ranges based on German market data.'
    : 'Валовая месячная зарплата. Верхние реалистичные диапазоны на основе данных немецкого рынка.'

  const upToText = lang === 'cs' ? 'až' : lang === 'en' ? 'up to' : 'до'

  useEffect(() => {
    if (hasAnimated || !sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            startAnimations()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasAnimated])

  const startAnimations = () => {
    salaryData.forEach((item) => {
      const key = item.label
      animateValue(key, 0, item.amount, 2000) // 2 seconds animation
    })
  }

  const animateValue = (key: string, start: number, end: number, duration: number) => {
    const startTime = performance.now()
    const difference = end - start

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(start + difference * easeOutQuart)

      setAnimatedValues((prev) => ({
        ...prev,
        [key]: current,
      }))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Animation complete - trigger boom effect
        triggerBoomEffect(key)
      }
    }

    requestAnimationFrame(animate)
  }

  const triggerBoomEffect = (key: string) => {
    setBoomEffects((prev) => ({
      ...prev,
      [key]: true,
    }))

    // Reset boom effect after animation
    setTimeout(() => {
      setBoomEffects((prev) => ({
        ...prev,
        [key]: false,
      }))
    }, 400)
  }

  const formatNumber = (num: number, currency: string) => {
    // Format with spaces as thousand separators for Czech, dots for others
    if (currency === 'Kč') {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }
    // For EUR/€ use dots as thousand separators
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const getCurrencyDisplay = (currency: string) => {
    return currency
  }

  return (
    <section ref={sectionRef} className="mb-12 sm:mb-16">
      <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
        {salaryData.map((item) => {
          const currentValue = animatedValues[item.label] || 0
          const isBooming = boomEffects[item.label] || false

          return (
            <div
              key={item.label}
              className="bg-gradient-to-br from-blue-600 to-sky-400 rounded-xl p-8 text-center overflow-hidden"
              style={{
                borderRadius: '12px',
              }}
            >
              <div className="text-4xl sm:text-5xl mb-4">{item.emoji}</div>
              <div className="text-base sm:text-lg md:text-xl font-semibold text-white mb-6">
                {item.label}
              </div>
              <div className="mb-2 flex items-center justify-center flex-nowrap gap-x-2 min-h-[80px] sm:min-h-[90px]">
                <span className="text-base sm:text-lg font-semibold text-blue-100 whitespace-nowrap flex-shrink-0">{upToText}</span>
                <span
                  className="font-bold text-white transition-all duration-300 whitespace-nowrap inline-block"
                  style={{
                    fontSize: isBooming ? 'clamp(52px, 8.5vw, 75px)' : 'clamp(48px, 8vw, 70px)',
                    lineHeight: '1.1',
                    transform: isBooming ? 'scale(1.08)' : 'scale(1)',
                    transformOrigin: 'center center',
                  }}
                >
                  {formatNumber(currentValue, item.currency)}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-4">{getCurrencyDisplay(item.currency)}</div>
              <div className="text-xs text-blue-100 leading-relaxed">
                {tooltipText}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

