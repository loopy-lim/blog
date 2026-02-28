"use client"

import { useEffect, useRef } from "react"

export default function InnovativeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    const mouse = { x: 0, y: 0 }

    const init = () => {
      resize()
      createParticles()
      animate()
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        // Subtle blue-ish/purple-ish for dark mode
        this.color = `rgba(${100 + Math.random() * 100}, ${100 + Math.random() * 100}, 255, ${
          Math.random() * 0.3 + 0.1
        })`
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1

        // Mouse interaction
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 100) {
          this.x -= dx * 0.02
          this.y -= dy * 0.02
        }
      }

      draw() {
        ctx!.fillStyle = this.color
        // Changed from circular arc to square for a more unique, non-AI look
        ctx!.save()
        ctx!.translate(this.x, this.y)
        ctx!.rotate(Math.PI / 4) // Diamond shape
        ctx!.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        ctx!.restore()
      }
    }

    const createParticles = () => {
      particles = []
      const particleCount = Math.min(window.innerWidth / 10, 100) // Responsive count
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw connections
      ctx.strokeStyle = "rgba(100, 150, 255, 0.05)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    window.addEventListener("resize", () => {
      resize()
      createParticles()
    })
    window.addEventListener("mousemove", handleMouseMove)

    init()

    return () => {
      window.removeEventListener("resize", resize) // Helper function not needed if inline
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 -z-50 h-full min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
    />
  )
}
