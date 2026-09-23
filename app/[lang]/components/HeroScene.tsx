"use client"

import { useEffect, useRef } from "react"

export default function HeroScene({ label, word }: { label: string; word: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const styles = getComputedStyle(canvas)
    const colors = {
      primary: styles.getPropertyValue("--blue").trim(),
      highlight: styles.getPropertyValue("--blue-hover").trim(),
      grid: styles.getPropertyValue("--line").trim(),
      caption: styles.getPropertyValue("--muted").trim(),
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const desktop = window.matchMedia("(min-width: 1024px)")
    const mask = document.createElement("canvas")
    mask.width = 260
    mask.height = 260
    const maskContext = mask.getContext("2d")
    if (!maskContext) return
    maskContext.font = "bold 260px Georgia"
    maskContext.textAlign = "center"
    maskContext.fillText("π", 130, 210)
    const pixels = maskContext.getImageData(0, 0, 260, 260).data
    const cells: { column: number; row: number }[] = []
    for (let row = 0; row < 30; row++) {
      for (let column = 0; column < 30; column++) {
        const pixel = (Math.floor(row * 260 / 30) * 260 + Math.floor(column * 260 / 30)) * 4
        if (pixels[pixel + 3] > 100) cells.push({ column, row })
      }
    }

    let frame = 0
    let width = 0
    let height = 0
    let startedAt = performance.now()
    let visible = true
    let pointer = { x: -1000, y: -1000 }

    function draw(now: number) {
      if (!canvas || !context || !desktop.matches || !visible || document.hidden) return
      const progress = motion.matches ? 1 : Math.min(1, (now - startedAt) / 1400)
      const unit = Math.min(height * .83 / 30, width * .33 / 30)
      const originX = width * .765 - unit * 15
      const originY = height * .035
      context.clearRect(0, 0, width, height)
      context.strokeStyle = colors.grid
      context.lineWidth = .65
      const grid = unit * 3
      for (let column = originX - grid; column < width; column += grid) {
        context.beginPath()
        context.moveTo(column, 0)
        context.lineTo(column, height)
        context.stroke()
      }
      for (let row = 0; row < height; row += grid) {
        context.beginPath()
        context.moveTo(originX - grid, row)
        context.lineTo(width, row)
        context.stroke()
      }

      for (const { column, row } of cells) {
        const delay = (column + row) / 120
        const arrival = Math.min(1, Math.max(0, (progress - delay) / (1 - delay)))
        const eased = 1 - Math.pow(1 - arrival, 3)
        const positionX = originX + column * unit
        const positionY = originY + row * unit
        const distance = Math.hypot(pointer.x - positionX, pointer.y - positionY)
        const highlight = !motion.matches && distance < 90
        const offset = motion.matches ? 0 : (1 - eased) * (Math.sin(column * 3 + row) * 65)
        context.globalAlpha = (.2 + eased * .8) * (!highlight && (column + row) % 8 === 0 ? .6 : 1)
        context.fillStyle = highlight ? colors.highlight : colors.primary
        context.fillRect(positionX + offset, positionY + (1 - eased) * 45, Math.max(3, unit - 2.2), Math.max(3, unit - 2.2))
      }
      context.globalAlpha = 1
      context.font = "10px monospace"
      context.fillStyle = colors.caption
      context.fillText("eXpansePi / IT", originX + unit * 4, height * .79)
      if (progress < 1) frame = requestAnimationFrame(draw)
    }

    function redraw() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }

    function resize() {
      const bounds = canvas!.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas!.width = Math.round(width * ratio)
      canvas!.height = Math.round(height * ratio)
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
      redraw()
    }

    function onPointerMove(event: PointerEvent) {
      if (motion.matches || !desktop.matches) return
      const bounds = canvas!.getBoundingClientRect()
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
      redraw()
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) redraw()
      else cancelAnimationFrame(frame)
    })
    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)
    const onMotionChange = () => { startedAt = performance.now() - 1400; redraw() }
    motion.addEventListener("change", onMotionChange)
    desktop.addEventListener("change", resize)
    document.addEventListener("visibilitychange", redraw)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    resize()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      motion.removeEventListener("change", onMotionChange)
      desktop.removeEventListener("change", resize)
      document.removeEventListener("visibilitychange", redraw)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return <div className="hero-scene" aria-hidden="true"><div className="container hero-scene-inner"><canvas ref={canvasRef} /><div className="hero-scene-label">{label}<strong>{word}</strong></div></div></div>
}