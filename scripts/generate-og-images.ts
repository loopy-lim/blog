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
  measureText(text: string): { width: number }
  fillRect(x: number, y: number, width: number, height: number): void
  fillText(text: string, x: number, y: number): void
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): {
    addColorStop(offset: number, color: string): void
  }
  beginPath(): void
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  stroke(): void
  drawImage(image: unknown, x: number, y: number, width: number, height: number): void
}

type CanvasModule = {
  createCanvas(width: number, height: number): {
    getContext(type: '2d'): CanvasRenderingContext2DLike
    toBuffer(format: 'image/jpeg', options: { quality: number }): Uint8Array | Buffer
  }
  loadImage(src: string): Promise<unknown>
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
    return napiCanvas
  } catch {}

  try {
    const nodeCanvas = (await import('canvas')) as unknown as CanvasModule
    console.log('✓ Using canvas for OG image generation')
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

// Gradient backgrounds for posts without cover images
const GRADIENTS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3'],
  ['#ff9a9e', '#fecfef'],
  ['#ffecd2', '#fcb69f'],
]

// Text wrap helper
function wrapText(ctx: CanvasRenderingContext2DLike, text: string, maxWidth: number): string[] {
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
  }
  if (currentLine) {
    lines.push(currentLine)
  }
  return lines.slice(0, 2) // Max 2 lines
}

// Truncate text helper
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

// Create gradient background
function createGradientBackground(
  ctx: CanvasRenderingContext2DLike,
  width: number,
  height: number,
  colors: string[]
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(1, colors[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

// Create dark overlay
function createDarkOverlay(ctx: CanvasRenderingContext2DLike, width: number, height: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.fillRect(0, 0, width, height)
}

// Generate OG image for a single post
async function generatePostOGImage(post: PostData, index: number): Promise<void> {
  const { createCanvas, loadImage } = getCanvasModule()
  const canvas = createCanvas(OG_WIDTH, OG_HEIGHT)
  const ctx = canvas.getContext('2d')

  // Check if cover image exists locally
  const localCoverPath = path.join(process.cwd(), 'public/images', `${post.slug}.jpg`)
  const hasLocalCover = fsSync.existsSync(localCoverPath)

  if (hasLocalCover) {
    try {
      const image = await loadImage(localCoverPath)
      // Draw cover image
      ctx.drawImage(image, 0, 0, OG_WIDTH, OG_HEIGHT)
      // Add dark overlay for text readability
      createDarkOverlay(ctx, OG_WIDTH, OG_HEIGHT)
    } catch {
      // Fallback to gradient
      const gradientColors = GRADIENTS[index % GRADIENTS.length]
      createGradientBackground(ctx, OG_WIDTH, OG_HEIGHT, gradientColors)
    }
  } else {
    // Use gradient background
    const gradientColors = GRADIENTS[index % GRADIENTS.length]
    createGradientBackground(ctx, OG_WIDTH, OG_HEIGHT, gradientColors)
  }

  // Draw title
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 56px Arial, sans-serif'
  const titleLines = wrapText(ctx, truncateText(post.title, 80), OG_WIDTH - 120)
  let titleY = OG_HEIGHT / 2 - 40
  for (const line of titleLines) {
    ctx.fillText(line, 60, titleY)
    titleY += 70
  }

  // Draw description
  if (post.description) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.font = '28px Arial, sans-serif'
    const descLines = wrapText(ctx, truncateText(post.description, 100), OG_WIDTH - 120)
    let descY = titleY + 20
    for (const line of descLines) {
      ctx.fillText(line, 60, descY)
      descY += 38
    }
  }

  // Draw separator line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(60, OG_HEIGHT - 100)
  ctx.lineTo(OG_WIDTH - 60, OG_HEIGHT - 100)
  ctx.stroke()

  // Draw author and site name
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = '24px Arial, sans-serif'
  const authorText = `${siteConfig.author} | ${siteConfig.title}`
  ctx.fillText(authorText, 60, OG_HEIGHT - 55)

  // Save image
  const outputPath = path.join(OUTPUT_DIR, `${post.slug}.jpg`)
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
  await fs.writeFile(outputPath, buffer)
  console.log(`✓ Generated: ${post.slug}.jpg`)
}

// Generate default OG image for home/blog-list/about pages
async function generateDefaultOGImage(): Promise<void> {
  const { createCanvas } = getCanvasModule()
  const canvas = createCanvas(OG_WIDTH, OG_HEIGHT)
  const ctx = canvas.getContext('2d')

  // Create gradient background
  createGradientBackground(ctx, OG_WIDTH, OG_HEIGHT, ['#1a1a2e', '#16213e'])

  // Draw site title
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 72px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(siteConfig.title, OG_WIDTH / 2, OG_HEIGHT / 2 - 60)

  // Draw description
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.font = '32px Arial, sans-serif'
  ctx.fillText(siteConfig.description, OG_WIDTH / 2, OG_HEIGHT / 2 + 10)

  // Draw separator
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(OG_WIDTH / 2 - 200, OG_HEIGHT / 2 + 50)
  ctx.lineTo(OG_WIDTH / 2 + 200, OG_HEIGHT / 2 + 50)
  ctx.stroke()

  // Draw author
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '28px Arial, sans-serif'
  ctx.fillText(siteConfig.author, OG_WIDTH / 2, OG_HEIGHT / 2 + 100)

  ctx.textAlign = 'left' // Reset

  // Save image
  const outputPath = path.join(OUTPUT_DIR, 'default.jpg')
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
  await fs.writeFile(outputPath, buffer)
  console.log('✓ Generated: default.jpg')
}

// Main function
async function generateOGImages() {
  console.log('🖼️  Generating OG images...')

  if (process.env.SKIP_OG_GENERATION === '1' || process.env.SKIP_OG_GENERATION === 'true') {
    console.log('⏭ SKIP_OG_GENERATION is enabled. Skipping OG image generation.')
    return
  }

  canvasModule = await loadCanvasModule()
  if (!canvasModule) {
    console.warn('⚠️ No canvas runtime is available in this environment.')
    console.warn('   Skipping OG image generation and using existing files.')
    return
  }

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // Read blog data
  let blogData: BlogData
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    blogData = JSON.parse(data)
  } catch {
    console.error('❌ Error reading blog data. Run `bun run build-data` first.')
    process.exit(1)
  }

  // Generate default OG image
  await generateDefaultOGImage()

  // Generate OG images for all posts
  for (let i = 0; i < blogData.posts.length; i++) {
    await generatePostOGImage(blogData.posts[i], i)
  }

  console.log(`\n✅ Generated ${blogData.posts.length + 1} OG images in ${OUTPUT_DIR}`)
}

// Run
generateOGImages().catch(console.error)
