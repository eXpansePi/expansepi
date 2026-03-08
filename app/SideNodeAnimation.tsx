"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_SPEED = 0.05
const TURN_RATE = 0.008
const BIRTH_FADE_SPEED = 0.02
const TARGET_FPS = 60
const MIN_PER_CELL = 1
const MAX_PER_CELL = 8

// ─── Viewport-proportional helpers ────────────────────────────────────────────

function getViewportMetrics(w: number, h: number) {
  const short = Math.min(w, h)
  const connectionDist = short * 0.1
  const cellSize = connectionDist * 1.5
  return { connectionDist, cellSize }
}

/** Node count scales linearly with area */
function calculateNodeCount(width: number, height: number): number {
  const area = width * height
  const baseArea = 1920 * 1080
  const baseCount = 220
  const scaledNodes = Math.round(baseCount * (area / baseArea))
  return Math.max(60, Math.min(400, scaledNodes))
}

type Node = { x: number; y: number; vx: number; vy: number; angle: number; life: number }

export default function SideNodeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()

  // We do not want this to run on the main home page (e.g. /cs, /en, /ru, /). 
  // It handles its own animation in HomeClient.tsx.
  const isHomePage = pathname === '/' || /^\/[a-z]{2}$/.test(pathname)

  useEffect(() => {
    if (isHomePage) return

    // Skip animation on mobile devices for better performance
    if (typeof window !== 'undefined' && window.innerWidth < 768) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let nodeCount = calculateNodeCount(width, height)
    let vm = getViewportMetrics(width, height)

    const nodes: Node[] = []

    // ── Jittered-grid spawn: uniform coverage, organic feel ──────────────────
    function spawnNodesUniform(w: number, h: number, count: number) {
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
          // Only maintain density on the sides
          const cellXCenter = cx * cs + cs / 2
          const distFromCenter = Math.abs(cellXCenter - width / 2)
          if (distFromCenter < width * 0.3) continue

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
    }

    // ── Warm-up: 120 physics frames so the network looks naturally dispersed ──
    for (let w = 0; w < 120; w++) {
      for (const n of nodes) {
        n.angle += (Math.random() - 0.5) * TURN_RATE
        n.vx += Math.cos(n.angle) * 0.006
        n.vy += Math.sin(n.angle) * 0.006
        n.x += n.vx
        n.y += n.vy
        n.vx *= 0.95
        n.vy *= 0.95
        if (n.x < -150) n.x = width + 150
        else if (n.x > width + 150) n.x = -150
        if (n.y < -150) n.y = height + 150
        else if (n.y > height + 150) n.y = -150
      }
    }

    let animationFrameId: number | null = null
    let isRunning = true
    let lastTime = performance.now()

    const draw = (now: number = performance.now()) => {
      if (!isRunning) return

      const rawDt = (now - lastTime) / 1000
      lastTime = now
      const dt = Math.min(rawDt, 0.1) * TARGET_FPS

      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const connDist = vm.connectionDist

      for (const n of nodes) {
        n.angle += (Math.random() - 0.5) * TURN_RATE * dt
        n.vx += Math.cos(n.angle) * 0.006 * dt
        n.vy += Math.sin(n.angle) * 0.006 * dt

        n.x += n.vx * dt
        n.y += n.vy * dt
        const damping = Math.pow(0.95, dt)
        n.vx *= damping
        n.vy *= damping

        if (n.x < -150) n.x = width + 150
        else if (n.x > width + 150) n.x = -150
        if (n.y < -150) n.y = height + 150
        else if (n.y > height + 150) n.y = -150

        if (n.life < 1) n.life = Math.min(1, n.life + BIRTH_FADE_SPEED * dt)
      }

      const fadeInsideCenter = (x: number) => {
        const distFromCenter = Math.abs(x - centerX)
        const emptyWidth = Math.min(800, width * 0.35)
        const edgeGradientWidth = Math.min(200, width * 0.1)

        if (distFromCenter < emptyWidth) return 0
        if (distFromCenter < emptyWidth + edgeGradientWidth) {
          const normDist = (distFromCenter - emptyWidth) / edgeGradientWidth
          return Math.pow(normDist, 2)
        }
        return 1
      }

      // ── Draw connections using spatial grid (O(n·k) instead of O(n²)) ─────
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
                const fade1 = fadeInsideCenter(ni.x)
                const fade2 = fadeInsideCenter(nj.x)
                const avgFade = (fade1 + fade2) / 2

                if (avgFade > 0.01) {
                  const combined = baseAlpha * avgFade
                  ctx.strokeStyle = `rgba(37, 99, 235,${combined})`
                  ctx.lineWidth = 0.8 + (avgFade * 1.7)
                  ctx.beginPath()
                  ctx.moveTo(ni.x, ni.y)
                  ctx.lineTo(nj.x, nj.y)
                  ctx.stroke()
                }
              }
            }
          }
        }
      }

      for (const n of nodes) {
        const fade = fadeInsideCenter(n.x)
        if (fade > 0.01) {
          ctx.fillStyle = `rgba(37, 99, 235,${n.life * fade})`
          const radius = 2.0 + (fade * 1.5)
          ctx.beginPath()
          ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI)
          ctx.fill()
        }
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
      vm = getViewportMetrics(width, height)

      const newNodeCount = calculateNodeCount(width, height)

      if (newNodeCount !== nodeCount) {
        if (newNodeCount > nodeCount) {
          const toAdd = newNodeCount - nodeCount
          for (let i = 0; i < toAdd; i++) {
            const angle = Math.random() * Math.PI * 2
            nodes.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: Math.cos(angle) * BASE_SPEED,
              vy: Math.sin(angle) * BASE_SPEED,
              angle,
              life: 0,
            })
          }
        } else {
          nodes.splice(newNodeCount)
        }
        nodeCount = newNodeCount
      }
    }

    window.addEventListener("resize", handleResize)
    const densityInterval = setInterval(maintainDensity, 3000)

    return () => {
      isRunning = false
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      window.removeEventListener("resize", handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(densityInterval)
    }
  }, [isHomePage])

  if (isHomePage) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
