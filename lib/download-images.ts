import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getDatabase, getPageBlocks } from './notion.js'

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'notion')
const NOTION_SIGNED_IMAGE_HOSTS = new Set([
  'prod-files-secure.s3.us-west-2.amazonaws.com',
  's3.us-west-2.amazonaws.com',
])

async function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function normalizeImageUrlForCache(imageUrl: string): string {
  try {
    const parsed = new URL(imageUrl)
    const base = `${parsed.origin}${parsed.pathname}`

    if (NOTION_SIGNED_IMAGE_HOSTS.has(parsed.hostname)) {
      return base
    }

    return parsed.search ? `${base}${parsed.search}` : base
  } catch {
    return imageUrl
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImageUrls(blocks: any[]): string[] {
  const urls: string[] = []

  for (const block of blocks) {
    if (block.type === 'image') {
      const imageUrl = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url
      urls.push(imageUrl)
    }

    // 재귀적으로 하위 블록에서 이미지 URL 추출
    if (block[block.type] && block[block.type].children) {
      urls.push(...extractImageUrls(block[block.type].children))
    }
  }

  return urls
}

async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const filePath = path.join(IMAGES_DIR, filename)

    fs.writeFileSync(filePath, buffer)
    console.log(`Downloaded: ${filename}`)
  } catch (error) {
    console.error(`Failed to download ${url}:`, error)
  }
}

function generateImageFilename(cacheKey: string): string {
  let extension = 'png'

  try {
    const parsed = new URL(cacheKey)
    const extensionMatch = parsed.pathname.match(/\.([a-zA-Z0-9]+)$/)
    if (extensionMatch) {
      extension = extensionMatch[1].toLowerCase()
    }
  } catch {
    const extensionMatch = cacheKey.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
    if (extensionMatch) {
      extension = extensionMatch[1].toLowerCase()
    }
  }

  const hash = crypto.createHash('sha256').update(cacheKey).digest('hex').slice(0, 16)
  return `${hash}.${extension}`
}

export async function downloadNotionImages(): Promise<void> {
  console.log('Starting Notion image download...')

  await ensureDirExists(IMAGES_DIR)

  try {
    // 데이터베이스에서 모든 포스트 가져오기
    const database = await getDatabase()
    const posts = database.results as Array<{
      id: string
      properties: {
        title: { title: Array<{ plain_text: string }> }
        slug: { rich_text: Array<{ plain_text: string }> }
      }
    }>

    const allImageUrls: string[] = []

    // 각 포스트에서 이미지 URL 수집
    for (const post of posts) {
      const title = post.properties.title.title[0]?.plain_text || 'Untitled'
      console.log(`Processing: ${title}`)
      const blocks = await getPageBlocks(post.id)
      const imageUrls = extractImageUrls(blocks)
      allImageUrls.push(...imageUrls)
    }

    const imageGroups = new Map<string, Set<string>>()
    for (const url of allImageUrls) {
      const cacheKey = normalizeImageUrlForCache(url)
      const group = imageGroups.get(cacheKey) ?? new Set<string>()
      group.add(url)
      imageGroups.set(cacheKey, group)
    }
    console.log(`Found ${imageGroups.size} unique images`)

    // 이미지 다운로드
    for (const [cacheKey, urls] of imageGroups) {
      const sourceUrl = urls.values().next().value
      if (!sourceUrl) continue

      const filename = generateImageFilename(cacheKey)
      const filePath = path.join(IMAGES_DIR, filename)

      // 이미 존재하면 스킵
      if (fs.existsSync(filePath)) {
        console.log(`Skipping existing: ${filename}`)
        continue
      }

      await downloadImage(sourceUrl, filename)
    }

    console.log('Image download completed!')

    // 이미지 맵 파일 생성 (URL -> 로컬 경로)
    const imageMap: Record<string, string> = {}
    for (const [cacheKey, urls] of imageGroups) {
      const filename = generateImageFilename(cacheKey)
      const localPath = `/images/notion/${filename}`
      imageMap[cacheKey] = localPath

      for (const url of urls) {
        imageMap[url] = localPath
      }
    }

    const mapPath = path.join(process.cwd(), 'lib', 'image-map.json')
    await ensureDirExists(path.dirname(mapPath))
    fs.writeFileSync(mapPath, JSON.stringify(imageMap, null, 2))
    console.log(`Image map created: ${mapPath}`)

  } catch (error) {
    console.error('Error downloading images:', error)
  }
}

// CLI에서 실행 가능
if (require.main === module) {
  downloadNotionImages()
}
