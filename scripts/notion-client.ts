// 빌드용 Notion API 클라이언트 (server-only 없음)

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
  results: Array<{
    id: string
    type: string
    [key: string]: unknown
  }>
  next_cursor?: string
  has_more: boolean
}

// 빌드용 데이터베이스 쿼리 (캐시 없음)
export async function getBuildDatabase(): Promise<NotionDatabaseResponse> {
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
}

// 빌드용 페이지 가져오기
export async function getBuildPage(pageId: string): Promise<NotionPageResponse> {
  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json() as NotionPageResponse
  } catch (error) {
    console.error('Error fetching page:', error)
    throw new Error(`Failed to fetch page: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// 빌드용 슬러그로 포스트 찾기
export async function getBuildPostBySlug(slug: string) {
  try {
    const database = await getBuildDatabase()
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
}

// 빌드용 모든 포스트 슬러그 가져오기
export async function getBuildAllPostSlugs() {
  try {
    const database = await getBuildDatabase()
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
}
