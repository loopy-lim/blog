# 스타일링 스펙

## 스타일링 전략

**주요 방식**: Tailwind CSS (유틸리티 우선)

**보조 방식**: 
- CSS Variables (테마 토큰)
- CSS Modules (컴포넌트별 스타일, 필요 시)

---

## Tailwind CSS 설정

### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        // 추가 색상...
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray.700'),
            '--tw-prose-headings': theme('colors.gray.900'),
            '--tw-prose-links': theme('colors.primary.600'),
            // Notion 콘텐츠 스타일링
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
```

### 주요 확장 포인트
1. **Colors**: 브랜드 색상 정의
2. **Typography**: `@tailwindcss/typography` 플러그인으로 prose 스타일 커스터마이징
3. **Font Family**: 웹 폰트 변수 연결

---

## 글로벌 스타일

### `app/globals.css`

```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables (테마 토큰) */
:root {
  --font-inter: 'Inter', sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  
  --spacing-section: 4rem;
  --max-width: 1200px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-text: #f9fafb;
    --color-border: #374151;
  }
}

/* Base styles */
* {
  box-sizing: border-box;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

/* Notion 콘텐츠 스타일 */
@import 'react-notion-x/src/styles.css';

/* 코드 하이라이팅 */
@import 'prismjs/themes/prism-tomorrow.css';

/* 수식 렌더링 */
@import 'katex/dist/katex.min.css';

/* Notion 스타일 커스터마이징 */
.notion {
  font-size: 16px;
}

.notion-page {
  padding: 0;
  max-width: var(--max-width);
  margin: 0 auto;
}

.notion-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.notion-h1 {
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.notion-h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.notion-h3 {
  font-size: 1.25rem;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

/* 코드 블록 */
.notion-code {
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

/* 링크 */
.notion-link {
  color: #0ea5e9;
  text-decoration: underline;
  text-decoration-color: rgba(14, 165, 233, 0.3);
  transition: text-decoration-color 0.2s;
}

.notion-link:hover {
  text-decoration-color: rgba(14, 165, 233, 1);
}
```

---

## 폰트 설정

### Google Fonts (`app/layout.tsx`)

```typescript
import { Inter, Fira_Code } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${inter.variable} ${firaCode.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

---

## 컴포넌트 스타일링

### Tailwind 유틸리티 (권장)

```tsx
export function PostCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-600">{post.description}</p>
    </article>
  )
}
```

### CSS Modules (필요 시)

#### `PostCard.module.css`
```css
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
```

#### `PostCard.tsx`
```tsx
import styles from './PostCard.module.css'

export function PostCard({ post }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{post.title}</h3>
      <p>{post.description}</p>
    </article>
  )
}
```

### `clsx` 유틸리티

```tsx
import { clsx } from 'clsx'

export function Button({ variant, className, children }) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded font-medium transition',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
        },
        className
      )}
    >
      {children}
    </button>
  )
}
```

---

## 다크 모드 (선택)

### Tailwind 다크모드

#### `tailwind.config.ts`
```typescript
const config: Config = {
  darkMode: 'class', // 또는 'media'
  // ...
}
```

#### 사용
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

### 토글 구현

```tsx
'use client'

import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }, [])
  
  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setIsDark(!isDark)
  }
  
  return (
    <button onClick={toggleDark}>
      {isDark ? '🌞' : '🌙'}
    </button>
  )
}
```

---

## 반응형 디자인

### Breakpoints (Tailwind 기본값)

| Breakpoint | 최소 너비 | CSS |
|---|---|---|
| `sm` | 640px | `@media (min-width: 640px)` |
| `md` | 768px | `@media (min-width: 768px)` |
| `lg` | 1024px | `@media (min-width: 1024px)` |
| `xl` | 1280px | `@media (min-width: 1280px)` |
| `2xl` | 1536px | `@media (min-width: 1536px)` |

### 사용 예시

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
</div>
```

---

## Notion 콘텐츠 커스터마이징

### 코드 블록 스타일

```css
/* globals.css */
.notion-code {
  background-color: #1e293b !important;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.notion-code code {
  color: #e2e8f0;
  font-family: var(--font-mono);
}
```

### 이미지 스타일

```css
.notion-image {
  border-radius: 0.5rem;
  overflow: hidden;
}

.notion-image img {
  width: 100%;
  height: auto;
}
```

### Callout 블록

```css
.notion-callout {
  background-color: #f0f9ff;
  border-left: 4px solid #0ea5e9;
  padding: 1rem;
  border-radius: 0.25rem;
  margin: 1rem 0;
}
```

---

## 애니메이션

### Tailwind 트랜지션

```tsx
<div className="transition-all duration-300 hover:scale-105">
  Hover me
</div>
```

### 커스텀 애니메이션

#### `tailwind.config.ts`
```typescript
theme: {
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in',
      'slide-up': 'slideUp 0.3s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(20px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },
  },
}
```

#### 사용
```tsx
<div className="animate-fade-in">
  Animated content
</div>
```

---

## 성능 최적화

### CSS 최적화
- Tailwind는 사용하지 않는 스타일을 자동 제거 (PurgeCSS)
- 프로덕션 빌드 시 자동으로 최적화됨

### 폰트 최적화
- Next.js `next/font`로 자동 최적화
- `display: 'swap'`으로 FOIT 방지

### 이미지 최적화
- `next/image` 사용 (자동 lazy loading, 최적화)

```tsx
import Image from 'next/image'

<Image
  src={post.coverImage}
  alt={post.title}
  width={800}
  height={400}
  className="rounded-lg"
  priority={false} // lazy loading
/>
```

---

## 스타일 가이드

### 색상 팔레트

```
Primary: #0ea5e9 (Sky Blue)
Secondary: #8b5cf6 (Purple)
Accent: #f59e0b (Amber)

Gray Scale:
- 50: #f9fafb
- 100: #f3f4f6
- 500: #6b7280
- 900: #111827
```

### 타이포그래피

```
제목 (H1): 2.5rem (40px), bold
제목 (H2): 2rem (32px), bold
제목 (H3): 1.5rem (24px), semibold
본문: 1rem (16px), regular
작은 글씨: 0.875rem (14px), regular
```

### 간격 (Spacing)

```
Section 간격: 4rem (64px)
Component 간격: 2rem (32px)
Element 간격: 1rem (16px)
```

---

## Astro vs Next.js 스타일링 비교

| 항목 | Astro | Next.js |
|---|---|---|
| 글로벌 CSS | `src/styles/global.css` | `app/globals.css` |
| 컴포넌트 스타일 | `<style>` 태그 | CSS Modules |
| CSS 클래스 속성 | `class` | `className` |
| Tailwind 설정 | `tailwind.config.cjs` | `tailwind.config.ts` |
| 폰트 로딩 | `<link>` 태그 | `next/font` |
