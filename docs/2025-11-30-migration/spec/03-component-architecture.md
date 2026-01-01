# 컴포넌트 아키텍처 스펙

## 컴포넌트 계층 구조

```
App
├── Layout (app/layout.tsx)
│   ├── Header
│   └── Footer
│
├── HomePage (app/page.tsx)
│   ├── Hero
│   └── RecentPosts
│       └── PostCard[]
│
├── BlogListPage (app/blog/page.tsx)
│   └── PostList
│       └── PostCard[]
│
└── BlogPostPage (app/blog/[slug]/page.tsx)
    └── NotionPage
        ├── NotionRenderer (react-notion-x)
        └── TableOfContents (선택)
```

---

## 핵심 컴포넌트

### 1. `NotionPage.tsx`

**역할**: Notion 콘텐츠 렌더링

**Props**:
```typescript
interface NotionPageProps {
  recordMap: ExtendedRecordMap
  fullPage?: boolean
  darkMode?: boolean
  className?: string
}
```

**구현**:
```typescript
'use client'

import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import { Collection } from 'react-notion-x/build/third-party/collection'
import { Equation } from 'react-notion-x/build/third-party/equation'
import { Modal } from 'react-notion-x/build/third-party/modal'

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

export function NotionPage({ 
  recordMap, 
  fullPage = true, 
  darkMode = false,
  className 
}: NotionPageProps) {
  return (
    <div className={className}>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={fullPage}
        darkMode={darkMode}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
        }}
      />
    </div>
  )
}
```

**의존성**:
- `react-notion-x`
- `prismjs` (코드 하이라이팅)
- `katex` (수식)

---

### 2. `Header.tsx`

**역할**: 사이트 헤더 (네비게이션)

**Props**:
```typescript
interface HeaderProps {
  className?: string
}
```

**구현**:
```typescript
import Link from 'next/link'
import { siteConfig } from '@/site.config'

export function Header({ className }: HeaderProps) {
  return (
    <header className={className}>
      <nav>
        <Link href="/" className="logo">
          {siteConfig.title}
        </Link>
        
        <div className="nav-links">
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>
    </header>
  )
}
```

**스타일링**: Tailwind CSS

---

### 3. `Footer.tsx`

**역할**: 사이트 푸터

**Props**:
```typescript
interface FooterProps {
  className?: string
}
```

**구현**:
```typescript
import { siteConfig } from '@/site.config'

export function Footer({ className }: FooterProps) {
  return (
    <footer className={className}>
      <p>&copy; {new Date().getFullYear()} {siteConfig.author}</p>
      <div className="links">
        <a href={siteConfig.github}>GitHub</a>
        <a href={siteConfig.twitter}>Twitter</a>
      </div>
    </footer>
  )
}
```

---

### 4. `PostCard.tsx`

**역할**: 블로그 포스트 카드 (목록용)

**Props**:
```typescript
interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    description?: string
    publishedAt?: Date
    tags?: string[]
    coverImage?: string
  }
  className?: string
}
```

**구현**:
```typescript
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export function PostCard({ post, className }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={className}>
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={600}
          height={400}
          className="cover-image"
        />
      )}
      
      <h3>{post.title}</h3>
      
      {post.description && (
        <p className="description">{post.description}</p>
      )}
      
      <div className="meta">
        {post.publishedAt && (
          <time dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="tags">
            {post.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

---

### 5. `PostList.tsx`

**역할**: 포스트 목록 렌더링

**Props**:
```typescript
interface PostListProps {
  posts: PostMetadata[]
  className?: string
}
```

**구현**:
```typescript
import { PostCard } from './PostCard'

export function PostList({ posts, className }: PostListProps) {
  if (posts.length === 0) {
    return <p>No posts found.</p>
  }
  
  return (
    <div className={className}>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

---

## UI 컴포넌트 (`components/ui/`)

### `Button.tsx`

```typescript
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  className,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'button',
        `button-${variant}`,
        `button-${size}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

### `Card.tsx`

```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx('card', className)}>
      {children}
    </div>
  )
}
```

### `Tag.tsx`

```typescript
interface TagProps {
  label: string
  href?: string
  className?: string
}

export function Tag({ label, href, className }: TagProps) {
  const content = (
    <span className={clsx('tag', className)}>
      {label}
    </span>
  )
  
  if (href) {
    return <Link href={href}>{content}</Link>
  }
  
  return content
}
```

---

## Astro 컴포넌트 마이그레이션 가이드

### `.astro` → `.tsx` 변환

#### Before (Astro)
```astro
---
interface Props {
  title: string
}

const { title } = Astro.props
---

<div class="card">
  <h2>{title}</h2>
</div>
```

#### After (Next.js)
```tsx
interface CardProps {
  title: string
}

export function Card({ title }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
    </div>
  )
}
```

### 변경 사항
1. **Frontmatter 제거**: `---` 블록 삭제
2. **Props 타입**: `Astro.props` → 함수 파라미터
3. **className**: `class` → `className`
4. **export**: 컴포넌트 export 추가

---

## 서버 vs 클라이언트 컴포넌트

### 서버 컴포넌트 (기본)
- 데이터 페칭 포함
- 이벤트 핸들러 없음
- `'use client'` 없음

**예시**: `PostList`, `PostCard`

### 클라이언트 컴포넌트
- `'use client'` 지시어 필요
- 이벤트 핸들러, useState, useEffect 사용

**예시**: `NotionPage` (react-notion-x는 클라이언트 라이브러리)

```typescript
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

---

## 컴포넌트 테스트 (선택)

### Setup
```bash
pnpm add -D @testing-library/react @testing-library/jest-dom vitest
```

### 예시: `Button.test.tsx`
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

---

## 접근성 고려사항

### 시맨틱 HTML
```tsx
<article>
  <header>
    <h1>{post.title}</h1>
    <time dateTime={post.publishedAt.toISOString()}>
      {formatDate(post.publishedAt)}
    </time>
  </header>
  
  <main>
    <NotionPage recordMap={recordMap} />
  </main>
</article>
```

### ARIA 속성
```tsx
<button aria-label="Close menu" onClick={onClose}>
  <CloseIcon />
</button>
```

### 키보드 네비게이션
- 모든 인터랙티브 요소는 키보드로 접근 가능
- `tabIndex` 적절히 사용
