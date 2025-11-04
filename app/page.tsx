"use client"
import { useEffect, useRef, useState } from "react"
import anime from "animejs/lib/anime.es.js"

export default function Home() {
  const [entered, setEntered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0, active: false })

  // tweakable parameters
  const BASE_SPEED = 0.08
  const TURN_RATE = 0.01
  const REPULSION_RADIUS = 150
  const REPULSION_STRENGTH = 0.2
  const NODE_COUNT = 180
  const CONNECTION_DISTANCE = 150
  const BIRTH_FADE_SPEED = 0.002

  // ellipse fade (covers title, subtitle, and button)
  const ELLIPSE_RADIUS_X = 340
  const ELLIPSE_RADIUS_Y = 260
  const ELLIPSE_FADE_STRENGTH = 0.7 // stronger fade behind text

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const nodes: {
      x: number
      y: number
      vx: number
      vy: number
      angle: number
      life: number
    }[] = Array.from({ length: NODE_COUNT }, () => {
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

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "#f9fafb"
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // --- move nodes ---
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

      // --- fade behind ellipse ---
      const fadeInsideEllipse = (x: number, y: number) => {
        const dx = (x - centerX) / ELLIPSE_RADIUS_X
        const dy = (y - centerY) / ELLIPSE_RADIUS_Y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1) {
          // softer fade near the center
          const fadeFactor = dist ** 2 + (1 - dist) * (1 - ELLIPSE_FADE_STRENGTH)
          return fadeFactor
        }
        return 1
      }

      // --- draw edges ---
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
            const combined = baseAlpha * ((fade1 + fade2) / 2)
            ctx.strokeStyle = `rgba(156,163,175,${combined})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // --- draw nodes ---
      for (const n of nodes) {
        const fade = fadeInsideEllipse(n.x, n.y)
        ctx.fillStyle = `rgba(156,163,175,${n.life * fade})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2.2, 0, 2 * Math.PI)
        ctx.fill()
      }

      requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
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
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      clearInterval(densityInterval)
    }
  }, [])

  // --- text animations ---
  useEffect(() => {
    anime({
      targets: ".hero-title span",
      translateY: [256, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
      easing: "easeOutExpo",
      duration: 1800,
    })
    anime({
      targets: ".hero-subtitle",
      opacity: [0, 1],
      translateY: [40, 0],
      delay: 600,
      easing: "easeOutExpo",
      duration: 1500,
    })
    anime({
      targets: ".cta-button",
      opacity: [0, 1],
      scale: [0.8, 1],
      delay: 1000,
      easing: "easeOutElastic(1, .6)",
      duration: 1800,
    })
  }, [])

  // --- transition animation ---
  useEffect(() => {
    if (entered) {
      anime({
        targets: ".hero-section",
        translateX: ["0%", "-38%"],
        translateY: ["0%", "-35%"],
        scale: [1, 0.55],
        easing: "easeInOutExpo",
        duration: 1600,
      })
      anime({
        targets: ".navbar",
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: 800,
        easing: "easeOutExpo",
        duration: 1000,
      })
      anime({
        targets: ".courses-section",
        opacity: [0, 1],
        translateY: [100, 0],
        delay: 1200,
        easing: "easeOutExpo",
        duration: 1000,
      })
    }
  }, [entered])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-gray-900 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#f9fafb" }} />

      <section
        className={`hero-section absolute inset-0 flex flex-col items-center justify-center text-center transition-all ${
          entered ? "cursor-default" : ""
        }`}
      >
        <h1 className="hero-title text-6xl font-bold mb-4 drop-shadow-sm">
          <span className="inline-block text-gray-900">eXpanse</span>
          <span className="inline-block text-blue-600 ml-1">Pi</span>
        </h1>
        <p className="hero-subtitle text-xl text-gray-700 mb-8 opacity-0">
            Budujeme novou generaci softwarových inženýrů
        </p>
        <button
          onClick={() => setEntered(true)}
          className="cta-button opacity-0 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold shadow-md transition-transform hover:scale-105"
        >
          Vstupte do světa IT
        </button>
      </section>

      <nav className="navbar fixed top-0 left-0 w-full opacity-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-blue-600">
            eXpanse<span className="text-gray-900">Pi</span>
          </a>
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="#kurzy" className="hover:text-blue-600 transition-colors">
              Kurzy
            </a>
            <a href="#onas" className="hover:text-blue-600 transition-colors">
              O&nbsp;nás
            </a>
            <a href="#kontakt" className="hover:text-blue-600 transition-colors">
              Kontakt
            </a>
          </div>
        </div>
      </nav>

      <section
        id="kurzy"
        className="courses-section opacity-0 min-h-screen flex flex-col justify-center items-center bg-white text-gray-900"
      >
        <h2 className="text-4xl font-bold mb-4">Naše kurzy</h2>
        <p className="max-w-2xl text-gray-600 text-center">
          Vyberte si z nabídky rekvalifikačních kurzů — od základů Pythonu po pokročilou datovou analýzu.
        </p>
      </section>
    </main>
  )
}
