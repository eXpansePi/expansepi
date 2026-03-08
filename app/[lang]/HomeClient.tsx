"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import anime from "animejs/lib/anime.es.js"
import Navigation from "./components/Navigation"
import { getTranslations } from "@/i18n/index"
import { type Language } from "@/i18n/config"
import { getRoutePath } from "@/lib/routes"

// ─── Canvas constants at module scope ─────────────────────────────────────────

const BASE_SPEED = 0.03
const TURN_RATE = 0.008
const REPULSION_STRENGTH = 0.2
const BIRTH_FADE_SPEED = 0.02
const TARGET_FPS = 60
const ELLIPSE_FADE_STRENGTH = 0.7
const MIN_PER_CELL = 2
const MAX_PER_CELL = 8

// ─── Viewport-proportional helpers ────────────────────────────────────────────

/** All distance thresholds scale with the viewport's shorter side */
function getViewportMetrics(w: number, h: number) {
  const short = Math.min(w, h)
  const connectionDist = short * 0.1          // ~108px on mobile, ~150 on 1080p, ~216 on 4K
  const cellSize = connectionDist * 1.5        // spatial grid cell
  const repulsionRadius = connectionDist       // mouse repulsion range
  const ellipseRx = w * 0.36                   // scales with width (≈700px on 1920)
  const ellipseRy = h * 0.42                   // scales with height (≈450px on 1080)
  return { connectionDist, cellSize, repulsionRadius, ellipseRx, ellipseRy }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Node count scales linearly with area — more generous range for all screens */
function calculateNodeCount(width: number, height: number): number {
  const area = width * height
  const baseArea = 1920 * 1080
  const baseCount = 220
  const scaledNodes = Math.round(baseCount * (area / baseArea))
  return Math.max(60, Math.min(400, scaledNodes))
}

type Node = { x: number; y: number; vx: number; vy: number; angle: number; life: number }

// ─── Component ────────────────────────────────────────────────────────────────

interface HomeClientProps {
  lang: Language
}

export default function HomeClient({ lang }: HomeClientProps) {
  const [typedText, setTypedText] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0, active: false })
  const prefersReducedMotion = useRef(false)

  // Check prefers-reduced-motion once on mount
  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const t = getTranslations(lang)
  const fullText = t.home.tagline

  // ── Keyword highlighting for typewriter text ──────────────────────────────

  const renderTypedText = () => {
    const keywords: string[] =
      lang === 'cs'
        ? ['Matfyzu UK', 'ČVUT']
        : lang === 'en'
          ? ['top European universities']
          : ['ведущих европейских университетов']

    const currentLength = typedText.length
    if (currentLength === 0) return null

    const result: React.ReactElement[] = []
    let lastIndex = 0

    for (const keyword of keywords) {
      const index = fullText.indexOf(keyword, lastIndex)
      if (index !== -1 && index < currentLength) {
        if (index > lastIndex) {
          result.push(<span key={`before-${index}`}>{fullText.slice(lastIndex, index)}</span>)
        }
        const keywordEnd = index + keyword.length
        result.push(
          <span key={`keyword-${index}`} className="font-semibold text-blue-600">
            {fullText.slice(index, Math.min(keywordEnd, currentLength))}
          </span>
        )
        lastIndex = keywordEnd
      }
    }

    if (lastIndex < currentLength) {
      result.push(<span key="remaining">{fullText.slice(lastIndex, currentLength)}</span>)
    }

    return result.length > 0 ? <>{result}</> : <span>{typedText}</span>
  }

  // ── Canvas animation ────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Skip canvas animation for users who prefer reduced motion
    if (prefersReducedMotion.current) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.fillStyle = "#f9fafb"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      return
    }

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let nodeCount = calculateNodeCount(width, height)
    let vm = getViewportMetrics(width, height)

    const nodes: Node[] = []

    // ── Jittered-grid spawn: uniform coverage, organic feel ──────────────────
    function spawnNodesUniform(w: number, h: number, count: number) {
      // Derive grid dimensions from desired count
      const aspect = w / h
      const rows = Math.round(Math.sqrt(count / aspect))
      const cols = Math.round(rows * aspect)
      const cellW = w / cols
      const cellH = h / rows
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (nodes.length >= count) return
          const angle = Math.random() * Math.PI * 2
          nodes.push({
            x: c * cellW + Math.random() * cellW,
            y: r * cellH + Math.random() * cellH,
            vx: Math.cos(angle) * BASE_SPEED,
            vy: Math.sin(angle) * BASE_SPEED,
            angle,
            life: 1,
          })
        }
      }
    }
    spawnNodesUniform(width, height, nodeCount)

    // ── Density maintenance ──────────────────────────────────────────────────
    function maintainDensity() {
      const cs = vm.cellSize
      const cols = Math.ceil(width / cs)
      const rows = Math.ceil(height / cs)
      const grid = new Map<number, number[]>()
      for (let i = 0; i < nodes.length; i++) {
        const cx = Math.min(Math.floor(nodes[i].x / cs), cols - 1)
        const cy = Math.min(Math.floor(nodes[i].y / cs), rows - 1)
        const key = cy * cols + cx
        const cell = grid.get(key)
        if (cell) cell.push(i); else grid.set(key, [i])
      }

      const toRemove = new Set<number>()
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const key = cy * cols + cx
          const cell = grid.get(key) ?? []
          const count = cell.length
          if (count < MIN_PER_CELL) {
            const add = MIN_PER_CELL - count
            for (let i = 0; i < add; i++) {
              const ang = Math.random() * Math.PI * 2
              nodes.push({
                x: cx * cs + Math.random() * cs,
                y: cy * cs + Math.random() * cs,
                vx: Math.cos(ang) * BASE_SPEED,
                vy: Math.sin(ang) * BASE_SPEED,
                angle: ang,
                life: 0,
              })
            }
          } else if (count > MAX_PER_CELL) {
            const excess = count - MAX_PER_CELL
            for (let i = 0; i < excess; i++) toRemove.add(cell[i])
          }
        }
      }

      if (toRemove.size > 0) {
        const sorted = Array.from(toRemove).sort((a, b) => b - a)
        for (const idx of sorted) nodes.splice(idx, 1)
      }
    }    // ── Warm-up: 120 physics frames so the network looks naturally dispersed ──
    for (let w = 0; w < 120; w++) {
      for (const n of nodes) {
        n.angle += (Math.random() - 0.5) * TURN_RATE
        n.vx += Math.cos(n.angle) * 0.006
        n.vy += Math.sin(n.angle) * 0.006
        n.x += n.vx
        n.y += n.vy
        n.vx *= 0.95
        n.vy *= 0.95
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }
    }

    let animationFrameId: number | null = null
    let isRunning = true
    let lastTime = performance.now()

    const draw = (now: number = performance.now()) => {
      if (!isRunning) return

      const rawDt = (now - lastTime) / 1000
      lastTime = now
      const dt = Math.min(rawDt, 0.1) * TARGET_FPS // normalize to 60fps equivalent

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "#f9fafb"
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // Update node positions
      for (const n of nodes) {
        n.angle += (Math.random() - 0.5) * TURN_RATE * dt
        n.vx += Math.cos(n.angle) * 0.006 * dt
        n.vy += Math.sin(n.angle) * 0.006 * dt

        if (mouse.current.active) {
          const dx = n.x - mouse.current.x
          const dy = n.y - mouse.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < vm.repulsionRadius && dist > 0) {
            const force = (1 - dist / vm.repulsionRadius) * REPULSION_STRENGTH
            n.vx += (dx / dist) * force * dt
            n.vy += (dy / dist) * force * dt
          }
        }

        n.x += n.vx * dt
        n.y += n.vy * dt
        const damping = Math.pow(0.95, dt)
        n.vx *= damping
        n.vy *= damping

        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        if (n.life < 1) n.life = Math.min(1, n.life + BIRTH_FADE_SPEED * dt)
      }

      const fadeInsideEllipse = (x: number, y: number) => {
        const dx = (x - centerX) / vm.ellipseRx
        const dy = (y - centerY) / vm.ellipseRy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1) {
          const fadeFactor = Math.pow(dist, 2.5) * ELLIPSE_FADE_STRENGTH + (1 - ELLIPSE_FADE_STRENGTH)
          return Math.max(0.02, fadeFactor)
        }
        return 1
      }

      // ── Draw connections using spatial grid (O(n·k) instead of O(n²)) ─────
      const connDist = vm.connectionDist
      const cs = vm.cellSize
      const gridCols = Math.ceil(width / cs)
      const gridRows = Math.ceil(height / cs)
      const grid = new Map<number, number[]>()
      for (let i = 0; i < nodes.length; i++) {
        const gx = Math.min(Math.floor(nodes[i].x / cs), gridCols - 1)
        const gy = Math.min(Math.floor(nodes[i].y / cs), gridRows - 1)
        const key = gy * gridCols + gx
        const cell = grid.get(key)
        if (cell) cell.push(i); else grid.set(key, [i])
      }

      for (const [key, cellNodes] of grid) {
        const cy = Math.floor(key / gridCols)
        const cx = key % gridCols

        // Check this cell and the 4 right/down neighbours to avoid duplicate pairs
        const neighbours = [
          [cx, cy],
          [cx + 1, cy],
          [cx - 1, cy + 1],
          [cx, cy + 1],
          [cx + 1, cy + 1],
        ]

        for (const [nx, ny] of neighbours) {
          if (nx < 0 || ny < 0 || nx >= gridCols || ny >= gridRows) continue
          const nKey = ny * gridCols + nx
          const neighbourNodes = grid.get(nKey)
          if (!neighbourNodes) continue

          const isSameCell = nKey === key
          for (let a = 0; a < cellNodes.length; a++) {
            const startB = isSameCell ? a + 1 : 0
            for (let b = startB; b < neighbourNodes.length; b++) {
              const i = cellNodes[a]
              const j = neighbourNodes[b]
              if (i === j) continue

              const ni = nodes[i]
              const nj = nodes[j]
              const dx = ni.x - nj.x
              const dy = ni.y - nj.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist < connDist) {
                const fade = (ni.life + nj.life) / 2
                const baseAlpha = Math.pow(fade, 2) * (1 - dist / connDist)
                const fade1 = fadeInsideEllipse(ni.x, ni.y)
                const fade2 = fadeInsideEllipse(nj.x, nj.y)
                const avgFade = (fade1 + fade2) / 2
                ctx.strokeStyle = `rgba(37,99,235,${baseAlpha * avgFade})`
                ctx.lineWidth = 0.8 + avgFade * 1.7
                ctx.beginPath()
                ctx.moveTo(ni.x, ni.y)
                ctx.lineTo(nj.x, nj.y)
                ctx.stroke()
              }
            }
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const fade = fadeInsideEllipse(n.x, n.y)
        ctx.fillStyle = `rgba(37,99,235,${n.life * fade})`
        const radius = 2.0 + fade * 1.5
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
        if (animationFrameId === null) draw()
      }
    }

    draw()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // ── Debounced resize ──────────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth
        height = canvas.height = window.innerHeight
        vm = getViewportMetrics(width, height)

        const newNodeCount = calculateNodeCount(width, height)
        if (newNodeCount !== nodeCount) {
          if (newNodeCount > nodeCount) {
            const toAdd = newNodeCount - nodeCount
            for (let i = 0; i < toAdd; i++) {
              const angle = Math.random() * Math.PI * 2
              nodes.push({ x: Math.random() * width, y: Math.random() * height, vx: Math.cos(angle) * BASE_SPEED, vy: Math.sin(angle) * BASE_SPEED, angle, life: 0 })
            }
          } else {
            nodes.splice(newNodeCount)
          }
          nodeCount = newNodeCount
        }
      }, 100)
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
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      if (resizeTimer) clearTimeout(resizeTimer)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(densityInterval)
    }
  }, [])

  // ── Hero entry animations ───────────────────────────────────────────────────

  useEffect(() => {
    // If reduced motion is preferred, show everything instantly without animation
    if (prefersReducedMotion.current) {
      setTypedText(fullText)
      return
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const titleTranslate = isMobile ? '3rem' : '4rem'
    const subtitleTranslate = isMobile ? '1.5rem' : '2rem'
    const buttonTranslate = isMobile ? '1rem' : '1.25rem'

    anime({
      targets: ".hero-title span",
      translateY: [titleTranslate, 0],
      opacity: [0, 1],
      delay: anime.stagger(55),
      easing: "easeOutCubic",
      duration: 750,
    })

    anime({
      targets: ".hero-subtitle",
      opacity: [0, 1],
      translateY: [subtitleTranslate, 0],
      delay: 280,
      easing: "easeOutCubic",
      duration: 600,
    })

    const typewriterDelay = 650
    const typewriterSpeed = 25

    let typeInterval: ReturnType<typeof setInterval> | null = null
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

    const buttonDelay = typewriterDelay + fullText.length * typewriterSpeed + 200
    anime({
      targets: ".cta-button",
      opacity: [0, 1],
      scale: [0.9, 1],
      translateY: [buttonTranslate, 0],
      delay: buttonDelay,
      easing: "easeOutCubic",
      duration: 650,
    })

    anime({
      targets: ".partners-section",
      opacity: [0, 1],
      translateY: [20, 0],
      delay: buttonDelay + 200,
      easing: "easeOutCubic",
      duration: 500,
    })

    return () => {
      clearTimeout(timeoutId)
      if (typeInterval) clearInterval(typeInterval)
    }
  }, [fullText])

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <main className="relative min-h-screen flex flex-col items-center justify-center text-gray-900 overflow-hidden">
        {/* aria-hidden: decorative canvas, irrelevant to assistive technology */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
          style={{ background: "#f9fafb" }}
        />

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

            {/* Typewriter tagline — aria-label carries full text so screen readers get it immediately */}
            <div className="hero-subtitle opacity-0 mb-6 sm:mb-8 px-4">
              <div className="glow-outline inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg max-w-2xl mx-auto">
                <p
                  className="text-sm sm:text-base md:text-lg font-medium text-gray-900"
                  aria-label={fullText}
                  aria-live="off"
                >
                  {renderTypedText()}
                  {typedText.length < fullText.length && (
                    <span aria-hidden="true" className="inline-block w-0.5 h-4 sm:h-5 bg-blue-600 ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 max-w-lg">
              <Link
                href={getRoutePath(lang, 'home')}
                className="cta-button opacity-0 w-full sm:w-64 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 text-center items-center justify-center flex"
              >
                {t.home.cta}
              </Link>
              <Link
                href={getRoutePath(lang, 'about')}
                className="cta-button opacity-0 w-full sm:w-64 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white text-blue-600 font-semibold shadow-md border-2 border-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 text-center items-center justify-center flex"
              >
                {t.home.ctaSecondary}
              </Link>
            </div>

            {/* Partners Section */}
            <div className="partners-section opacity-0 w-full flex flex-col items-center mt-12 sm:mt-16 z-10">
              <p className="text-gray-500 text-sm font-medium mb-6 uppercase tracking-wider">
                {t.home.supportedBy}
              </p>
              <div className="flex flex-wrap justify-center gap-12 sm:gap-16 items-center px-4 max-w-4xl mx-auto">
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
                <a
                  href="https://www.microsoft.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src="/microsoft/microsoft-white.svg"
                    alt="Microsoft"
                    width={120}
                    height={25}
                    className="h-7 sm:h-9 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
