import { cache } from 'react'

// Server-only 모듈 보호
import 'server-only'

// API 응답 타입 정의
interface NotionDatabaseResponse {
  results: Array<{
    id: string
    cover: {
      type: string
      external?: { url: string }
      file?: { url: string }
    } | null
    properties: {
      title: { title: Array<{ plain_text: string }> }
      slug: {
        rich_text: Array<{ plain_text: string }>
      }
      description?: { rich_text: Array<{ plain_text: string }> }
      publishAt?: { date: { start: string } }
      tags?: { multi_select: Array<{ name: string }> }
    }
  }>
  next_cursor?: string
  has_more: boolean
}

interface NotionPageResponse {
  id: string
  cover: {
    type: string
    external?: { url: string }
    file?: { url: string }
  } | null
  properties: Record<string, unknown>
}

interface NotionBlocksResponse {
  results: NotionBlockNode[]
  next_cursor?: string
  has_more: boolean
}

interface NotionBlockNode {
  id: string
  type: string
  has_children?: boolean
  children?: NotionBlockNode[]
  [key: string]: unknown
}

async function fetchBlockChildren(blockId: string): Promise<NotionBlockNode[]> {
  const blocks: NotionBlockNode[] = []
  let cursor: string | undefined = undefined

  while (true) {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`)
    url.searchParams.set('page_size', '100')
    if (cursor) {
      url.searchParams.set('start_cursor', cursor)
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: 3600 }, // 1시간 캐시
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as NotionBlocksResponse

    for (const block of data.results) {
      if (block.has_children) {
        const children = await fetchBlockChildren(block.id)
        block.children = children

        const blockContent = block[block.type]
        if (blockContent && typeof blockContent === 'object' && !Array.isArray(blockContent)) {
          ;(blockContent as Record<string, unknown>).children = children
        }
      }

      blocks.push(block)
    }

    if (!data.next_cursor) break
    cursor = data.next_cursor
  }

  return blocks
}

// 캐싱된 데이터베이스 쿼리
export const getDatabase = cache(async (): Promise<NotionDatabaseResponse> => {
  if (!process.env.NOTION_DATABASE_ID || !process.env.NOTION_API_KEY) {
    throw new Error('NOTION_DATABASE_ID and NOTION_API_KEY are required')
  }

  try {
    // 직접 fetch 사용
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
      }),
      next: { revalidate: 3600 } // 1시간 캐시
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Notion API Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    return await response.json() as NotionDatabaseResponse
  } catch (error) {
    console.error('Notion API Error:', error)
    throw new Error(`Failed to fetch database: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})

// 캐싱된 페이지 가져오기
export const getPage = cache(async (pageId: string): Promise<NotionPageResponse> => {
  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: 3600 } // 1시간 캐시
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json() as NotionPageResponse
  } catch (error) {
    console.error('Error fetching page:', error)
    throw new Error(`Failed to fetch page: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})

// 페이지 블록 가져오기
export const getPageBlocks = cache(async (pageId: string): Promise<Array<{
    id: string
    type: string
    has_children?: boolean
    children?: NotionBlockNode[]
    [key: string]: unknown
  }>> => {
  try {
    return await fetchBlockChildren(pageId)
  } catch (error) {
    console.error('Error fetching page blocks:', error)
    throw new Error(`Failed to fetch page blocks: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})

// 슬러그로 포스트 찾기
export const getPostBySlug = cache(async (slug: string) => {
  try {
    const database = await getDatabase()
    const posts = database.results as Array<{
      id: string
      cover: {
        type: string
        external?: { url: string }
        file?: { url: string }
      } | null
      properties: {
        title: { title: Array<{ plain_text: string }> }
        slug: {
          rich_text: Array<{ plain_text: string }>
        }
        description?: { rich_text: Array<{ plain_text: string }> }
        publishAt?: { date: { start: string } }
        tags?: { multi_select: Array<{ name: string }> }
      }
    }>

    return posts.find(
      (post) => post.properties.slug.rich_text[0]?.plain_text === slug || post.id === slug
    )
  } catch (error) {
    console.error('Error finding post by slug:', error)
    return null
  }
})

// 모든 포스트 슬러그 가져오기 (정적 경로 생성용)
export const getAllPostSlugs = cache(async () => {
  try {
    const database = await getDatabase()
    const posts = database.results as Array<{
      id: string
      properties: {
        title: { title: Array<{ plain_text: string }> }
        slug: {
          rich_text: Array<{ plain_text: string }>
        }
        description?: { rich_text: Array<{ plain_text: string }> }
        publishAt?: { date: { start: string } }
        tags?: { multi_select: Array<{ name: string }> }
      }
    }>

    return posts.map((post) => ({
      slug: post.properties.slug.rich_text[0]?.plain_text || post.id, // slug가 비어있으면 페이지 ID 사용
    }))
  } catch (error) {
    console.error('Error getting all post slugs:', error)
    return []
  }
})
