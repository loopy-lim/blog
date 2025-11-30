# 라우팅 스펙

## Next.js App Router 개요

Next.js 13+ App Router는 파일 시스템 기반 라우팅을 사용합니다.

```
app/
├── layout.tsx          # 루트 레이아웃 (모든 페이지에 적용)
├── page.tsx            # / (홈페이지)
├── blog/
│   ├── page.tsx        # /blog (블로그 목록)
│   └── [slug]/
│       └── page.tsx    # /blog/[slug] (개별 포스트)
└── about/
    └── page.tsx        # /about
```

---

## 페이지 정의

### 1. 루트 레이아웃 (`app/layout.tsx`)

**경로**: 모든 페이지에 적용

**역할**: 
- HTML 구조 정의
- 글로벌 스타일 로드
- 공통 레이아웃 (Header, Footer)
- 메타데이터 설정

**구현**:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { siteConfig } from '@/site.config'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
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
    locale: 'ko_KR',
    type: 'website',
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
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

---

### 2. 홈페이지 (`app/page.tsx`)

**경로**: `/`

**역할**: 
- 블로그 소개
- 최근 포스트 표시
- Hero 섹션

**구현**:
```typescript
import { getAllPosts } from '@/lib/posts'
import { PostList } from '@/components/PostList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

export const revalidate = 3600 // 1시간마다 재생성

export default async function HomePage() {
  const allPosts = await getAllPosts()
  const recentPosts = allPosts.slice(0, 5) // 최근 5개
  
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to My Blog</h1>
        <p>Thoughts on development, design, and more.</p>
      </section>
      
      <section className="recent-posts">
        <h2>Recent Posts</h2>
        <PostList posts={recentPosts} />
      </section>
    </div>
  )
}
```

---

### 3. 블로그 목록 (`app/blog/page.tsx`)

**경로**: `/blog`

**역할**: 모든 블로그 포스트 목록 표시

**구현**:
```typescript
import { getAllPosts } from '@/lib/posts'
import { PostList } from '@/components/PostList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All blog posts',
}

export const revalidate = 3600

export default async function BlogPage() {
  const posts = await getAllPosts()
  
  return (
    <div className="blog-page">
      <h1>All Posts</h1>
      <PostList posts={posts} />
    </div>
  )
}
```

---

### 4. 개별 포스트 (`app/blog/[slug]/page.tsx`)

**경로**: `/blog/[slug]`

**역할**: 
- 개별 블로그 포스트 렌더링
- SEO 메타데이터 생성
- 정적 파라미터 생성

**구현**:
```typescript
import { notFound } from 'next/navigation'
import { getAllPosts } from '@/lib/posts'
import { getPage } from '@/lib/notion'
import { NotionPage } from '@/components/NotionPage'
import type { Metadata } from 'next'

export const revalidate = 3600

// 정적 경로 생성 (빌드 타임)
export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const posts = await getAllPosts()
  const post = posts.find(p => p.slug === params.slug)
  
  if (!post) {
    return {}
  }
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

// 페이지 컴포넌트
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const posts = await getAllPosts()
  const post = posts.find(p => p.slug === params.slug)
  
  if (!post) {
    notFound()
  }
  
  const recordMap = await getPage(post.id)
  
  return (
    <article className="blog-post">
      <header>
        <h1>{post.title}</h1>
        {post.publishedAt && (
          <time dateTime={post.publishedAt.toISOString()}>
            {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
          </time>
        )}
      </header>
      
      <NotionPage recordMap={recordMap} />
    </article>
  )
}
```

---

### 5. About 페이지 (`app/about/page.tsx`)

**경로**: `/about`

**역할**: 블로그 소개, 저자 정보

**구현**:
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About this blog',
}

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1>About Me</h1>
      <p>
        This is my personal blog where I share thoughts on development,
        design, and other topics.
      </p>
    </div>
  )
}
```

---

## 동적 라우팅

### 파라미터 접근

#### 단일 파라미터
```typescript
// app/blog/[slug]/page.tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>
}
```

#### 다중 세그먼트 (Catch-all)
```typescript
// app/blog/[...path]/page.tsx
export default function Page({ params }: { params: { path: string[] } }) {
  // /blog/2024/01/post → ['2024', '01', 'post']
  return <div>{params.path.join('/')}</div>
}
```

---

## 리다이렉션

### `redirect()` (서버)
```typescript
import { redirect } from 'next/navigation'

export default async function Page() {
  const isAuthenticated = false
  
  if (!isAuthenticated) {
    redirect('/login')
  }
  
  return <div>Protected Content</div>
}
```

### `useRouter()` (클라이언트)
```typescript
'use client'

import { useRouter } from 'next/navigation'

export function MyComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push('/blog')
  }
  
  return <button onClick={handleClick}>Go to Blog</button>
}
```

---

## 404 Not Found

### `app/not-found.tsx`
```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/">Go Home</Link>
    </div>
  )
}
```

### `notFound()` 호출
```typescript
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    notFound() // app/not-found.tsx 렌더링
  }
  
  return <div>{post.title}</div>
}
```

---

## 로딩 상태

### `app/blog/loading.tsx`
```typescript
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>Loading posts...</p>
    </div>
  )
}
```

자동으로 `app/blog/page.tsx` 로딩 시 표시됩니다.

---

## 에러 핸들링

### `app/blog/error.tsx`
```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

## 라우트 그룹 (선택)

### 구조
```
app/
├── (marketing)/
│   ├── page.tsx       # /
│   └── about/
│       └── page.tsx   # /about
└── (blog)/
    ├── layout.tsx     # /blog, /blog/[slug]에만 적용
    ├── blog/
    │   └── page.tsx   # /blog
    └── blog/[slug]/
        └── page.tsx   # /blog/[slug]
```

**용도**: 다른 레이아웃을 적용하되 URL에는 영향 없음

---

## Astro vs Next.js 라우팅 비교

| Astro (현재) | Next.js App Router | 비고 |
|---|---|---|
| `src/pages/index.astro` | `app/page.tsx` | 홈페이지 |
| `src/pages/blog/index.astro` | `app/blog/page.tsx` | 목록 |
| `src/pages/blog/[id].astro` | `app/blog/[slug]/page.tsx` | 동적 라우트 |
| `src/layouts/Layout.astro` | `app/layout.tsx` | 레이아웃 |
| `Astro.params` | `params` prop | 파라미터 접근 |
| `getStaticPaths()` | `generateStaticParams()` | 정적 경로 |

---

## SEO 최적화

### 메타데이터 우선순위
1. `generateMetadata()` (동적)
2. `export const metadata` (정적)
3. 부모 레이아웃의 metadata

### Open Graph 이미지
```typescript
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: 'https://example.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Blog post cover',
      },
    ],
  },
}
```

### 구조화된 데이터 (JSON-LD)
```typescript
export default function BlogPostPage({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* ... */}</article>
    </>
  )
}
```

---

## 성능 최적화

### Revalidation (ISR)
```typescript
export const revalidate = 3600 // 1시간
```

### Dynamic vs Static
```typescript
// 강제 동적 렌더링
export const dynamic = 'force-dynamic'

// 강제 정적 렌더링
export const dynamic = 'force-static'
```

### Prefetching
```typescript
import Link from 'next/link'

// 자동 prefetch (기본)
<Link href="/blog">Blog</Link>

// prefetch 비활성화
<Link href="/blog" prefetch={false}>Blog</Link>
```
