import blogDataJson from '../data/blog.json'

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

function toSafeBlogData(raw: unknown): BlogData {
  if (!raw || typeof raw !== 'object') {
    return EMPTY_BLOG_DATA
  }

  const candidate = raw as { posts?: unknown; lastUpdated?: unknown }
  if (!Array.isArray(candidate.posts)) {
    return {
      ...EMPTY_BLOG_DATA,
      lastUpdated:
        typeof candidate.lastUpdated === 'string'
          ? candidate.lastUpdated
          : EMPTY_BLOG_DATA.lastUpdated,
    }
  }

  const posts: PostData[] = candidate.posts
    .map((post): PostData | null => {
      if (!post || typeof post !== 'object') return null

      const item = post as Record<string, unknown>
      if (
        typeof item.id !== 'string' ||
        typeof item.title !== 'string' ||
        typeof item.slug !== 'string' ||
        typeof item.description !== 'string' ||
        typeof item.publishedAt !== 'string' ||
        !Array.isArray(item.tags)
      ) {
        return null
      }

      const tags = item.tags.filter((tag): tag is string => typeof tag === 'string')

      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        publishedAt: item.publishedAt,
        tags,
        coverImage: typeof item.coverImage === 'string' ? item.coverImage : undefined,
      }
    })
    .filter((post): post is PostData => post !== null)

  return {
    posts,
    lastUpdated:
      typeof candidate.lastUpdated === 'string'
        ? candidate.lastUpdated
        : EMPTY_BLOG_DATA.lastUpdated,
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
