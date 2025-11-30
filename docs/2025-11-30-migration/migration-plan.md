# Astro + Notion → Next.js + Notion 마이그레이션 계획

## 개요

현재 Astro 프레임워크와 Notion을 사용한 블로그를 **Next.js 15/16 + Notion** 조합으로 마이그레이션합니다.

**🚨 중요**: 2skydev 레포지토리가 2025년 4월에 archived되어 **Modern Next.js 패턴 기반으로 새로 작성**합니다.

### 참고 자료 (2024 최신)
- **Vercel Templates**: Notion + Next.js 15 App Router 예제
- **Next.js 15 공식 문서**: Server Components 및 ISR 패턴
- **2024년 커뮤니티 예제**: RSC + Notion API 통합 사례들

---

## 현재 프로젝트 분석

### 기술 스택
- **프레임워크**: Astro 5.11.1
- **Notion 연동**: `@ntcho/notion-astro-loader` (데이터베이스 쿼리 방식)
- **스타일링**: Tailwind CSS 4.1.11
- **React**: 19.1.0 (컴포넌트용)
- **패키지 매니저**: pnpm 10.13.1

### 현대화 목표
- **Next.js 15**: Turbopack, Server Actions, PPR 개선 활용
- **React Server Components**: 데이터 페칭 최적화
- **Partial Prerendering**: 블로그 목록 + 개별 포스트
- **Modern Caching**: `cache()` 함수 활용

### 주요 구조
```
src/
├── components/      # React 컴포넌트들
├── content.config.ts # Notion 데이터베이스 설정
├── pages/           # Astro 페이지 (index, blog, about-me)
├── layouts/         # 레이아웃
└── styles/          # CSS 파일
```

### Notion 연동 방식
- **Database ID** 기반으로 포스트 쿼리
- 필터링: `draft=false`인 항목만 표시
- 속성: `title`, `description`, `publishAt`, `modifiedAt`, `tags`, `slug`
- 환경변수: `NOTION_API_KEY`, `NOTION_DATABASE_ID`

---

## 목표 프로젝트 아키텍처 (Modern Next.js 15)

### 핵심 기술 스택
- **프레임워크**: Next.js 15 (App Router + Turbopack)
- **Notion SDK**: `@notionhq/client` v2+ (공식, Server Components 호환)
- **렌더링**: ISR + Partial Prerendering + React Server Components
- **스타일**: Tailwind CSS (유지) + CSS Variables (테마)
- **타입스크립트**: Strict mode
- **캐싱**: Next.js 내장 캐시 + `cache()` 함수

### 현대적 패턴
```typescript
// Server Components에서 데이터 페칭
async function getAllPosts() {
  const cached = cache(async () => {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'draft',
        checkbox: { equals: false }
      }
    })
    return response.results
  })

  return cached()
}

// React 19 Streaming + Suspense
export default function BlogPage() {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostList />
    </Suspense>
  )
}
```

### 주요 기능
- Notion Database → Server Components 렌더링
- **SEO 최적화**: Next.js 15 Metadata API
- **성능 최적화**: PPR, Turbopack, 이미지 자동 최적화
- **반응형 디자인**: Tailwind + Container Queries
- **다크모드**: CSS Variables + Server Actions

### 예상 구조
```
app/                           # Next.js App Router
├── layout.tsx                 # 루트 레이아웃 (Server Component)
├── page.tsx                   # 홈페이지
├── globals.css                # CSS Variables + Tailwind
├── loading.tsx                # 전역 로딩 UI
├── blog/
│   ├── page.tsx              # 블로그 목록 (Server Component)
│   ├── loading.tsx           # 블로그 로딩
│   └── [slug]/
│       ├── page.tsx          # 개별 포스트 (Server Component)
│       └── loading.tsx       # 포스트 로딩
├── about/
│   └── page.tsx              # About 페이지
└── api/
    └── notion/               # Server Actions (선택)

components/                    # 컴포넌트
├── ui/                       # 기본 UI 컴포넌트 (Server)
├── layout/                   # Header, Footer
├── blog/                     # 블로그 관련
│   ├── PostCard.tsx          # (Server Component)
│   ├── PostList.tsx          # (Server Component)
│   └── NotionContent.tsx     # Notion 렌더링 (Server + Client)
└── providers/                # 클라이언트 프로바이더들

lib/                          # 유틸리티
├── notion.ts                 # @notionhq/client 래퍼
├── notion-renderer.ts        # Notion 콘텐츠 렌더링 로직
├── cache.ts                  # 캐싱 헬퍼
└── utils.ts                  # 공통 유틸리티

types/                        # TypeScript 타입
├── notion.ts
└── blog.ts

site.config.ts                # 사이트 설정
next.config.ts               # Next.js 15 설정 (PPR 활성화)
tailwind.config.ts           # Tailwind 4 설정
```

