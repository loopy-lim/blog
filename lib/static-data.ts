import fs from 'fs/promises'
import path from 'path'

export interface PostData {
  id: string
  title: string
  slug: string
  description: string
  publishedAt: string
  tags: string[]
  coverImage?: string
}

export interface BlogData {
  posts: PostData[]
  lastUpdated: string
}

const DATA_DIR = path.join(process.cwd(), 'data')

// 빌드된 데이터 확인
async function dataExists() {
  try {
    await fs.access(path.join(DATA_DIR, 'blog.json'))
    return true
  } catch {
    return false
  }
}

// 전체 블로그 데이터 가져오기
export async function getStaticDatabase(): Promise<BlogData> {
  try {
    if (!(await dataExists())) {
      console.warn('Blog data not found, returning empty data')
      return {
        posts: [],
        lastUpdated: new Date().toISOString(),
      }
    }

    const data = await fs.readFile(path.join(DATA_DIR, 'blog.json'), 'utf-8')

    // 빈 파일이나 잘못된 JSON인 경우 방어
    if (!data || data.trim() === '') {
      console.warn('Empty blog data file, returning empty data')
      return {
        posts: [],
        lastUpdated: new Date().toISOString(),
      }
    }

    try {
      return JSON.parse(data)
    } catch (parseError) {
      console.error('Error parsing blog data JSON:', parseError)
      return {
        posts: [],
        lastUpdated: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('Error reading blog data:', error)
    // 에러 발생 시 빈 데이터 반환
    return {
      posts: [],
      lastUpdated: new Date().toISOString(),
    }
  }
}

// 개별 포스트 데이터 가져오기
export async function getStaticPostBySlug(slug: string): Promise<PostData | null> {
  try {
    if (!(await dataExists())) {
      console.warn('Blog data not found for slug:', slug)
      return null
    }

    const data = await fs.readFile(path.join(DATA_DIR, `post-${slug}.json`), 'utf-8')
    try {
      return JSON.parse(data)
    } catch {
      console.error(`Error parsing post data for slug: ${slug}`)
      return null
    }
  } catch {
    return null
  }
}

// 모든 포스트 slug 목록 가져오기
export async function getStaticAllPostSlugs() {
  const blogData = await getStaticDatabase()
  return blogData.posts.map(post => ({
    slug: post.slug,
  }))
}
