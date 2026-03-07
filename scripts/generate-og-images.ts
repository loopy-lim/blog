import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { siteConfig } from '../site.config'

type CanvasRenderingContext2DLike = {
  fillStyle: unknown
  font: string
  textAlign: string
  strokeStyle: unknown
  lineWidth: number
  lineJoin: 'round' | 'bevel' | 'miter'
  globalAlpha: number
  measureText(text: string): { width: number }
  fillRect(x: number, y: number, width: number, height: number): void
  fillText(text: string, x: number, y: number): void
  strokeRect(x: number, y: number, width: number, height: number): void
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): {
    addColorStop(offset: number, color: string): void
  }
  beginPath(): void
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void
  stroke(): void
  fill(): void
  closePath(): void
  drawImage(image: unknown, x: number, y: number, width: number, height: number): void
  save(): void
  restore(): void
  translate(x: number, y: number): void
  rotate(angle: number): void
}

type CanvasModule = {
  createCanvas(width: number, height: number): {
    getContext(type: '2d'): CanvasRenderingContext2DLike
    toBuffer(format: 'image/jpeg', options: { quality: number }): Uint8Array | Buffer
  }
  loadImage(src: string): Promise<unknown>
  GlobalFonts?: {
    registerFromPath(path: string, family: string): boolean
  }
  registerFont?: (path: string, options: { family: string; weight?: string }) => void
}

let canvasModule: CanvasModule | null = null

function getCanvasModule(): CanvasModule {
  if (!canvasModule) {
    throw new Error('Canvas module is not initialized')
  }
  return canvasModule
}

async function loadCanvasModule(): Promise<CanvasModule | null> {
  try {
    const napiCanvasPkg = '@napi-rs/canvas'
    const napiCanvas = (await import(napiCanvasPkg)) as unknown as CanvasModule
    console.log('✓ Using @napi-rs/canvas for OG image generation')
    
    // Register fonts if using @napi-rs/canvas
    if (napiCanvas.GlobalFonts) {
      const boldPath = path.join(process.cwd(), 'public/fonts/Pretendard-Bold.otf')
      const regPath = path.join(process.cwd(), 'public/fonts/Pretendard-Regular.otf')
      if (fsSync.existsSync(boldPath)) {
        napiCanvas.GlobalFonts.registerFromPath(boldPath, 'Pretendard')
        console.log('✓ Registered Pretendard Bold')
      }
      if (fsSync.existsSync(regPath)) {
        napiCanvas.GlobalFonts.registerFromPath(regPath, 'Pretendard')
        console.log('✓ Registered Pretendard Regular')
      }
    }
    return napiCanvas
  } catch {}

  try {
    const nodeCanvas = (await import('canvas')) as unknown as CanvasModule
    console.log('✓ Using canvas for OG image generation')
    
    // Register fonts if using node-canvas
    if (nodeCanvas.registerFont) {
      const boldPath = path.join(process.cwd(), 'public/fonts/Pretendard-Bold.otf')
      const regPath = path.join(process.cwd(), 'public/fonts/Pretendard-Regular.otf')
      if (fsSync.existsSync(boldPath)) {
        nodeCanvas.registerFont(boldPath, { family: 'Pretendard', weight: 'bold' })
      }
      if (fsSync.existsSync(regPath)) {
        nodeCanvas.registerFont(regPath, { family: 'Pretendard', weight: 'normal' })
      }
    }
    return nodeCanvas
  } catch {}

  return null
}