---

## 🎯 Modern Next.js 15 전략

> [!IMPORTANT]
> **현대적 패턴 선택**
>
> **✅ 권장 방식**: `@notionhq/client` v2+ + React Server Components
> - Database 쿼리 방식 유지 (현재 Notion Database 구조 그대로)
> - Server Components에서 데이터 페칭 최적화
> - `cache()` 함수로 자동 캐싱
> - `react-notion-x` 대신 커스텀 렌더러로 호환성 개선

> [!NOTE]
> **마이그레이션 전략**
>
> **점진적 교체** (권장):
> 1. 현재 프로젝트에 Next.js 15 레이어 추가
> 2. `/app` 디렉토리 생성 후 App Router 구성
> 3. 기존 React 컴포넌트는 재사용, Astro 파일만 교체
> 4. Vercel에 배포 후 테스트

**스타일링**: Tailwind CSS 유지 + CSS Variables로 테마 시스템 강화

---

## Proposed Changes

### 1. 프로젝트 초기화 (Modern Next.js 15)

#### [NEW] Next.js 15 프로젝트 설정
```bash
# 1. 기존 프로젝트 백업
git checkout -b migration-to-nextjs
git commit -am "Backup before Next.js migration"

# 2. Next.js 15 설치 (점진적 접근)
pnpm add next@15 react@19 react-dom@19

# 3. 필수 의존성 업데이트
pnpm add @types/react@19 @types/react-dom@19 eslint-config-next@15

# 4. App Router를 위한 설정
# src/ → app/ 구조로 변경
```

---

### 2. 의존성 설치 (Modern Stack)

#### [MODIFY] 의존성 업데이트

**추가할 패키지**:
```bash
# Notion 공식 SDK (Server Components 호환)
pnpm add @notionhq/client

# Modern 유틸리티
pnpm add date-fns clsx tailwind-merge

# Server Components 지원
pnpm add server-only

# 개발 의존성
pnpm add -D @types/node
```

**제거할 패키지** (Astro 관련):
- `astro`
- `@astrojs/react`
- `@swup/astro`
- `@ntcho/notion-astro-loader`
- `@chlorinec-pkgs/notion-astro-loader`

**주의**: `react-notion-x`는 Server Components와 호환성 문제가 있어 **커스텀 렌더러** 사용 권장

---

### 3. 환경 설정

#### [NEW] `.env.local`
```env
# Notion 공식 SDK 환경변수
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 사이트 설정
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_AUTHOR_NAME="Your Name"
```

#### [NEW] `site.config.ts`
```typescript
export const siteConfig = {
  title: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'My Blog',
  author: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author',
  description: 'A blog built with Next.js and Notion',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
} as const

export type SiteConfig = typeof siteConfig
```

---

### 4. Core Library (Server Components Ready)

#### [NEW] `lib/notion.ts`
Server Components에서 사용할 Notion API 래퍼

```typescript
import { Client } from '@notionhq/client'
import { cache } from 'react'

// Server-only 모듈 보호
import 'server-only'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// 캐싱된 데이터베이스 쿼리
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
        direction: 'descending',
      },
    ],
  })
})

// 캐싱된 페이지 가져오기
export const getPage = cache(async (pageId: string) => {
  return await notion.pages.retrieve({ page_id: pageId })
})

// 페이지 블록 가져오기
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
```

---

### 5. Components (Modern Server Components)

#### [NEW] `components/blog/NotionContent.tsx`
Server Components 호환 Notion 렌더러

```tsx
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

#### [NEW] `components/blog/BlockRenderer.tsx`
개별 Notion 블록 렌더러

```tsx
import type { BlockObjectResponse } from '@notionhq/client'
import Image from 'next/image'

interface BlockRendererProps {
  block: BlockObjectResponse
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p>
          {block.paragraph.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </p>
      )

