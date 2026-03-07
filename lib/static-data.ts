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

// 관련 글 가져오기 (같은 태그 기반, 최대 3개)
export async function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  limit = 3
): Promise<PostData[]> {
  const blogData = await getStaticDatabase()
  const currentSlugLower = currentSlug.toLowerCase()

  // 현재 글 제외
  const otherPosts = blogData.posts.filter(
    (post) => post.slug.toLowerCase() !== currentSlugLower
  )

  // 같은 태그를 가진 글 찾기
  const currentTagsLower = currentTags.map((t) => t.toLowerCase())
  const postsWithScore = otherPosts.map((post) => {
    const postTagsLower = post.tags.map((t) => t.toLowerCase())
    const matchingTags = postTagsLower.filter((t) => currentTagsLower.includes(t))
    return {
      post,
      score: matchingTags.length,
    }
  })

  // 태그 매칭 점수로 정렬, 같으면 최신순
  postsWithScore.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime()
  })

  // 태그가 겹치는 글이 있으면 우선 반환, 없으면 최신 글 반환
  const relatedPosts = postsWithScore.filter((p) => p.score > 0)
  if (relatedPosts.length >= limit) {
    return relatedPosts.slice(0, limit).map((p) => p.post)
  }

  // 태그가 겹치는 글이 부족하면 최신 글로 채움
  return postsWithScore.slice(0, limit).map((p) => p.post)
}
