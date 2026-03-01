import blogDataJson from '../data/blog.json'
import { z } from 'zod'

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

const EMPTY_BLOG_DATA: BlogData = {
  posts: [],
  lastUpdated: new Date().toISOString(),
}

const PostDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string()),
  coverImage: z.string().optional(),
})

const RawBlogDataSchema = z.object({
  posts: z.array(z.unknown()).optional(),
  lastUpdated: z.string().optional(),
})

function toSafeBlogData(raw: unknown): BlogData {
  const parsedBlogData = RawBlogDataSchema.safeParse(raw)
  if (!parsedBlogData.success) {
    return EMPTY_BLOG_DATA
  }

  const posts = (parsedBlogData.data.posts ?? [])
    .map((post) => PostDataSchema.safeParse(post))
    .filter((result): result is { success: true; data: PostData } => result.success)
    .map((result) => result.data)

  return {
    posts,
    lastUpdated: parsedBlogData.data.lastUpdated ?? EMPTY_BLOG_DATA.lastUpdated,
  }
}

// 전체 블로그 데이터 가져오기
export async function getStaticDatabase(): Promise<BlogData> {
  try {
    return toSafeBlogData(blogDataJson)
  } catch (error) {
    console.error('Error loading static blog data:', error)
    return EMPTY_BLOG_DATA
  }
}

// 개별 포스트 데이터 가져오기
export async function getStaticPostBySlug(slug: string): Promise<PostData | null> {
  try {
    const blogData = await getStaticDatabase()
    return blogData.posts.find((post) => post.slug === slug) || null
  } catch (error) {
    console.error(`Error loading post data for slug: ${slug}`, error)
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
