import fs from 'fs/promises'
import path from 'path'
import { config } from 'dotenv'
import { getBuildDatabase, getBuildAllPostSlugs, getBuildPostBySlug } from './notion-client'
import { siteConfig } from '../site.config'

// 환경변수 로드
config({ path: '.env.local' })

// 데이터 저장 경로
const DATA_DIR = path.join(process.cwd(), 'data')

export interface PostData {
  id: string
  title: string
  slug: string
  description: string
  publishedAt: string
  tags: string[]
  coverImage?: string
  content?: any
}

export interface BlogData {
  posts: PostData[]
  lastUpdated: string
}

// 데이터 디렉토리 생성
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// 모든 포스트 데이터 수집
async function collectAllPostsData(): Promise<PostData[]> {
  console.log('🔍 Collecting posts data from Notion...')

  const database = await getBuildDatabase()
  const posts: PostData[] = []

  for (const post of database.results) {
    try {
      const typedPost = post as any
      const title = typedPost.properties.title.title[0]?.plain_text || 'Untitled'
      const slug = typedPost.properties.slug.rich_text[0]?.plain_text || typedPost.id
      const description = typedPost.properties.description?.rich_text[0]?.plain_text || ''
      const publishedAt = typedPost.properties.publishAt?.date?.start || new Date().toISOString()
      const tags = typedPost.properties.tags?.multi_select?.map((tag: any) => tag.name) || []

      const coverUrl = typedPost.cover?.type === 'external'
        ? typedPost.cover.external?.url
        : typedPost.cover?.file?.url

      posts.push({
        id: typedPost.id,
        title,
        slug,
        description,
        publishedAt,
        tags,
        coverImage: coverUrl || undefined,
      })

      console.log(`✓ Processed: ${title}`)
    } catch (error) {
      console.error(`Error processing post:`, error)
    }
  }

  return posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

// 블로그 데이터 JSON 파일 생성
async function generateBlogData() {
  console.log('📝 Generating blog data...')

  await ensureDataDir()

  const posts = await collectAllPostsData()
  const blogData: BlogData = {
    posts,
    lastUpdated: new Date().toISOString(),
  }

  // 전체 블로그 데이터 저장
  await fs.writeFile(
    path.join(DATA_DIR, 'blog.json'),
    JSON.stringify(blogData, null, 2),
    'utf-8'
  )

  // 개별 포스트 데이터 저장
  for (const post of posts) {
    const postFilePath = path.join(DATA_DIR, `post-${post.slug}.json`)
    await fs.writeFile(
      postFilePath,
      JSON.stringify(post, null, 2),
      'utf-8'
    )
  }

  console.log(`✅ Generated data for ${posts.length} posts`)
  console.log(`📁 Data saved to: ${DATA_DIR}`)
}

// 빌드 시점 데이터 생성 함수
export async function buildData() {
  try {
    await generateBlogData()
    console.log('🎉 Data build completed successfully!')
  } catch (error) {
    console.error('❌ Data build failed:', error)
    throw error
  }
}

// 스크립트로 실행될 때
buildData().catch(console.error)
