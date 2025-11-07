"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Navigation from "./components/Navigation"
import anime from "animejs/lib/anime.es.js"

export default function Home() {
  const [entered, setEntered] = useState(false)
  const [typedText, setTypedText] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0, active: false })
  
  const fullText = "Rekvalifikační IT kurzy s experty z Matfyzu UK a ČVUT"
  
  // Helper function to render text with highlights
  const renderTypedText = () => {
    const matfyzIndex = fullText.indexOf("Matfyzu UK")
    const cvutIndex = fullText.indexOf("ČVUT")
    const currentLength = typedText.length
    
    if (currentLength === 0) return null
    
    const beforeMatfyz = typedText.slice(0, Math.min(currentLength, matfyzIndex))
    const matfyzEnd = matfyzIndex + "Matfyzu UK".length
    const matfyzText = currentLength > matfyzIndex 
      ? typedText.slice(matfyzIndex, Math.min(currentLength, matfyzEnd))
      : ""
    const between = currentLength > matfyzEnd
      ? typedText.slice(matfyzEnd, Math.min(currentLength, cvutIndex))
      : ""
    const cvutText = currentLength > cvutIndex
      ? typedText.slice(cvutIndex, currentLength)
      : ""
    
    return (
      <>
        {beforeMatfyz}
        {matfyzText && <span className="font-semibold text-blue-600">{matfyzText}</span>}
        {between}
        {cvutText && <span className="font-semibold text-blue-600">{cvutText}</span>}
      </>
    )
  }

  // tweakable parameters
  const BASE_SPEED = 0.08
  const TURN_RATE = 0.01
  const REPULSION_RADIUS = 150
  const REPULSION_STRENGTH = 0.2
  const NODE_COUNT = 180
  const CONNECTION_DISTANCE = 150
  const BIRTH_FADE_SPEED = 0.002

  // ellipse fade (covers title, subtitle, and button)
  const ELLIPSE_RADIUS_X = 500
  const ELLIPSE_RADIUS_Y = 400
  const ELLIPSE_FADE_STRENGTH = 0.85

  const courses = [
    {
      title: "Python pro začátečníky",
      description: "Naučte se základy programování v Pythonu od nuly. Ideální pro úplné začátečníky.",
      duration: "8 týdnů",
      level: "Začátečníci",
    },
    {
      title: "Datová analýza",
      description: "Pokročilé techniky analýzy dat a vizualizace s Pythonem a moderními nástroji.",
      duration: "10 týdnů",
      level: "Pokročilí",
    },
    {
      title: "Web development",
      description: "Kompletní kurz vývoje moderních webových aplikací s React a TypeScript.",
      duration: "12 týdnů",
      level: "Středně pokročilí",
    },
  ]

  const benefits = [
    {
      icon: "🎓",
      title: "Zkušení lektoři",
      description: "Absolventi Matfyzu UK a ČVUT s praktickými zkušenostmi",
    },
    {
      icon: "💼",
      title: "Praktické zaměření",
      description: "Kurzy zaměřené na reálné projekty a dovednosti z praxe",
    },
    {
      icon: "📜",
      title: "Certifikace",
      description: "Oficiální certifikát o rekvalifikaci po absolvování",
    },
    {
      icon: "👥",
      title: "Individuální přístup",
      description: "Malé skupiny zajišťují osobní přístup ke každému studentovi",
    },
  ]

  const stats = [
    { number: "500+", label: "Absolventů" },
    { number: "95%", label: "Úspěšnost" },
    { number: "50+", label: "Lektorů" },
    { number: "20+", label: "Kurzů" },
  ]

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
          // Stronger fade near center - dist=0 (center) should be lightest, dist=1 (edge) should be normal
          // Use smoother exponential curve: at center (dist=0) -> fadeFactor = 1 - ELLIPSE_FADE_STRENGTH (lightest)
          // at edge (dist=1) -> fadeFactor = 1 (normal)
          const fadeFactor = Math.pow(dist, 1.2) * ELLIPSE_FADE_STRENGTH + (1 - ELLIPSE_FADE_STRENGTH)
          return Math.max(0.05, fadeFactor) // Ensure minimum visibility but keep it very light at center
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

  useEffect(() => {
    anime({
      targets: ".hero-title span",
      translateY: [60, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: "easeOutCubic",
      duration: 1200,
    })
    anime({
      targets: ".hero-subtitle",
      opacity: [0, 1],
      translateY: [30, 0],
      delay: 500,
      easing: "easeOutCubic",
      duration: 1000,
    })
    
    // Typewriter effect for trust line
    const typewriterDelay = 1200
    const typewriterSpeed = 30 // milliseconds per character
    
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
    
    // Show buttons after typewriter completes (fullText.length * 50ms + delay)
    const buttonDelay = typewriterDelay + (fullText.length * typewriterSpeed) + 300
    anime({
      targets: ".cta-button",
      opacity: [0, 1],
      scale: [0.8, 1],
      delay: buttonDelay,
      easing: "easeOutElastic(1, .6)",
      duration: 1800,
    })
    
    return () => {
      clearTimeout(timeoutId)
      if (typeInterval) clearInterval(typeInterval)
    }
  }, [])

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
        targets: ".content-section",
        opacity: [0, 1],
        translateY: [50, 0],
        delay: 800,
        easing: "easeOutExpo",
        duration: 1000,
      })
      anime({
        targets: ".benefits-section",
        opacity: [0, 1],
        translateY: [50, 0],
        delay: 1000,
        easing: "easeOutExpo",
        duration: 1000,
      })
      anime({
        targets: ".courses-section",
        opacity: [0, 1],
        translateY: [50, 0],
        delay: 1200,
        easing: "easeOutExpo",
        duration: 1000,
      })
      anime({
        targets: ".stats-section",
        opacity: [0, 1],
        scale: [0.9, 1],
        delay: 1400,
        easing: "easeOutExpo",
        duration: 1000,
      })
    }
  }, [entered])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "eXpansePi",
            description: "Rekvalifikační IT kurzy s experty z Matfyzu UK a ČVUT",
            url: "https://expansepi.cz",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Praha",
              addressCountry: "CZ",
            },
          }),
        }}
      />
      <main className="relative min-h-screen flex flex-col items-center justify-center text-gray-900 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#f9fafb" }} />

        <Navigation />

        <section
          className={`hero-section absolute inset-0 flex flex-col items-center justify-center text-center transition-all px-4 ${
            entered ? "cursor-default" : ""
          }`}
        >
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-sm">
            <span className="inline-block text-gray-900">eXpanse</span>
            <span className="inline-block text-blue-600 ml-1">Pi</span>
          </h1>
          <p className="hero-subtitle text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 opacity-0 px-4 drop-shadow-sm">
            Budujeme novou generaci softwarových inženýrů
          </p>
          <div className="hero-subtitle opacity-0 mb-6 sm:mb-8 px-4">
            <div className="glow-outline inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg">
              <p className="relative z-10 text-sm sm:text-base md:text-lg font-medium text-gray-900">
                {renderTypedText()}
                {typedText.length < fullText.length && (
                  <span className="inline-block w-0.5 h-4 sm:h-5 bg-blue-600 ml-1 animate-pulse" />
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => setEntered(true)}
              className="cta-button opacity-0 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold shadow-md transition-transform hover:scale-105"
            >
              Prohlédnout kurzy
            </button>
            <Link
              href="/o-nas"
              className="cta-button opacity-0 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white text-blue-600 font-semibold shadow-md border-2 border-blue-600 transition-transform hover:scale-105"
            >
              Více o nás
            </Link>
          </div>
        </section>

        {entered && (
          <>
            <section className="content-section opacity-0 min-h-screen flex flex-col justify-center items-center bg-white text-gray-900 px-4 py-16 sm:py-24 w-full">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Rekvalifikační kurzy, které změní vaši kariéru
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Naučte se Python, datovou analýzu, web development a další moderní IT dovednosti s našimi zkušenými lektory z prestižních univerzit.
                  </p>
                </div>

                <div className="benefits-section opacity-0 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 rounded-lg border border-blue-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="text-4xl mb-3">{benefit.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                <div className="courses-section opacity-0 mb-16 sm:mb-20">
                  <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Naše kurzy</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Vyberte si z nabídky rekvalifikačních kurzů — od základů Pythonu po pokročilou datovou analýzu.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
                    {courses.map((course, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {course.level}
                          </span>
                          <span className="text-sm text-gray-500">{course.duration}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base">{course.description}</p>
                        <Link
                          href="/kurzy"
                          className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
                        >
                          Více informací
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <Link
                      href="/kurzy"
                      className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-sky-400 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-base sm:text-lg"
                    >
                      Zobrazit všechny kurzy →
                    </Link>
                  </div>
                </div>

                <div className="stats-section opacity-0 bg-gradient-to-r from-blue-600 to-sky-400 rounded-2xl p-8 sm:p-12 mb-16 sm:mb-20">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                          {stat.number}
                        </div>
                        <div className="text-blue-100 text-sm sm:text-base font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Připraveni začít?</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Připojte se k stovkám studentů, kteří změnili svou kariéru díky našim rekvalifikačním kurzům.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/kontakt"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-sky-400 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-base sm:text-lg"
                    >
                      Kontaktovat nás
                    </Link>
                    <Link
                      href="/kurzy"
                      className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:shadow-lg transition-all font-semibold text-base sm:text-lg border-2 border-blue-600"
                    >
                      Prohlédnout kurzy
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  )
}