// Load environment
function loadEnvFile(filePath: string) {
  if (!fsSync.existsSync(filePath)) return
  const content = fsSync.readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const equalsIndex = line.indexOf('=')
    if (equalsIndex <= 0) continue
    const key = line.slice(0, equalsIndex).trim()
    const value = line.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(path.join(process.cwd(), '.env'))
loadEnvFile(path.join(process.cwd(), '.env.local'))

// Constants
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const OUTPUT_DIR = path.join(process.cwd(), 'public/images/og')
const DATA_FILE = path.join(process.cwd(), 'data/blog.json')

const COLORS = {
  bg: '#050505',
  fg: '#ffffff',
  accent: '#3b82f6', // Blue
  accentDark: '#1d4ed8',
  muted: '#888888',
  grid: 'rgba(255, 255, 255, 0.03)',
}

const FONT_FAMILY = 'Pretendard, sans-serif'

interface PostData {
  id: string
  title: string
  slug: string
  description: string
  publishedAt: string
  tags: string[]
  coverImage?: string
}

interface BlogData {
  posts: PostData[]
  lastUpdated: string
}

// Text wrap helper
function wrapText(
  ctx: CanvasRenderingContext2DLike,
  text: string,
  maxWidth: number,
  maxLines: number = 3
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
    if (lines.length >= maxLines) break
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
  }
  return lines
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

function drawBackground(ctx: CanvasRenderingContext2DLike) {
  // Base Black
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)

  // Subtle Gradient
  const grad = ctx.createLinearGradient(0, 0, OG_WIDTH, OG_HEIGHT)
  grad.addColorStop(0, 'rgba(59, 130, 246, 0.05)') // accent alpha
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)

  // Grid
  ctx.strokeStyle = COLORS.grid
  ctx.lineWidth = 1
  for (let x = 0; x <= OG_WIDTH; x += 50) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, OG_HEIGHT)
    ctx.stroke()
  }
  for (let y = 0; y <= OG_HEIGHT; y += 50) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(OG_WIDTH, y)
    ctx.stroke()
  }
}

