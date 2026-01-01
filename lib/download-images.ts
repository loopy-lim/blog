import fs from 'fs'
import path from 'path'
import { getDatabase, getPageBlocks } from './notion.js'

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'notion')

async function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
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

    // 중복 제거
    const uniqueUrls = [...new Set(allImageUrls)]
    console.log(`Found ${uniqueUrls.length} unique images`)

    // 이미지 다운로드
    for (const url of uniqueUrls) {
      const filename = generateImageUrl(url)
      const filePath = path.join(IMAGES_DIR, filename)

      // 이미 존재하면 스킵
      if (fs.existsSync(filePath)) {
        console.log(`Skipping existing: ${filename}`)
        continue
      }

      await downloadImage(url, filename)
    }

    console.log('Image download completed!')

    // 이미지 맵 파일 생성 (URL -> 로컬 경로)
    const imageMap: Record<string, string> = {}
    for (const url of uniqueUrls) {
      const filename = generateImageUrl(url)
      imageMap[url] = `/images/notion/${filename}`
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