    case 'heading_1':
      return (
        <h1>
          {block.heading_1.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </h1>
      )

    case 'heading_2':
      return (
        <h2>
          {block.heading_2.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </h2>
      )

    case 'heading_3':
      return (
        <h3>
          {block.heading_3.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </h3>
      )

    case 'image':
      const imageUrl = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url
      return (
        <div className="my-4">
          <Image
            src={imageUrl}
            alt="Notion image"
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>
      )

    case 'code':
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <code>{block.code.rich_text[0]?.plain_text}</code>
        </pre>
      )

    // 추가 블록 타입...
    default:
      return null
  }
}
```

#### [NEW] `components/blog/PostCard.tsx`
Server Component 포스트 카드

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    description?: string
    publishedAt?: string
    tags?: string[]
    coverImage?: string
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {post.coverImage && (
        <div className="aspect-video overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={600}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {post.title}
        </h3>

        {post.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {post.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatDate(new Date(post.publishedAt))}
            </time>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
```

---

### 6. Pages (Modern App Router)

#### [NEW] `app/layout.tsx`
Server Component 루트 레이아웃

```tsx
import { Inter } from 'next/font/google'
import { siteConfig } from '@/site.config'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  )
}
```

#### [NEW] `app/blog/page.tsx`
ISR 블로그 목록 (Server Component)

```tsx
import { Suspense } from 'react'
import { getDatabase } from '@/lib/notion'
import { PostCard } from '@/components/blog/PostCard'
import { PostListSkeleton } from '@/components/blog/PostListSkeleton'

// 1시간마다 재검증
export const revalidate = 3600

export default async function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </div>
    </main>
  )
}

async function PostList() {
  const database = await getDatabase()
  const posts = database.results as any[]

  if (posts.length === 0) {
    return <p>No posts found.</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

#### [NEW] `app/blog/[slug]/page.tsx`
동적 블로그 포스트 (Server Component + Streaming)

```tsx
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getDatabase } from '@/lib/notion'
import { NotionContent } from '@/components/blog/NotionContent'
import { PostSkeleton } from '@/components/blog/PostSkeleton'

// 1시간마다 재검증
export const revalidate = 3600

// 정적 경로 생성
export async function generateStaticParams() {
  const database = await getDatabase()
  const posts = database.results as any[]

  return posts.map((post) => ({
    slug: post.properties.slug.rich_text[0]?.plain_text,
  }))
}

// 페이지별 Metadata 생성
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
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
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

### 7. Styling

#### [MODIFY] `tailwind.config.ts`
기존 Tailwind 설정 유지 및 Next.js 경로로 조정

```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]
```

#### [NEW] `app/globals.css`
글로벌 스타일 및 Notion CSS import

```css
@import 'react-notion-x/src/styles.css';
@import 'prismjs/themes/prism-tomorrow.css';
@import 'katex/dist/katex.min.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 8. Configuration Files

#### [NEW] `next.config.js`
```javascript
module.exports = {
  images: {
    domains: ['www.notion.so', 's3.us-west-2.amazonaws.com'],
  },
}
```

#### [MODIFY] `tsconfig.json`
Next.js에 맞게 수정

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Verification Plan

### Automated Tests

```bash
# 개발 서버 실행
pnpm dev

# 빌드 테스트
pnpm build

# 린팅
pnpm lint
```

### Manual Verification

1. **홈페이지 렌더링 확인** (`http://localhost:3000`)
2. **블로그 목록 페이지** (`/blog`)
3. **개별 포스트 페이지** (`/blog/[slug]`)
4. **Notion 콘텐츠 렌더링** (이미지, 코드 블록, 포맷팅)
5. **다크모드 동작** (있는 경우)
6. **반응형 디자인** (모바일/태블릿)
7. **빌드 후 프로덕션 모드** (`pnpm start`)

---

## Migration Steps

1. **백업**: 현재 프로젝트 Git 커밋 또는 브랜치 생성
2. **Clean Up**: Astro 관련 파일 제거 (`src/pages/*.astro`, `astro.config.mjs` 등)
3. **Next.js 초기화**: `create-next-app` 실행
4. **의존성 설치**: Notion 관련 패키지 설치
5. **환경변수 설정**: `.env.local` 생성
6. **Core Library**: `lib/notion.ts` 작성
7. **Components**: `NotionPage.tsx` 및 기존 컴포넌트 마이그레이션
8. **Pages**: App Router 페이지 작성
9. **Styling**: CSS 및 Tailwind 설정
10. **테스트**: 로컬에서 검증
11. **배포 설정**: Vercel 또는 기존 호스팅 환경 재설정

---

## Timeline Estimate

- **Phase 1** (프로젝트 설정): 1-2시간
- **Phase 2** (Core Library & Components): 2-3시간
- **Phase 3** (Pages & Routing): 2-3시간
- **Phase 4** (Styling & UX): 1-2시간
- **Phase 5** (Testing & Deployment): 1-2시간

**Total**: 7-12시간 (작업 복잡도에 따라)
