import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas'
import { siteConfig } from '../site.config'

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
    if (!process.env[key]) process.env[key] = value
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
  bg: '#000000',
  fg: '#ffffff',
  accent: '#3b82f6', // Premium Blue
  muted: '#4b5563', // Gray 600
  border: 'rgba(255, 255, 255, 0.1)',
}

const FONT_FAMILY = 'Pretendard, sans-serif'

// Register Fonts
function registerFonts() {
  const boldPath = path.join(process.cwd(), 'public/fonts/Pretendard-Bold.otf')
  const regPath = path.join(process.cwd(), 'public/fonts/Pretendard-Regular.otf')
  if (fsSync.existsSync(boldPath)) GlobalFonts.registerFromPath(boldPath, 'Pretendard')
  if (fsSync.existsSync(regPath)) GlobalFonts.registerFromPath(regPath, 'Pretendard')
}

interface PostData {
  id: string
  title: string
  slug: string
  description: string
  publishedAt: string
  tags: string[]
  coverImage?: string
}

function wrapText(ctx: any, text: string, maxWidth: number, maxLines: number = 2): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
    if (lines.length >= maxLines) break
  }
  if (currentLine && lines.length < maxLines) lines.push(currentLine)
  return lines
}

function drawMinimalBackground(ctx: any) {
  // Pure Black
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)

  // One Soft Radial Light from bottom right
  const grad = ctx.createRadialGradient(OG_WIDTH - 100, OG_HEIGHT - 100, 50, OG_WIDTH - 200, OG_HEIGHT - 200, 600)
  grad.addColorStop(0, 'rgba(59, 130, 246, 0.12)')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)
}

async function generatePostOGImage(post: PostData): Promise<void> {
  const canvas = createCanvas(OG_WIDTH, OG_HEIGHT)
  const ctx = canvas.getContext('2d')

  drawMinimalBackground(ctx)
  
  // Subtle Cover Mask (if exists)
  const localCoverPath = path.join(process.cwd(), 'public/images', `${post.slug}.jpg`)
  if (fsSync.existsSync(localCoverPath)) {
    try {
      const image = await loadImage(localCoverPath)
      ctx.save()
      ctx.globalAlpha = 0.1
      ctx.drawImage(image, 0, 0, OG_WIDTH, OG_HEIGHT)
      ctx.restore()
    } catch {}
  }

  const left = 120
  
  // Top: Brand Name (Very Small & Elegant)
  ctx.fillStyle = COLORS.accent
  ctx.font = `bold 18px ${FONT_FAMILY}`
  ctx.fillText('LOOPY ARCHIVE', left, 120)

  // Title (Reduced Size, High Readability)
  ctx.fillStyle = COLORS.fg
  ctx.font = `bold 62px ${FONT_FAMILY}`
  const titleLines = wrapText(ctx, post.title, OG_WIDTH - left * 2, 2)
  let currentY = 280
  for (const line of titleLines) {
    ctx.fillText(line, left, currentY)
    currentY += 80
  }

  // Description (Short & Subtle)
  if (post.description) {
    ctx.fillStyle = COLORS.muted
    ctx.font = `28px ${FONT_FAMILY}`
    const descLines = wrapText(ctx, post.description, OG_WIDTH - left * 2, 1)
    for (const line of descLines) {
      ctx.fillText(line, left, currentY + 10)
    }
  }

  // Bottom Area
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.fillRect(left, OG_HEIGHT - 140, 40, 2) // Small elegant line

  ctx.fillStyle = COLORS.muted
  ctx.font = `bold 16px ${FONT_FAMILY}`
  const dateStr = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
    : 'LATEST'
  ctx.fillText(`${dateStr}  /  ${siteConfig.author.toUpperCase()}`, left, OG_HEIGHT - 100)

  const outputPath = path.join(OUTPUT_DIR, `${post.slug}.jpg`)
  await fs.writeFile(outputPath, canvas.toBuffer('image/jpeg', 92))
}

async function generateDefaultOGImage(): Promise<void> {
  const canvas = createCanvas(OG_WIDTH, OG_HEIGHT)
  const ctx = canvas.getContext('2d')

  drawMinimalBackground(ctx)
  
  const centerX = OG_WIDTH / 2
  ctx.textAlign = 'center'

  // Minimal Site Title
  ctx.fillStyle = COLORS.fg
  ctx.font = `bold 82px ${FONT_FAMILY}`
  ctx.fillText(siteConfig.title, centerX, OG_HEIGHT / 2 - 20)

  // Subtitle / Author
  ctx.fillStyle = COLORS.accent
  ctx.font = `bold 20px ${FONT_FAMILY}`
  ctx.fillText(siteConfig.author.toUpperCase(), centerX, OG_HEIGHT / 2 + 40)

  // Description
  ctx.fillStyle = COLORS.muted
  ctx.font = `24px ${FONT_FAMILY}`
  const descLines = wrapText(ctx, siteConfig.description, 700, 2)
  let descY = OG_HEIGHT / 2 + 100
  for (const line of descLines) {
    ctx.fillText(line, centerX, descY)
    descY += 36
  }

  // Footer URL (Small & Subtle)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.font = `bold 14px ${FONT_FAMILY}`
  ctx.fillText(siteConfig.url.replace(/^https?:\/\//, '').toUpperCase(), centerX, OG_HEIGHT - 80)

  const outputPath = path.join(OUTPUT_DIR, 'default.jpg')
  await fs.writeFile(outputPath, canvas.toBuffer('image/jpeg', 92))
}

async function main() {
  console.log('💎 Generating Luxury-Minimal OG images...')
  registerFonts()
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  const blogData = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'))
  await generateDefaultOGImage()
  for (const post of blogData.posts) {
    await generatePostOGImage(post)
  }
  console.log(`✅ Success. Clean & Premium images ready.`)
}

main().catch(console.error)
