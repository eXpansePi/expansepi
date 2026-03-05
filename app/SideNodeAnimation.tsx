"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function SideNodeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()

  // We do not want this to run on the main home page (e.g. /cs, /en, /ru, /). 
  // It handles its own animation in HomeClient.tsx.
  const isHomePage = pathname === '/' || /^\/[a-z]{2}$/.test(pathname)

  const BASE_SPEED = 0.05
  const TURN_RATE = 0.008
  const BASE_NODE_COUNT = 180
  const CONNECTION_DISTANCE = 150
  const BIRTH_FADE_SPEED = 0.002
  const TARGET_FPS = 60

  const calculateNodeCount = (width: number, height: number): number => {
    const area = width * height
    const baseArea = 1920 * 1080
    const minNodes = 40
    const maxNodes = BASE_NODE_COUNT
    const densityRatio = area / baseArea
    const scaledNodes = Math.floor(BASE_NODE_COUNT * Math.sqrt(densityRatio))
    return Math.max(minNodes, Math.min(maxNodes, scaledNodes))
  }

  useEffect(() => {
    if (isHomePage) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
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
      // Spawn nodes mostly on the sides to be efficient
      const isLeft = Math.random() > 0.5
      return {
        x: isLeft ? Math.random() * (width * 0.25) : width - Math.random() * (width * 0.25),
        y: Math.random() * height,
        vx: Math.cos(angle) * BASE_SPEED,
        vy: Math.sin(angle) * BASE_SPEED,
        angle,
        life: 1,
      }
    })

    function maintainDensity() {
      const cellSize = 200
      const minPerCell = 1
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
          // Only maintain density on the sides
          const cellXCenteredDist = Math.abs((cx * cellSize + cellSize / 2) - width / 2)
          if (cellXCenteredDist < width * 0.3) {
            continue // Ignore center area where nodes are invisible anyway
          }

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
    let lastTime = performance.now()

    const draw = (now: number = performance.now()) => {
      if (!isRunning) return

      const rawDt = (now - lastTime) / 1000
      lastTime = now
      const dt = Math.min(rawDt, 0.1) * TARGET_FPS // normalize to 60fps equivalent

      ctx.clearRect(0, 0, width, height)
      // ctx.fillStyle = "#f9fafb" 
      // Do not fill background here to avoid covering page content.
      // Layout should have relative positioning.

      const centerX = width / 2

      for (const n of nodes) {
        n.angle += (Math.random() - 0.5) * TURN_RATE * dt
        n.vx += Math.cos(n.angle) * 0.006 * dt
        n.vy += Math.sin(n.angle) * 0.006 * dt

        n.x += n.vx * dt
        n.y += n.vy * dt
        const damping = Math.pow(0.95, dt)
        n.vx *= damping
        n.vy *= damping

        // Wrap around gracefully off-screen to prevent wall-hugging and snapping.
        // We use +/- 150 because CONNECTION_DISTANCE is 150, so links seamlessly fade out.
        if (n.x < -150) n.x = width + 150
        else if (n.x > width + 150) n.x = -150

        if (n.y < -150) n.y = height + 150
        else if (n.y > height + 150) n.y = -150

        if (n.life < 1) n.life = Math.min(1, n.life + BIRTH_FADE_SPEED * dt)
      }

      const fadeInsideCenter = (x: number) => {
        // We want to fade out towards the center
        // Let's say the middle 60% is content area -> emptyWidth = width * 0.3
        const distFromCenter = Math.abs(x - centerX)
        const emptyWidth = Math.min(800, width * 0.35) // Responsive empty center width
        const edgeGradiantWidth = Math.min(200, width * 0.1)

        if (distFromCenter < emptyWidth) {
          return 0
        } else if (distFromCenter < emptyWidth + edgeGradiantWidth) {
          const normDist = (distFromCenter - emptyWidth) / edgeGradiantWidth
          return Math.pow(normDist, 2)
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
            const fade1 = fadeInsideCenter(nodes[i].x)
            const fade2 = fadeInsideCenter(nodes[j].x)
            const avgFade = (fade1 + fade2) / 2

            if (avgFade > 0.01) {
              const combined = baseAlpha * avgFade
              ctx.strokeStyle = `rgba(37, 99, 235,${combined})`
              ctx.lineWidth = 0.8 + (avgFade * 1.7)
              ctx.beginPath()
              ctx.moveTo(nodes[i].x, nodes[i].y)
              ctx.lineTo(nodes[j].x, nodes[j].y)
              ctx.stroke()
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

      const newNodeCount = calculateNodeCount(width, height)

      if (newNodeCount !== nodeCount) {
        if (newNodeCount > nodeCount) {
          const toAdd = newNodeCount - nodeCount
          for (let i = 0; i < toAdd; i++) {
            const angle = Math.random() * Math.PI * 2
            const isLeft = Math.random() > 0.5
            nodes.push({
              x: isLeft ? Math.random() * (width * 0.25) : width - Math.random() * (width * 0.25),
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
