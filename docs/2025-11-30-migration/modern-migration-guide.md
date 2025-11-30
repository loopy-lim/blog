# Modern Next.js 15 + Notion Migration Guide

## 📋 최종 마이그레이션 요약

**주요 변경사항:**
- **Astro 5** → **Next.js 15** (App Router)
- **@ntcho/notion-astro-loader** → **@notionhq/client** (공식 SDK)
- **React Components** → **React Server Components**
- **SSG** → **ISR + Server Components + Streaming**

## 🎯 핵심 전략

### 1. **기술 스택**
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "@notionhq/client": "^2.2.15",
  "tailwindcss": "^4.0.0"
}
```

### 2. **주요 이점**
- ✅ **Server Components**: 서버 사이드에서 직접 데이터 페칭
- ✅ **캐싱**: `cache()` 함수로 API 호출 최적화
- ✅ **Streaming**: Suspense로 점진적 렌더링
- ✅ **Turbopack**: Next.js 15 빌드 최적화
- ✅ **Partial Prerendering**: 정적 + 동적 렌더링 혼합

## 📁 프로젝트 구조

```
blog/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃 (Server Component)
│   ├── page.tsx                 # 홈페이지
│   ├── globals.css              # CSS Variables + Tailwind
│   ├── loading.tsx              # 전역 로딩 UI
│   ├── blog/
│   │   ├── page.tsx            # 블로그 목록 (Server Component)
│   │   ├── loading.tsx         # 블로그 로딩
│   │   └── [slug]/
│   │       ├── page.tsx        # 개별 포스트 (Server Component)
│   │       └── loading.tsx     # 포스트 로딩
│   └── about/
│       └── page.tsx            # About 페이지
│
├── components/                  # 컴포넌트
│   ├── ui/                     # 기본 UI 컴포넌트 (Server)
│   ├── layout/                 # Header, Footer
│   ├── blog/                   # 블로그 관련
│   │   ├── PostCard.tsx        # (Server Component)
│   │   ├── PostList.tsx        # (Server Component)
│   │   ├── NotionContent.tsx   # Notion 렌더링 (Server)
│   │   ├── BlockRenderer.tsx   # 블록 렌더러 (Server)
│   │   └── CodeBlock.tsx       # 코드 하이라이팅 (Client)
│   └── providers/              # 클라이언트 프로바이더들
│
├── lib/                         # 유틸리티
│   ├── notion.ts               # @notionhq/client 래퍼 (Server-only)
│   ├── notion-renderer.ts      # Notion 콘텐츠 렌더링 로직
│   └── utils.ts                # 공통 유틸리티
│
├── types/                       # TypeScript 타입
│   ├── notion.ts
│   └── blog.ts
│
├── site.config.ts              # 사이트 설정
├── next.config.ts              # Next.js 15 설정 (PPR 활성화)
└── tailwind.config.ts          # Tailwind 4 설정
```

## 🔧 핵심 구현

### 1. **Notion API 래퍼** (`lib/notion.ts`)

```typescript
import { Client } from '@notionhq/client'
import { cache } from 'react'
import 'server-only'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// ✅ 캐싱된 데이터베이스 쿼리
export const getDatabase = cache(async () => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        { property: 'draft', checkbox: { equals: false } },
        { property: 'publishAt', date: { on_or_before: new Date().toISOString() } }
      ]
    },
    sorts: [{ property: 'publishAt', direction: 'descending' }]
  })
  return response.results
})

// ✅ 캐싱된 페이지 블록 가져오기
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

### 2. **블로그 목록 페이지** (`app/blog/page.tsx`)

```typescript
import { Suspense } from 'react'
import { getDatabase } from '@/lib/notion'
import { PostCard } from '@/components/blog/PostCard'
import { PostListSkeleton } from '@/components/blog/PostListSkeleton'

// ISR: 1시간마다 재검증
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

### 3. **개별 포스트 페이지** (`app/blog/[slug]/page.tsx`)

```typescript
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getDatabase, getPageBlocks } from '@/lib/notion'
import { NotionContent } from '@/components/blog/NotionContent'

export const revalidate = 3600

// 정적 경로 생성
export async function generateStaticParams() {
  const database = await getDatabase()
  const posts = database.results as any[]

  return posts.map((post) => ({
    slug: post.properties.slug.rich_text[0]?.plain_text,
  }))
}

// 동적 Metadata 생성
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const database = await getDatabase()
  const posts = database.results as any[]
  const post = posts.find(
    (p) => p.properties.slug.rich_text[0]?.plain_text === params.slug
  )

  if (!post) notFound()

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {post.properties.title.title[0]?.plain_text}
          </h1>
          {post.properties.publishAt?.date && (
            <time>
              {new Date(post.properties.publishAt.date.start).toLocaleDateString()}
            </time>
          )}
        </header>

        <Suspense fallback={<div>Loading post...</div>}>
          <NotionContent pageId={post.id} />
        </Suspense>
      </article>
    </main>
  )
}
```

### 4. **Notion 콘텐츠 렌더러** (`components/blog/NotionContent.tsx`)

```typescript
import { getPageBlocks } from '@/lib/notion'
import { BlockRenderer } from './BlockRenderer'

export async function NotionContent({ pageId }: { pageId: string }) {
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

## 🎨 스타일링

### 1. **CSS Variables** (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables for theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --accent: 210 40% 94%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --accent: 217.2 32.6% 17.5%;
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Notion content styling */
.notion-content {
  line-height: 1.7;
}

.notion-content h1,
.notion-content h2,
.notion-content h3 {
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.notion-content img {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 2. **Tailwind Config** (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

## ⚙️ Next.js 15 설정

### 1. **Next.js Config** (`next.config.ts`)

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack 활성화 (개발 시)
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // 이미지 최적화
  images: {
    domains: ['www.notion.so', 's3.us-west-2.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // 실험적 기능 활성화
  experimental: {
    // Partial Prerendering (Next.js 15)
    ppr: 'incremental',

    // Server Actions
    serverActions: true,
  },
}

export default nextConfig
```

### 2. **TypeScript Config** (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📱 다크모드 구현

### 1. **Theme Provider** (`components/providers/ThemeProvider.tsx`)

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

## 🚀 배포 전략

### 1. **Vercel 환경변수**

```bash
# Production 환경변수
NOTION_DATABASE_ID=your_database_id
NOTION_API_KEY=secret_your_api_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_AUTHOR_NAME="Your Name"
```

### 2. **Build & Deploy**

```bash
# 빌드 (Turbopack 사용)
pnpm build

# 로컬 테스트
pnpm start

# Vercel 배포
vercel --prod
```

## 📊 성능 최적화

### 1. **캐싱 전략**
- `cache()` 함수로 API 호출 최적화
- ISR로 적절한 재생성 주기 설정
- 이미지 Next.js Image 컴포넌트 최적화

### 2. **Bundle 최적화**
- Turbopack으로 빌드 속도 향상
- Dynamic imports로 번들 분할
- 서버 컴포넌트로 클라이언트 부하 감소

### 3. **Core Web Vitals**
- LCP: 이미지 최적화 + 위계적 로딩
- FID: 서버 컴포넌트로 자바스크립트 최소화
- CLS: 이미지 크기 지정 + 레이아웃 안정성

---

**🎉 결론: 이 마이그레이션으로 최신 Next.js 15 생태계의 모든 이점을 활용할 수 있습니다!**