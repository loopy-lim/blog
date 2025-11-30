# Notion 통합 스펙

## 개요

Notion을 CMS로 활용하여 블로그 콘텐츠를 관리하고, Next.js에서 이를 렌더링합니다.

## 통합 방식

### 선택: `@notionhq/client` v2+ + React Server Components (**현대적 권장**)

**특징**:
- Database ID 기반 쿼리 (기존 방식 유지)
- **Server Components 호환** v2+부터 완벽 지원
- `cache()` 함수와 자동 캐싱 통합
- 공식 Notion API

**장점**:
- ✅ **Next.js 15/16 완벽 호환**
- ✅ **Server Components에서 직접 사용 가능**
- ✅ Database 필터링 강력 (draft, status 등)
- ✅ `cache()` 함수로 자동 캐싱
- ✅ TypeScript 완벽 지원
- ✅ 현재 Notion Database 구조 그대로 사용
- ✅ Turbopack 빌드 최적화 지원

**현대적 패턴**:
```typescript
// Server Components에서 데이터 페칭 + 캐싱
export const getDatabase = cache(async () => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: { property: 'draft', checkbox: { equals: false } }
  })
  return response.results
})
```

**왜 이 방식인가?**
- **미래 보장**: Next.js 15/16의 Server Components 생태계에 최적화
- **성능**: 서버 사이드에서 직접 데이터 페칭으로 클라이언트 부하 감소
- **캐싱**: React의 `cache()` 함수로 중복 API 호출 방지
- **단순함**: `react-notion-x` 없이도 충분히 강력한 기능 제공

---

## 의존성

```bash
# Notion 공식 SDK (Server Components 호환)
pnpm add @notionhq/client

# Modern 유틸리티
pnpm add date-fns clsx tailwind-merge

# Server Components 보호
pnpm add server-only

# 옵션: Markdown 변환 (필요시)
pnpm add notional # Notion → Markdown 변환기
```

---

## 환경 변수

### `.env.local`
```bash
# Notion Database ID (기존과 동일)
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Notion API Token (공식 Integration)
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 사이트 공개 정보
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_AUTHOR_NAME="Your Name"
```

### 환경 변수 추출 방법

#### `NOTION_DATABASE_ID`
1. Notion에서 블로그 데이터베이스 페이지 열기
2. 우측 상단 `⋯` → `Copy link to view`
3. URL에서 Database ID 추출
   - 형식: `https://www.notion.so/{workspace}/{database_id}?v={view_id}`
   - `database_id` 부분 (32자리)

