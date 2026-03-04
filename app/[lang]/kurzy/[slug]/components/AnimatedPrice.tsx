'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedPriceProps {
    originalPrice: string  // e.g. "49 900 Kč"
    newPrice: string       // e.g. "od 0 Kč" or "0 Kč"
}

export default function AnimatedPrice({ originalPrice, newPrice }: AnimatedPriceProps) {
    const [phase, setPhase] = useState<'initial' | 'striking' | 'revealing' | 'done'>('initial')
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Phase 1: Show original price, then start strikethrough after 600ms
        const t1 = setTimeout(() => setPhase('striking'), 800)
        // Phase 2: After strikethrough animation completes (~600ms), reveal new price
        const t2 = setTimeout(() => setPhase('revealing'), 1500)
        // Phase 3: Mark as done
        const t3 = setTimeout(() => setPhase('done'), 2200)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
        }
    }, [])

    return (
        <div ref={containerRef} className="animated-price-container">
            <div className="flex items-baseline gap-3 flex-wrap">
                {/* New price - appears after strikethrough */}
                <span
                    className={`text-3xl sm:text-4xl font-black text-green-600 tracking-tight transition-all duration-700 ease-out ${phase === 'revealing' || phase === 'done'
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-2 scale-95'
                        }`}
                >
                    {newPrice}
                </span>

                {/* Original price with animated strikethrough */}
                <span className="animated-price-original relative inline-block">
                    <span className={`text-lg sm:text-xl font-bold text-gray-500 transition-opacity duration-500 ${phase === 'initial' ? 'opacity-100' : 'opacity-90'
                        }`}>
                        {originalPrice}
                    </span>

                    {/* Animated red strikethrough line */}
                    <span
                        className={`absolute left-0 top-1/2 h-[4px] bg-red-500 rounded-full transition-all ease-out ${phase === 'initial'
                            ? 'w-0 opacity-0'
                            : 'opacity-100'
                            }`}
                        style={{
                            width: phase === 'initial' ? '0%' : '100%',
                            transitionDuration: '600ms',
                            transform: 'translateY(-50%) rotate(-2deg)',
                            boxShadow: phase !== 'initial' ? '0 1px 3px rgba(239, 68, 68, 0.3)' : 'none',
                        }}
                    />
                </span>
            </div>

            <style jsx>{`
        .animated-price-container {
          position: relative;
        }

        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .animated-price-original {
          display: inline-block;
        }
      `}</style>
        </div>
    )
}
