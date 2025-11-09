"use client"

import { useEffect } from "react"

/**
 * Pauses CSS animations when the page is hidden to improve performance
 */
export default function AnimationManager() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const animatedElements = document.querySelectorAll('.glow-outline, .glow-box')
      
      if (document.hidden) {
        // Pause animations when page is hidden
        animatedElements.forEach((el) => {
          const element = el as HTMLElement
          element.style.animationPlayState = 'paused'
        })
      } else {
        // Resume animations when page is visible
        animatedElements.forEach((el) => {
          const element = el as HTMLElement
          element.style.animationPlayState = 'running'
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null
}

