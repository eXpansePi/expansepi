"use client"

import { useEffect, useRef, useState } from "react"
import { type Language } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"

// easeOutQuart: t => 1 - (1 - t)^4
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

interface SalaryStatsProps {
  lang: Language
}

interface MarketReadinessData {
  label: string
  percentage: number
  color: string
}

function SalaryStats({ lang }: SalaryStatsProps) {
  const t = getTranslations(lang)
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([])
  const rafRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)

  const getMarketReadinessData = (): MarketReadinessData[] => {
    const marketReadiness = (t.home as any)?.marketReadiness

    return [
      {
        label: marketReadiness?.commonCourses || 'Běžné IT kurzy',
        percentage: 60,
        color: 'from-slate-500 to-blue-300'
      },
      {
        label: marketReadiness?.expansepi || 'eXpansePi',
        percentage: 100,
        color: 'from-blue-600 via-sky-500 to-emerald-400'
      }
    ]
  }

  useEffect(() => {
    const marketData = getMarketReadinessData()
    setAnimatedPercentages(new Array(marketData.length).fill(0))

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
              setAnimatedPercentages(marketData.map(item => eased * item.percentage))
              if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick)
              } else {
                setAnimatedPercentages(marketData.map(item => item.percentage))
              }
            }
            rafRef.current = requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [lang])

  const marketReadiness = (t.home as any)?.marketReadiness
  const marketData = getMarketReadinessData()

  return (
    <div ref={containerRef} className="w-full">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
        {marketReadiness?.title || 'Připravenost k trhu'}
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {marketData.map((item, index) => {
          const animatedPercentageFloat = animatedPercentages[index] || 0
          const displayPercentage = Math.round(animatedPercentageFloat)

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                {item.label === 'eXpansePi' || item.label === (t.home as any)?.marketReadiness?.expansepi ? (
                  <span className="text-sm sm:text-base font-bold">
                    <span className="text-gray-900">eXpanse</span><span className="text-blue-600">Pi</span>
                  </span>
                ) : (
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    {item.label}
                  </span>
                )}
                <span className="text-lg sm:text-xl font-bold text-gray-900 tabular-nums">
                  {displayPercentage}%
                </span>
              </div>

              {/* Bar Chart */}
              <div className="relative h-6 sm:h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full flex items-center justify-end pr-2 sm:pr-3`}
                  style={{
                    width: `${animatedPercentageFloat}%`,
                    minWidth: animatedPercentageFloat > 0 ? '4px' : '0'
                  }}
                >
                  {displayPercentage > 15 && (
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {displayPercentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SalaryStats
