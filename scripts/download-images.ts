import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// .env.local 파일 로드
dotenv.config({ path: '.env.local' })

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'notion')

async function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
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

function generateImageUrl(url: string): string {
  // URL에서 파일 이름 생성
  const urlParts = url.split('/')
  const filename = urlParts[urlParts.length - 1] || 'image'

  // 확장자 추출 및 정리
  const extensionMatch = filename.match(/\.([a-zA-Z]+)(\?.*)?$/)
  const extension = extensionMatch ? extensionMatch[1] : 'png'

  // 해시 생성 (URL 기반)
  const hash = Buffer.from(url).toString('base64').replace(/[+/=]/g, '').substring(0, 8)

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

export async function downloadNotionImages(): Promise<void> {
  console.log('Starting Notion image download...')

  await ensureDirExists(IMAGES_DIR)

  try {
    // 데이터베이스에서 모든 포스트 가져오기
    const database = await getDatabase()
    const posts = database.results

    const allImageUrls: string[] = []

    // 각 포스트에서 이미지 URL 수집
    for (const post of posts) {
      const title = post.properties.title.title[0]?.plain_text || 'Untitled'
      console.log(`Processing: ${title}`)
      const blocks = await getPageBlocks(post.id)
      const imageUrls = extractImageUrls(blocks)
      allImageUrls.push(...imageUrls)
    }

    // 중복 제거
    const uniqueUrls = [...new Set(allImageUrls)]
    console.log(`Found ${uniqueUrls.length} unique images`)

    // 이미지 다운로드
    let successCount = 0
    let failureCount = 0

    for (const url of uniqueUrls) {
      const filename = generateImageUrl(url)
      const filePath = path.join(IMAGES_DIR, filename)

      // 이미 존재하면 스킵
      if (fs.existsSync(filePath)) {
        console.log(`⏭ Skipping existing: ${filename}`)
        continue
      }

      const success = await downloadImage(url, filename)
      if (success) {
        successCount++
      } else {
        failureCount++
      }
    }

    console.log(`\n📊 Download Summary:`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${failureCount}`)
    console.log(`⏭ Skipped: ${uniqueUrls.length - successCount - failureCount}`)

    console.log('Image download completed!')

    // 이미지 맵 파일 생성 (URL -> 로컬 경로)
    const imageMap: Record<string, string> = {}
    for (const url of uniqueUrls) {
      const filename = generateImageUrl(url)
      const filePath = path.join(IMAGES_DIR, filename)

      // 성공적으로 다운로드된 이미지만 맵에 추가
      if (fs.existsSync(filePath)) {
        imageMap[url] = `/images/notion/${filename}`
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
downloadNotionImages()
