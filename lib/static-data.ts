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
  if (!(await dataExists())) {
    throw new Error('Blog data not found. Please run "pnpm build-data" first.')
  }

  const data = await fs.readFile(path.join(DATA_DIR, 'blog.json'), 'utf-8')
  return JSON.parse(data)
}

// 개별 포스트 데이터 가져오기
export async function getStaticPostBySlug(slug: string): Promise<PostData | null> {
  if (!(await dataExists())) {
    throw new Error('Blog data not found. Please run "pnpm build-data" first.')
  }

  try {
    const data = await fs.readFile(path.join(DATA_DIR, `post-${slug}.json`), 'utf-8')
    return JSON.parse(data)
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
