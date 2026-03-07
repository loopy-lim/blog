"use client"

import { useEffect, useRef } from "react"

export function InnovativeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    interface Blob {
      x: number
      y: number
      r: number
      color: string
      vx: number
      vy: number
      originX: number
      originY: number
    }

    // Grayscale Monochromatic Blobs for Premium Feel
    const blobs: Blob[] = [
      {
        x: 0,
        y: 0,
        r: 1200,
        color: "rgba(220, 220, 220, 0.15)", // Light Silver
        vx: 0.0004,
        vy: 0.0005,
        originX: 0.1,
        originY: 0.2,
      },
      {
        x: 0,
        y: 0,
        r: 1400,
        color: "rgba(200, 200, 200, 0.1)", // Soft Gray
        vx: 0.0003,
        vy: 0.0006,
        originX: 0.9,
        originY: 0.1,
      },
      {
        x: 0,
        y: 0,
        r: 1300,
        color: "rgba(230, 230, 230, 0.12)", // Almost White
        vx: 0.0005,
        vy: 0.0004,
        originX: 0.5,
        originY: 0.8,
      },
      {
        x: 0,
        y: 0,
        r: 1500,
        color: "rgba(215, 215, 215, 0.08)", // Mist Gray
        vx: 0.0002,
        vy: 0.0004,
        originX: 0.8,
        originY: 0.9,
      },
    ]

    const drawBlob = (blob: Blob) => {
      const { x, y, r, color } = blob
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "rgba(250, 250, 249, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const animate = () => {
      time += 0.003 // Slow and elegant
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      
      ctx.fillStyle = "#fafaf9" // Match base background
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      blobs.forEach((blob) => {
        blob.x =
          blob.originX * window.innerWidth +
          Math.sin(time * 1.2 + blob.vx * 1000) * (window.innerWidth * 0.2)
        blob.y =
          blob.originY * window.innerHeight +
          Math.cos(time * 1.0 + blob.vy * 1000) * (window.innerHeight * 0.2)

        drawBlob(blob)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    resize()
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#fafaf9]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* High-quality deep blur for monochrome depth */}
      <div className="absolute inset-0 backdrop-blur-[120px] pointer-events-none" />

      {/* Ultra-subtle grayscale noise */}
      <div className="absolute inset-0 opacity-[0.015] bg-grain pointer-events-none mix-blend-multiply" />
    </div>
  )
}