function drawDecorations(ctx: CanvasRenderingContext2DLike) {
  // Left Accent Bar with Gradient
  const barGrad = ctx.createLinearGradient(0, 0, 0, OG_HEIGHT)
  barGrad.addColorStop(0, COLORS.accent)
  barGrad.addColorStop(1, COLORS.accentDark)
  ctx.fillStyle = barGrad
  ctx.fillRect(0, 0, 12, OG_HEIGHT)

  // Floating Blur (Simulated with circles)
  ctx.save()
  ctx.globalAlpha = 0.1
  ctx.fillStyle = COLORS.accent
  ctx.beginPath()
  ctx.arc(OG_WIDTH - 100, 100, 200, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawBadge(ctx: CanvasRenderingContext2DLike, text: string, x: number, y: number) {
  ctx.font = `bold 18px ${FONT_FAMILY}`
  const metrics = ctx.measureText(text)
  const paddingH = 16
  const paddingV = 8
  const w = metrics.width + paddingH * 2
  const h = 36

  ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'
  ctx.lineWidth = 1
  
  // Rounded rect
  ctx.beginPath()
  ctx.moveTo(x + 8, y)
  ctx.lineTo(x + w - 8, y)
  ctx.arcTo(x + w, y, x + w, y + 8, 8)
  ctx.lineTo(x + w, y + h - 8)
  ctx.arcTo(x + w, y + h, x + w - 8, y + h, 8)
  ctx.lineTo(x + 8, y + h)
  ctx.arcTo(x, y + h, x, y + h - 8, 8)
  ctx.lineTo(x, y + 8)
  ctx.arcTo(x, y, x + 8, y, 8)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = COLORS.accent
  ctx.fillText(text, x + paddingH, y + 24)
}

async function generatePostOGImage(post: PostData): Promise<void> {
  const { createCanvas, loadImage } = getCanvasModule()
  const canvas = createCanvas(OG_WIDTH, OG_HEIGHT)
  const ctx = canvas.getContext('2d')

  drawBackground(ctx)

  // Optional Cover Image
  const localCoverPath = path.join(process.cwd(), 'public/images', `${post.slug}.jpg`)
  if (fsSync.existsSync(localCoverPath)) {
    try {
      const image = await loadImage(localCoverPath)
      ctx.save()
      ctx.globalAlpha = 0.2
      ctx.drawImage(image, 0, 0, OG_WIDTH, OG_HEIGHT)
      ctx.restore()
    } catch {}
  }

  drawDecorations(ctx)

  const left = 80
  
  // Top Label
  drawBadge(ctx, 'LOOPY', left, 70)

  // Site Name
  ctx.fillStyle = COLORS.muted
  ctx.font = `20px ${FONT_FAMILY}`
  ctx.fillText(siteConfig.title.toUpperCase(), left, 140)

  // Title
  ctx.fillStyle = COLORS.fg
  ctx.font = `bold 72px ${FONT_FAMILY}`
  const titleLines = wrapText(ctx, post.title, OG_WIDTH - 200, 3)
  let currentY = 240
  for (const line of titleLines) {
    ctx.fillText(line, left, currentY)
    currentY += 86
  }

  // Description
  if (post.description) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = `32px ${FONT_FAMILY}`
    const descLines = wrapText(ctx, truncateText(post.description, 150), OG_WIDTH - 200, 2)
    currentY += 10
    for (const line of descLines) {
      ctx.fillText(line, left, currentY)
      currentY += 46
    }
  }

  // Footer
  ctx.fillStyle = COLORS.muted
  ctx.font = `24px ${FONT_FAMILY}`
  const dateStr = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recent Post'
  ctx.fillText(`${siteConfig.author} • ${dateStr}`, left, OG_HEIGHT - 70)

  const outputPath = path.join(OUTPUT_DIR, `${post.slug}.jpg`)
  await fs.writeFile(outputPath, canvas.toBuffer('image/jpeg', { quality: 0.9 }))
  console.log(`✓ Generated: ${post.slug}.jpg`)
}

async function generateDefaultOGImage(): Promise<void> {
  const { createCanvas } = getCanvasModule()
  const canvas = createCanvas(OG_WIDTH, OG_HEIGHT)
  const ctx = canvas.getContext('2d')

  drawBackground(ctx)
  
  // Custom decorations for default
  ctx.save()
  // Large background text as a design element
  ctx.globalAlpha = 0.03
  ctx.fillStyle = COLORS.fg
  ctx.font = `bold 320px ${FONT_FAMILY}`
  ctx.fillText('LOOPY', -40, 480)
  ctx.restore()

  drawDecorations(ctx)

  const left = 100

  // Big Brand Title
  ctx.fillStyle = COLORS.accent
  ctx.font = `bold 32px ${FONT_FAMILY}`
  ctx.fillText('DEVELOPER & ENGINEER', left, 180)

  // Main Site Title
  ctx.fillStyle = COLORS.fg
  ctx.font = `bold 110px ${FONT_FAMILY}`
  ctx.fillText(siteConfig.title, left, 310)

  // Description with better layout
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = `34px ${FONT_FAMILY}`
  const descLines = wrapText(ctx, siteConfig.description, 750, 2)
  let descY = 380
  for (const line of descLines) {
    ctx.fillText(line, left, descY)
    descY += 48
  }

  // Footer / URL
  ctx.fillStyle = COLORS.accent
  ctx.font = `bold 24px ${FONT_FAMILY}`
  ctx.fillText(siteConfig.url.replace(/^https?:\/\//, ''), left, OG_HEIGHT - 80)

  // Decorative element on the right
  ctx.strokeStyle = COLORS.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(OG_WIDTH - 150, 0)
  ctx.lineTo(OG_WIDTH, 150)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(OG_WIDTH - 100, 0)
  ctx.lineTo(OG_WIDTH, 100)
  ctx.stroke()

  const outputPath = path.join(OUTPUT_DIR, 'default.jpg')
  await fs.writeFile(outputPath, canvas.toBuffer('image/jpeg', { quality: 0.9 }))
  console.log('✓ Generated: default.jpg')
}

async function generateOGImages() {
  console.log('🖼️  Generating Premium OG images...')
  canvasModule = await loadCanvasModule()
  if (!canvasModule) return
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  const blogData = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'))
  await generateDefaultOGImage()
  for (const post of blogData.posts) {
    await generatePostOGImage(post)
  }
  console.log(`\n✅ Generated ${blogData.posts.length + 1} OG images.`)
}

generateOGImages().catch(console.error)