#### `NOTION_API_TOKEN` (공식)
1. [Notion Integrations](https://www.notion.so/my-integrations) 페이지 접속
2. `+ New integration` 클릭
3. Integration 정보 입력:
   - Name: `Blog Integration`
   - Associated workspace: 블로그 워크스페이스 선택
   - Capabilities: `Read content` 체크
4. `Submit` → Secret Token 복사 (`secret_...`으로 시작)
5. **중요**: Database 페이지에서 Integration 연결
   - Database 페이지 우측 상단 `⋯` → `Add connections` → Integration 추가

---

## API 래퍼: `lib/notion.ts` (Modern Server Components)

### 기본 구조

```typescript
import { Client } from '@notionhq/client'
import { cache } from 'react'

// Server-only 모듈 보호
import 'server-only'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

/**
 * ✅ 캐싱된 데이터베이스 쿼리 - React Server Components 최적화
 * 동일한 요청에 대해 API 호출 중복 방지
 */
export const getDatabase = cache(async () => {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error('NOTION_DATABASE_ID is required')
  }

  return await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      and: [
        {
          property: 'draft',
          checkbox: {
            equals: false, // draft가 아닌 것만
          },
        },
        {
          property: 'publishAt',
          date: {
            on_or_before: new Date().toISOString(), // 예약 발행 방지
          },
        },
      ],
    },
    sorts: [
      {
        property: 'publishAt',
        direction: 'descending', // 최신순
      },
    ],
  })
})

/**
 * ✅ 캐싱된 개별 페이지 가져오기
 */
export const getPage = cache(async (pageId: string) => {
  return await notion.pages.retrieve({ page_id: pageId })
})

/**
 * ✅ 캐싱된 페이지 블록 가져오기 (콘텐츠)
 */
export const getPageBlocks = cache(async (pageId: string) => {
  const blocks = []
  let cursor: string | undefined = undefined

  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    blocks.push(...results)

    if (!next_cursor) break
    cursor = next_cursor
  }

  return blocks
})

// 레거시 호환성 (기존 코드와 호환)
export async function queryDatabase() {
  return await getDatabase()
}

/**
 * 개별 페이지 가져오기
 */
export async function getPage(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId })
  return page
}

/**
 * 페이지 블록 가져오기 (콘텐츠)
 */
export async function getBlocks(blockId: string) {
  const blocks = []
  let cursor: string | undefined = undefined

  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })

    blocks.push(...results)

    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }

  return blocks
}
```

### 에러 핸들링

```typescript
import { APIErrorCode, isNotionClientError } from '@notionhq/client'

export async function queryDatabase() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      // ...
    })
    return response.results
  } catch (error) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case APIErrorCode.ObjectNotFound:
          throw new Error('Database not found. Check NOTION_DATABASE_ID.')
        case APIErrorCode.Unauthorized:
          throw new Error('Invalid API token or missing database connection.')
        case APIErrorCode.RateLimited:
          console.warn('Rate limited. Retrying...')
          // 재시도 로직
          break
        default:
          throw new Error(`Notion API error: ${error.message}`)
      }
    }
    throw error
  }
}
```

---

## 유틸리티: `lib/notion-utils.ts`

### 포스트 메타데이터 추출

```typescript
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

export interface PostMetadata {
  id: string
  title: string
  slug: string
  description?: string
  publishedAt?: Date
  tags?: string[]
  coverImage?: string
  draft: boolean
}

/**
 * Notion Page에서 속성 값 추출
 */
export function getProperty(
  page: PageObjectResponse,
  propertyName: string
): any {
  const property = page.properties[propertyName]

  if (!property) return null

  switch (property.type) {
    case 'title':
      return property.title[0]?.plain_text || ''
    case 'rich_text':
      return property.rich_text[0]?.plain_text || ''
    case 'date':
      return property.date?.start ? new Date(property.date.start) : null
    case 'checkbox':
      return property.checkbox
    case 'multi_select':
      return property.multi_select.map((item) => item.name)
    case 'select':
      return property.select?.name || null
    default:
      return null
  }
}

/**
 * Page를 PostMetadata로 변환
 */
export function pageToPost(page: PageObjectResponse): PostMetadata {
  return {
    id: page.id,
    title: getProperty(page, 'title'),
    slug: getProperty(page, 'slug'),
    description: getProperty(page, 'description'),
    publishedAt: getProperty(page, 'publishAt'),
    tags: getProperty(page, 'tags'),
    coverImage: page.cover?.type === 'external' 
      ? page.cover.external.url 
      : page.cover?.type === 'file' 
      ? page.cover.file.url 
      : undefined,
    draft: getProperty(page, 'draft'),
  }
}
```

### 블로그 포스트 목록 가져오기

```typescript
import { queryDatabase } from './notion'
import { pageToPost } from './notion-utils'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

/**
 * 모든 포스트 메타데이터 가져오기
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  const pages = await queryDatabase()
  
  const posts = pages
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(pageToPost)
    .filter((post) => !post.draft) // draft 이중 필터링 (안전장치)
  
  return posts
}

/**
 * Slug로 포스트 찾기
 */
export async function getPostBySlug(slug: string): Promise<PostMetadata | null> {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === slug) || null
}
```

---

## 데이터 페칭 전략

### ISR + Server Components + Streaming (Modern Next.js 15)

#### 블로그 목록 페이지 (ISR + Suspense)
```typescript
// app/blog/page.tsx
import { Suspense } from 'react'
import { getDatabase } from '@/lib/notion'
import { PostList } from '@/components/blog/PostList'
import { PostListSkeleton } from '@/components/blog/PostListSkeleton'

// 1시간마다 재검증
export const revalidate = 3600

export default async function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <Suspense fallback={<PostListSkeleton />}>
        <PostListWrapper />
      </Suspense>
    </main>
  )
}

async function PostListWrapper() {
  const database = await getDatabase()
  return <PostList posts={database.results} />
}
```

#### 개별 포스트 페이지 (ISR + Streaming + Metadata)
```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getDatabase, getPageBlocks } from '@/lib/notion'
import { NotionContent } from '@/components/blog/NotionContent'
import { PostSkeleton } from '@/components/blog/PostSkeleton'

// 1시간마다 재검증
export const revalidate = 3600

// 정적 경로 생성 (빌드 타임)
export async function generateStaticParams() {
  const database = await getDatabase()
  const posts = database.results as any[]

  return posts.map((post) => ({
    slug: post.properties.slug.rich_text[0]?.plain_text,
  }))
}

// 페이지별 동적 Metadata 생성
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const database = await getDatabase()
  const posts = database.results as any[]
  const post = posts.find(
    (p) => p.properties.slug.rich_text[0]?.plain_text === params.slug
  )

  if (!post) return {}

  return {
    title: post.properties.title.title[0]?.plain_text,
    description: post.properties.description?.rich_text[0]?.plain_text,
    openGraph: {
      title: post.properties.title.title[0]?.plain_text,
      description: post.properties.description?.rich_text[0]?.plain_text,
      type: 'article',
      publishedTime: post.properties.publishAt?.date?.start,
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const database = await getDatabase()
  const posts = database.results as any[]
  const post = posts.find(
    (p) => p.properties.slug.rich_text[0]?.plain_text === params.slug
  )

  if (!post) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {post.properties.title.title[0]?.plain_text}
          </h1>

          {post.properties.publishAt?.date && (
            <time className="text-gray-600">
              {new Date(post.properties.publishAt.date.start).toLocaleDateString()}
            </time>
          )}
        </header>

        <Suspense fallback={<PostSkeleton />}>
          <NotionContent pageId={post.id} />
        </Suspense>
      </article>
    </main>
  )
}
```

---

## Notion 콘텐츠 렌더링 (Server Components 최적화)

### ✅ 추천: 커스텀 Server Components 렌더러

**왜 이 방식인가?**
- `react-notion-x`는 Client Component 기반으로 Server Components와 호환성 문제
- 직접 만들면 더 가볍고 성능이 좋음
- Next.js 15의 최적화 활용 가능

#### `components/blog/NotionContent.tsx` - Server Component
```typescript
import { getPageBlocks } from '@/lib/notion'
import { BlockRenderer } from './BlockRenderer'

interface NotionContentProps {
  pageId: string
}

export async function NotionContent({ pageId }: NotionContentProps) {
  const blocks = await getPageBlocks(pageId)

  return (
    <article className="notion-content prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </article>
  )
}
```

#### `components/blog/BlockRenderer.tsx` - 재사용 가능한 렌더러
```typescript
import type { BlockObjectResponse } from '@notionhq/client'
import Image from 'next/image'
import { CodeBlock } from './CodeBlock'
import { CalloutBlock } from './CalloutBlock'

interface BlockRendererProps {
  block: BlockObjectResponse
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mb-4 leading-relaxed">
          {block.paragraph.rich_text.map((text, index) => (
            <span
              key={index}
              className={text.annotations.bold ? 'font-bold' :
                       text.annotations.italic ? 'italic' :
                       text.annotations.strikethrough ? 'line-through' : ''}
              style={{ color: text.annotations.color !== 'default' ?
                      `var(--notion-color-${text.annotations.color})` : undefined }}
            >
              {text.plain_text}
            </span>
          ))}
        </p>
      )

    case 'heading_1':
      return (
        <h1 className="text-3xl font-bold mb-4 mt-8">
          {block.heading_1.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </h1>
      )

    case 'heading_2':
      return (
        <h2 className="text-2xl font-bold mb-3 mt-6">
          {block.heading_2.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </h2>
      )

    case 'heading_3':
      return (
        <h3 className="text-xl font-bold mb-2 mt-4">
          {block.heading_3.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </h3>
      )

    case 'bulleted_list_item':
      return (
        <li className="mb-2 list-disc ml-6">
          {block.bulleted_list_item.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </li>
      )

    case 'numbered_list_item':
      return (
        <li className="mb-2 list-decimal ml-6">
          {block.numbered_list_item.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </li>
      )

    case 'image':
      const imageUrl = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url

      return (
        <div className="my-6">
          <Image
            src={imageUrl}
            alt={block.image.caption?.[0]?.plain_text || 'Notion image'}
            width={800}
            height={400}
            className="rounded-lg shadow-md"
            priority={false}
          />
          {block.image.caption && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {block.image.caption[0]?.plain_text}
            </p>
          )}
        </div>
      )

    case 'code':
      return (
        <div className="my-4">
          <CodeBlock
            code={block.code.rich_text[0]?.plain_text || ''}
            language={block.code.language}
          />
        </div>
      )

    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">
          {block.quote.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </blockquote>
      )

    case 'callout':
      return <CalloutBlock block={block.callout} />

    case 'divider':
      return <hr className="my-8 border-gray-300" />

    // 추가 블록 타입들...
    default:
      // 개발 중에만 디버깅
      if (process.env.NODE_ENV === 'development') {
        console.log('Unhandled block type:', block.type, block)
      }
      return null
  }
}
```

#### Code Block 컴포넌트 (Syntax Highlighting)
```typescript
// components/blog/CodeBlock.tsx
'use client' // Syntax highlighting이 필요하므로 Client Component

import { useEffect, useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'plaintext' }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState(code)

  useEffect(() => {
    // 간단한 syntax highlighting (필요시 라이브러리 추가)
    // 예: Prism.js, Highlight.js 등
    setHighlightedCode(code)
  }, [code, language])

  return (
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 uppercase">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-gray-400 hover:text-gray-200"
        >
          Copy
        </button>
      </div>
      <pre className="text-sm leading-relaxed">
        <code>{highlightedCode}</code>
      </pre>
    </div>
  )
}
```

---

## 타입 정의: `types/notion.ts`

```typescript
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export interface PostMetadata {
  id: string
  title: string
  slug: string
  description?: string
  publishedAt?: Date
  tags?: string[]
  coverImage?: string
  draft: boolean
}

export type NotionPage = PageObjectResponse
```

---

## 성능 최적화

### 1. 병렬 데이터 페칭
```typescript
const [posts, siteConfig] = await Promise.all([
  getAllPosts(),
  getSiteConfig(),
])
```

### 2. 캐싱
```typescript
import { cache } from 'react'

export const getCachedPosts = cache(async () => {
  return await getAllPosts()
})
```

### 3. Revalidate 설정
- 자주 업데이트: `revalidate = 60` (1분)
- 가끔 업데이트: `revalidate = 3600` (1시간)
- 거의 변경 없음: `revalidate = 86400` (1일)

---

## 보안 고려사항

### 환경 변수 보호
- `.env.local`은 **절대 Git에 커밋하지 않음**
- `.gitignore`에 `.env*.local` 추가

### Token 관리
- `NOTION_API_TOKEN`는 **서버 사이드에서만** 사용
- 클라이언트에 노출 금지 (`NEXT_PUBLIC_` 접두사 사용 안 함)

### Integration 권한
- 최소 권한 원칙: `Read content`만 활성화
- 필요한 Database만 연결
