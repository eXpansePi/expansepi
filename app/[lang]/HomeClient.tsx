"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import anime from "animejs/lib/anime.es.js"
import Navigation from "./components/Navigation"
import { getTranslations } from "@/i18n/index"
import { type Language } from "@/i18n/config"
import { getRoutePath } from "@/lib/routes"

interface HomeClientProps {
  lang: Language
}

export default function HomeClient({ lang }: HomeClientProps) {
  const [typedText, setTypedText] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0, active: false })

  const t = getTranslations(lang)
  const fullText = t.home.tagline

  const renderTypedText = () => {
    // Find keywords to highlight (university names, etc.)
    const keywords = lang === 'cs'
      ? ['Matfyzu UK', 'ČVUT']
      : lang === 'en'
        ? ['top European universities']
        : ['ведущих европейских университетов']

    let currentLength = typedText.length
    if (currentLength === 0) return null

    let result: React.ReactElement[] = []
    let lastIndex = 0

    for (const keyword of keywords) {
      const index = fullText.indexOf(keyword, lastIndex)
      if (index !== -1 && index < currentLength) {
        // Add text before keyword
        if (index > lastIndex) {
          result.push(<span key={`before-${index}`}>{fullText.slice(lastIndex, index)}</span>)
        }
        // Add highlighted keyword
        const keywordEnd = index + keyword.length
        if (keywordEnd <= currentLength) {
          result.push(
            <span key={`keyword-${index}`} className="font-semibold text-blue-600">
              {fullText.slice(index, keywordEnd)}
            </span>
          )
        } else if (index < currentLength) {
          result.push(
            <span key={`keyword-${index}`} className="font-semibold text-blue-600">
              {fullText.slice(index, currentLength)}
            </span>
          )
        }
        lastIndex = keywordEnd
      }
    }

    // Add remaining text
    if (lastIndex < currentLength) {
      result.push(<span key="remaining">{fullText.slice(lastIndex, currentLength)}</span>)
    }

    return result.length > 0 ? <>{result}</> : <span>{typedText}</span>
  }

  const BASE_SPEED = 0.05
  const TURN_RATE = 0.01
  const REPULSION_RADIUS = 150
  const REPULSION_STRENGTH = 0.2
  // Base node count for large screens (maintains original behavior)
  const BASE_NODE_COUNT = 180
  const CONNECTION_DISTANCE = 150
  const BIRTH_FADE_SPEED = 0.002
  const ELLIPSE_RADIUS_X = 700
  const ELLIPSE_RADIUS_Y = 600
  const ELLIPSE_FADE_STRENGTH = 0.7

  // Calculate responsive node count based on screen size
  const calculateNodeCount = (width: number, height: number): number => {
    const area = width * height
    // Base area for large screens (1920x1080 = 2,073,600)
    const baseArea = 1920 * 1080
    // Minimum node count for very small screens
    const minNodes = 40
    // Maximum node count (for large screens, maintain original)
    const maxNodes = BASE_NODE_COUNT

    // Calculate density ratio
    const densityRatio = area / baseArea

    // Scale nodes based on area, but cap at maxNodes for large screens
    // Use a square root scaling to reduce nodes more aggressively on small screens
    const scaledNodes = Math.floor(BASE_NODE_COUNT * Math.sqrt(densityRatio))

    // Clamp between min and max
    return Math.max(minNodes, Math.min(maxNodes, scaledNodes))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Calculate node count based on current screen size
    let nodeCount = calculateNodeCount(width, height)

    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      angle: number
      life: number
    }> = Array.from({ length: nodeCount }, () => {
      const angle = Math.random() * Math.PI * 2
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * BASE_SPEED,
        vy: Math.sin(angle) * BASE_SPEED,
        angle,
        life: 1,
      }
    })

    function maintainDensity() {
      const cellSize = 200
      const minPerCell = 2
      const maxPerCell = 8
      const cols = Math.ceil(width / cellSize)
      const rows = Math.ceil(height / cellSize)
      const grid = Array.from({ length: cols * rows }, () => 0)

      for (const n of nodes) {
        const cx = Math.floor(n.x / cellSize)
        const cy = Math.floor(n.y / cellSize)
        const idx = cy * cols + cx
        if (grid[idx] !== undefined) grid[idx]++
      }

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const count = grid[cy * cols + cx]
          if (count < minPerCell) {
            const add = minPerCell - count
            for (let i = 0; i < add; i++) {
              const ang = Math.random() * Math.PI * 2
              nodes.push({
                x: cx * cellSize + Math.random() * cellSize,
                y: cy * cellSize + Math.random() * cellSize,
                vx: Math.cos(ang) * BASE_SPEED,
                vy: Math.sin(ang) * BASE_SPEED,
                angle: ang,
                life: 0,
              })
            }
          } else if (count > maxPerCell) {
            nodes.splice(0, count - maxPerCell)
          }
        }
      }
    }

    let animationFrameId: number | null = null
    let isRunning = true

    const draw = () => {
      if (!isRunning) return

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "#f9fafb"
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      for (const n of nodes) {
        n.angle += (Math.random() - 0.5) * TURN_RATE
        n.vx += Math.cos(n.angle) * 0.01
        n.vy += Math.sin(n.angle) * 0.01

        if (mouse.current.active) {
          const dx = n.x - mouse.current.x
          const dy = n.y - mouse.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < REPULSION_RADIUS && dist > 0) {
            const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH
            n.vx += (dx / dist) * force
            n.vy += (dy / dist) * force
          }
        }

        n.x += n.vx
        n.y += n.vy
        n.vx *= 0.95
        n.vy *= 0.95

        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1

        if (n.life < 1) n.life = Math.min(1, n.life + BIRTH_FADE_SPEED)
      }

      const fadeInsideEllipse = (x: number, y: number) => {
        const dx = (x - centerX) / ELLIPSE_RADIUS_X
        const dy = (y - centerY) / ELLIPSE_RADIUS_Y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1) {
          // More aggressive fade: use higher power for smoother, more transparent center
          const fadeFactor = Math.pow(dist, 2.5) * ELLIPSE_FADE_STRENGTH + (1 - ELLIPSE_FADE_STRENGTH)
          return Math.max(0.02, fadeFactor)
        }
        return 1
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const fade = (nodes[i].life + nodes[j].life) / 2
            const baseAlpha = Math.pow(fade, 2) * (1 - dist / CONNECTION_DISTANCE)
            const fade1 = fadeInsideEllipse(nodes[i].x, nodes[i].y)
            const fade2 = fadeInsideEllipse(nodes[j].x, nodes[j].y)
            const avgFade = (fade1 + fade2) / 2
            const combined = baseAlpha * avgFade
            ctx.strokeStyle = `rgba(37, 99, 235,${combined})`
            // Make edges thinner in the center area: scale from 2.5 (edges) to 0.8 (center)
            ctx.lineWidth = 0.8 + (avgFade * 1.7)
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        const fade = fadeInsideEllipse(n.x, n.y)
        ctx.fillStyle = `rgba(37, 99, 235,${n.life * fade})`
        // Make vertices smaller in the center area: scale from 3.5 (edges) to 2.0 (center)
        const radius = 2.0 + (fade * 1.5)
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
      } else {
        isRunning = true
        if (animationFrameId === null) {
          draw()
        }
      }
    }

    draw()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight

      // Recalculate node count on resize
      const newNodeCount = calculateNodeCount(width, height)

      // Adjust nodes array if count changed
      if (newNodeCount !== nodeCount) {
        if (newNodeCount > nodeCount) {
          // Add nodes
          const toAdd = newNodeCount - nodeCount
          for (let i = 0; i < toAdd; i++) {
            const angle = Math.random() * Math.PI * 2
            nodes.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: Math.cos(angle) * BASE_SPEED,
              vy: Math.sin(angle) * BASE_SPEED,
              angle,
              life: 0, // Start fading in
            })
          }
        } else {
          // Remove nodes (remove from end)
          nodes.splice(newNodeCount)
        }
        nodeCount = newNodeCount
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      mouse.current.active = true
    }

    const handleMouseLeave = () => (mouse.current.active = false)

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    const densityInterval = setInterval(maintainDensity, 3000)

    return () => {
      isRunning = false
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(densityInterval)
    }
  }, [])

  useEffect(() => {
    // Calculate responsive values based on viewport
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const titleTranslate = isMobile ? '3rem' : '4rem'
    const subtitleTranslate = isMobile ? '1.5rem' : '2rem'
    const buttonTranslate = isMobile ? '1rem' : '1.25rem'

    anime({
      targets: ".hero-title span",
      translateY: [titleTranslate, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: "easeOutCubic",
      duration: 1200,
    })

    anime({
      targets: ".hero-subtitle",
      opacity: [0, 1],
      translateY: [subtitleTranslate, 0],
      delay: 500,
      easing: "easeOutCubic",
      duration: 1000,
    })

    const typewriterDelay = 1200
    const typewriterSpeed = 30

    let typeInterval: NodeJS.Timeout | null = null
    const timeoutId = setTimeout(() => {
      let currentIndex = 0
      typeInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex))
          currentIndex++
        } else {
          if (typeInterval) clearInterval(typeInterval)
        }
      }, typewriterSpeed)
    }, typewriterDelay)

    const buttonDelay = typewriterDelay + fullText.length * typewriterSpeed + 300
    anime({
      targets: ".cta-button",
      opacity: [0, 1],
      scale: [0.9, 1],
      translateY: [buttonTranslate, 0],
      delay: buttonDelay,
      easing: "easeOutCubic",
      duration: 800,
    })

    anime({
      targets: ".partners-section",
      opacity: [0, 1],
      translateY: [20, 0],
      delay: buttonDelay + 400,
      easing: "easeOutCubic",
      duration: 800,
    })

    return () => {
      clearTimeout(timeoutId)
      if (typeInterval) clearInterval(typeInterval)
    }
  }, [fullText])

  return (
    <>
      <main className="relative min-h-screen flex flex-col items-center justify-center text-gray-900 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#f9fafb" }} />

        <Navigation activePage={`/${lang}`} lang={lang} t={t} />

        {/* Hero Section */}
        <section className="hero-section absolute inset-0 flex flex-col items-center text-center transition-all px-4 sm:px-6 pt-16 sm:pt-20 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center w-full pb-10">
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-sm">
              <span className="inline-block text-gray-900">eXpanse</span>
              <span className="inline-block text-blue-600 ml-1">Pi</span>
            </h1>

            <p className="hero-subtitle text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 opacity-0 px-4 drop-shadow-sm">
              {t.home.subtitle}
            </p>

            <div className="hero-subtitle opacity-0 mb-6 sm:mb-8 px-4">
              <div className="glow-outline inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg">
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900">
                  {renderTypedText()}
                  {typedText.length < fullText.length && (
                    <span className="inline-block w-0.5 h-4 sm:h-5 bg-blue-600 ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={getRoutePath(lang, 'home')}
                className="cta-button opacity-0 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg text-center"
              >
                {t.home.cta}
              </Link>
              <Link
                href={getRoutePath(lang, 'about')}
                className="cta-button opacity-0 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white text-blue-600 font-semibold shadow-md border-2 border-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-lg text-center"
              >
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Partners Section */}
          <div className="partners-section opacity-0 w-full flex flex-col items-center pb-8 sm:pb-12 z-10 shrink-0">
            <p className="text-gray-500 text-sm font-medium mb-6 uppercase tracking-wider">
              {t.home.supportedBy}
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center px-4 max-w-4xl mx-auto">
              <a
                href="https://www.jetbrains.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src="/jetbrains/jetbrains.svg"
                  alt="JetBrains"
                  width={100}
                  height={100}
                  className="h-8 sm:h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

