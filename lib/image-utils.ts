import 'server-only'
import fs from 'node:fs'
import path from 'node:path'

const NOTION_SIGNED_IMAGE_HOSTS = new Set([
  'prod-files-secure.s3.us-west-2.amazonaws.com',
  's3.us-west-2.amazonaws.com',
])
const NOTION_IMAGE_HOSTS = new Set([
  ...NOTION_SIGNED_IMAGE_HOSTS,
  'www.notion.so',
])

interface ImageMap {
  [url: string]: string
}

let cachedImageMap: ImageMap | null = null

function loadImageMap(): ImageMap {
  if (cachedImageMap) {
    return cachedImageMap
  }

  const mapPath = path.join(process.cwd(), 'lib', 'image-map.json')

  try {
    if (!fs.existsSync(mapPath)) {
      cachedImageMap = {}
      return cachedImageMap
    }

    const raw = fs.readFileSync(mapPath, 'utf8')
    cachedImageMap = JSON.parse(raw) as ImageMap
    return cachedImageMap
  } catch (error) {
    console.warn('Failed to load image map, using source image URLs:', error)
    cachedImageMap = {}
    return cachedImageMap
  }
}

function normalizeImageUrlForCache(imageUrl: string): string {
  try {
    const parsed = new URL(imageUrl)
    const base = `${parsed.origin}${parsed.pathname}`

    // Notion presigned S3 URLs change their query string frequently.
    if (NOTION_SIGNED_IMAGE_HOSTS.has(parsed.hostname)) {
      return base
    }

    return parsed.search ? `${base}${parsed.search}` : base
  } catch {
    return imageUrl
  }
}

function isNotionManagedUrl(imageUrl: string): boolean {
  try {
    const parsed = new URL(imageUrl)
    return NOTION_IMAGE_HOSTS.has(parsed.hostname)
  } catch {
    return false
  }
}

export function getLocalImagePath(notionImageUrl: string): string {
  const map = loadImageMap()

  // URL 매핑이 있으면 로컬 경로 반환
  if (map[notionImageUrl]) {
    return map[notionImageUrl]
  }

  // Presigned URL 쿼리 제거 키로 재시도
  const normalizedUrl = normalizeImageUrlForCache(notionImageUrl)
  if (map[normalizedUrl]) {
    return map[normalizedUrl]
  }

  if (isNotionManagedUrl(notionImageUrl)) {
    // CI/CD에서 Notion 일시 오류(예: 502)로 이미지 맵 생성이 실패해도 빌드는 계속 진행한다.
    return notionImageUrl
  }

  // Non-Notion external images still fall back to original URL.
  return notionImageUrl
}

// Default covers for posts without a cover image
export const DEFAULT_COVERS = [
  'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1400&q=80', // Minimalist Gold/Grey
  'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=1400&q=80', // Dark moody lighting
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1400&q=80', // Abstract Gradient
  'https://images.unsplash.com/photo-1483794344563-d27a8d18014e?auto=format&fit=crop&w=1400&q=80', // Cold landscape
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=80', // Abstract fluid
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1400&q=80', // Colorful Gradient
]

export function getDefaultCover(id: string): string {
  if (!id) return DEFAULT_COVERS[0]
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % DEFAULT_COVERS.length
  return DEFAULT_COVERS[index]
}
