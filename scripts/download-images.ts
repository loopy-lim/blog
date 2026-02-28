import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

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

function stripOptionalQuotes(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function loadEnvFile(filePath: string, overrideExisting = false) {
  if (!fs.existsSync(filePath)) return

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const equalsIndex = line.indexOf('=')
    if (equalsIndex <= 0) continue

    const key = line.slice(0, equalsIndex).trim()
    const value = stripOptionalQuotes(line.slice(equalsIndex + 1))
    if (!key) continue

    if (overrideExisting || process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function loadEnvWithLocalFallback() {
  const envPath = path.join(process.cwd(), '.env')
  const envLocalPath = path.join(process.cwd(), '.env.local')

  // Base: .env
  loadEnvFile(envPath, false)
  // Fallback: .env.local (only if key is missing)
  loadEnvFile(envLocalPath, false)
}

function normalizeImageUrlForCache(imageUrl: string): string {
  try {
    const parsed = new URL(imageUrl)
    const base = `${parsed.origin}${parsed.pathname}`

    // Notion presigned URLs rotate query parameters periodically.
    if (NOTION_SIGNED_IMAGE_HOSTS.has(parsed.hostname)) {
      return base
    }

    return parsed.search ? `${base}${parsed.search}` : base
  } catch {
    return imageUrl
  }
}

function extractImageUrls(blocks: unknown[]): string[] {
  const urls: string[] = []

  for (const block of blocks) {
    const typedBlock = block as Record<string, unknown>

    if (typedBlock.type === 'image') {
      const imageData = typedBlock.image as { type: string; external?: { url: string }; file?: { url: string } }
      const imageUrl = imageData.type === 'external' && imageData.external
        ? imageData.external.url
        : imageData.file?.url || ''
      if (imageUrl) urls.push(imageUrl)
    }

    // 재귀적으로 하위 블록에서 이미지 URL 추출
    const blockContent = typedBlock[typedBlock.type as string] as { children?: unknown[] } | undefined
    if (blockContent?.children) {
      urls.push(...extractImageUrls(blockContent.children))
    }
  }

  return urls
}

async function downloadImage(url: string, filename: string, retries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempting to download ${filename} (attempt ${attempt}/${retries})`)

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(30000), // 30초 타임아웃
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      const filePath = path.join(IMAGES_DIR, filename)

      fs.writeFileSync(filePath, buffer)
      console.log(`✓ Downloaded: ${filename}`)
      return true
    } catch (error) {
      console.error(`✗ Failed to download ${filename} (attempt ${attempt}/${retries}):`, error instanceof Error ? error.message : error)

      if (attempt === retries) {
        console.error(`❌ Giving up on ${filename} after ${retries} attempts`)
        return false
      }

      // 재시도 전 대기 (2초, 4초...)
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
    }
  }
  return false
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

// Notion API 직접 호출
async function getDatabase() {
  if (!process.env.NOTION_DATABASE_ID || !process.env.NOTION_API_KEY) {
    throw new Error('NOTION_DATABASE_ID and NOTION_API_KEY are required')
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      filter: {
        and: [
          {
            property: 'draft',
            checkbox: {
              equals: false,
            },
          },
          {
            property: 'publishAt',
            date: {
              on_or_before: new Date().toISOString(),
            },
          },
        ],
      },
      sorts: [
        {
          property: 'publishAt',
          direction: 'descending'
        }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

async function getPageBlocks(pageId: string): Promise<Array<unknown>> {
  const blocks = []
  let cursor: string | undefined = undefined

  while (true) {
    const url = new URL(`https://api.notion.com/v1/blocks/${pageId}/children`)
    url.searchParams.set('page_size', '100')
    if (cursor) {
      url.searchParams.set('start_cursor', cursor)
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    blocks.push(...data.results)
    if (!data.next_cursor) break
    cursor = data.next_cursor
  }

  return blocks
}

function extractCoverUrl(post: Record<string, unknown>): string | null {
  const cover = post.cover as { type: string; external?: { url: string }; file?: { url: string } } | null
  if (!cover) return null

  if (cover.type === 'external' && cover.external?.url) {
    return cover.external.url
  }
  if (cover.type === 'file' && cover.file?.url) {
    return cover.file.url
  }
  return null
}

export async function downloadNotionImages(): Promise<void> {
  console.log('Starting Notion image download...')

  await ensureDirExists(IMAGES_DIR)

  try {
    // 데이터베이스에서 모든 포스트 가져오기
    const database = await getDatabase()
    const posts = database.results

    const allImageUrls: string[] = []

    // 각 포스트에서 이미지 URL 수집 (커버 이미지 포함)
    for (const post of posts) {
      const title = post.properties.title.title[0]?.plain_text || 'Untitled'
      console.log(`Processing: ${title}`)

      // 커버 이미지 URL 추출
      const coverUrl = extractCoverUrl(post as Record<string, unknown>)
      if (coverUrl) {
        console.log(`  Found cover image`)
        allImageUrls.push(coverUrl)
      }

      const blocks = await getPageBlocks(post.id)
      const imageUrls = extractImageUrls(blocks)
      allImageUrls.push(...imageUrls)
    }

    // 정규화 키 기준으로 그룹화 (presigned URL 변경 대응)
    const imageGroups = new Map<string, Set<string>>()
    for (const url of allImageUrls) {
      const cacheKey = normalizeImageUrlForCache(url)
      const group = imageGroups.get(cacheKey) ?? new Set<string>()
      group.add(url)
      imageGroups.set(cacheKey, group)
    }
    console.log(`Found ${imageGroups.size} unique images`)

    // 이미지 다운로드
    let successCount = 0
    let failureCount = 0

    for (const [cacheKey, urls] of imageGroups) {
      const sourceUrl = urls.values().next().value
      if (!sourceUrl) continue

      const filename = generateImageFilename(cacheKey)
      const filePath = path.join(IMAGES_DIR, filename)

      // 이미 존재하면 스킵
      if (fs.existsSync(filePath)) {
        console.log(`⏭ Skipping existing: ${filename}`)
        continue
      }

      const success = await downloadImage(sourceUrl, filename)
      if (success) {
        successCount++
      } else {
        failureCount++
      }
    }

    console.log(`\n📊 Download Summary:`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${failureCount}`)
    console.log(`⏭ Skipped: ${imageGroups.size - successCount - failureCount}`)

    console.log('Image download completed!')

    // 이미지 맵 파일 생성 (URL -> 로컬 경로)
    const imageMap: Record<string, string> = {}
    for (const [cacheKey, urls] of imageGroups) {
      const filename = generateImageFilename(cacheKey)
      const filePath = path.join(IMAGES_DIR, filename)

      // 성공적으로 다운로드된 이미지만 맵에 추가
      if (fs.existsSync(filePath)) {
        const localPath = `/images/notion/${filename}`
        imageMap[cacheKey] = localPath

        // 기존 호환성: 원본 URL 키도 함께 유지
        for (const url of urls) {
          imageMap[url] = localPath
        }
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
loadEnvWithLocalFallback()
downloadNotionImages()
