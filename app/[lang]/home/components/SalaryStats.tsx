"use client"

import { useEffect, useRef, useState } from "react"
import anime from "animejs/lib/anime.es.js"
import { type Language } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"

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
  const animationRef = useRef<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)

  const getMarketReadinessData = (): MarketReadinessData[] => {
    const marketReadiness = (t.home as any)?.marketReadiness
    
    return [
      {
        label: marketReadiness?.commonCourses || 'Běžné IT kurzy',
        percentage: 60,
        color: 'from-blue-600 to-sky-400'
      },
      {
        label: marketReadiness?.expansepi || 'eXpansePi',
        percentage: 100,
        color: 'from-blue-600 to-sky-400'
      }
    ]
  }

  useEffect(() => {
    const marketData = getMarketReadinessData()
    // Initialize animated values to 0
    setAnimatedPercentages(new Array(marketData.length).fill(0))

    // Check if component is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true
            // Start animations
            const animations: any[] = []
            
            marketData.forEach((item, index) => {
              const target = { value: 0 }
              const anim = anime({
                targets: target,
                value: item.percentage,
                duration: 2500,
                delay: 0, // Start both animations at the same time
                easing: 'easeOutQuart',
                update: () => {
                  setAnimatedPercentages((prev) => {
                    const newValues = [...prev]
                    newValues[index] = Math.round(target.value)
                    return newValues
                  })
                },
                complete: () => {
                  setAnimatedPercentages((prev) => {
                    const newValues = [...prev]
                    newValues[index] = item.percentage
                    return newValues
                  })
                }
              })
              animations.push(anim)
            })

            animationRef.current = animations
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
      animationRef.current.forEach((anim) => anim.pause())
    }
  }, [lang, t])

  const marketReadiness = (t.home as any)?.marketReadiness
  const marketData = getMarketReadinessData()
  
  return (
    <div ref={containerRef} className="w-full">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
        {marketReadiness?.title || 'Připravenost k trhu'}
      </h3>
      
      <div className="space-y-4 sm:space-y-6">
        {marketData.map((item, index) => {
          const animatedPercentage = animatedPercentages[index] || 0
          
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
                  {animatedPercentage}%
                </span>
              </div>
              
              {/* Bar Chart */}
              <div className="relative h-6 sm:h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-300 flex items-center justify-end pr-2 sm:pr-3`}
                  style={{
                    width: `${animatedPercentage}%`,
                    minWidth: animatedPercentage > 0 ? '4px' : '0'
                  }}
                >
                  {animatedPercentage > 15 && (
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {animatedPercentage}%
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
