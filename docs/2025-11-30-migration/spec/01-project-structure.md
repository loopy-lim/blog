# 프로젝트 구조 스펙

## 디렉토리 구조

```
blog/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈페이지
│   ├── globals.css              # 글로벌 스타일
│   ├── blog/
│   │   ├── page.tsx             # 블로그 목록
│   │   └── [slug]/
│   │       └── page.tsx         # 개별 포스트
│   └── about/
│       └── page.tsx             # About 페이지
│
├── components/                   # 재사용 가능한 컴포넌트
│   ├── NotionPage.tsx           # Notion 콘텐츠 렌더러
│   ├── Header.tsx               # 헤더
│   ├── Footer.tsx               # 푸터
│   ├── PostCard.tsx             # 블로그 포스트 카드
│   ├── PostList.tsx             # 포스트 목록
│   └── ui/                      # UI 컴포넌트
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Tag.tsx
│
├── lib/                          # 유틸리티 & API
│   ├── notion.ts                # Notion API 래퍼
│   ├── notion-utils.ts          # Notion 유틸리티 함수
│   ├── posts.ts                 # 포스트 관련 로직
│   └── utils.ts                 # 공통 유틸리티
│
├── types/                        # TypeScript 타입 정의
│   ├── notion.ts                # Notion 관련 타입
│   └── post.ts                  # 포스트 타입
│
├── public/                       # 정적 자산
│   ├── favicon.ico
│   ├── images/
│   └── fonts/
│
├── docs/                         # 문서
│   ├── migration-plan.md
│   └── spec/
│
├── site.config.ts               # 사이트 설정
├── next.config.js               # Next.js 설정
├── tailwind.config.ts           # Tailwind 설정
├── tsconfig.json                # TypeScript 설정
├── .env.local                   # 환경 변수 (git 제외)
└── package.json
```

## 파일 명명 규칙

### 컴포넌트
- **PascalCase**: `NotionPage.tsx`, `PostCard.tsx`
- **파일명 = 컴포넌트명**: 파일 하나당 하나의 주요 컴포넌트

### 유틸리티 & API
- **kebab-case** 또는 **camelCase**: `notion-utils.ts`, `posts.ts`
- 기능별로 파일 분리

### 페이지 (App Router)
- **소문자** + **하이픈**: `page.tsx`, `layout.tsx`
- 동적 라우트: `[slug]`, `[...path]`

## 코드 구성 원칙

### 관심사 분리
- **UI 컴포넌트**: `components/`에 배치
- **비즈니스 로직**: `lib/`에 배치
- **타입 정의**: `types/`에 배치
- **페이지**: `app/`에 배치

### 임포트 순서
```typescript
// 1. 외부 라이브러리
import { NotionRenderer } from 'react-notion-x'
import { clsx } from 'clsx'

// 2. 내부 모듈 - 절대 경로
import { getPage } from '@/lib/notion'
import { PostCard } from '@/components/PostCard'

// 3. 타입
import type { Post } from '@/types/post'

// 4. 스타일
import './styles.css'
```

### 경로 별칭
`tsconfig.json`에서 `@/` 별칭 사용:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

예시:
```typescript
import { notion } from '@/lib/notion'
import { Button } from '@/components/ui/Button'
```

## 마이그레이션 매핑

### Astro → Next.js 파일 매핑

| Astro (현재) | Next.js (이후) | 비고 |
|---|---|---|
| `src/pages/index.astro` | `app/page.tsx` | 홈페이지 |
| `src/pages/blog/index.astro` | `app/blog/page.tsx` | 블로그 목록 |
| `src/pages/blog/[id].astro` | `app/blog/[slug]/page.tsx` | 개별 포스트 |
| `src/pages/about-me.astro` | `app/about/page.tsx` | About |
| `src/layouts/Layout.astro` | `app/layout.tsx` | 레이아웃 |
| `src/components/*.tsx` | `components/*.tsx` | 컴포넌트 (유지) |
| `src/content.config.ts` | `lib/notion.ts` | Notion 설정 |
| `src/styles/global.css` | `app/globals.css` | 글로벌 CSS |

### 삭제할 파일
- `astro.config.mjs`
- `src/content.config.ts`
- 모든 `.astro` 파일
- `@astrojs/*` 관련 설정

### 새로 생성할 파일
- `next.config.js`
- `app/layout.tsx`
- `app/page.tsx`
- `lib/notion.ts`
- `site.config.ts`
- `.env.local`

## 환경 변수 관리

### 파일 위치
- 로컬: `.env.local` (git 제외)
- 프로덕션: Vercel/호스팅 환경 설정

### 변수 네이밍
```bash
# Notion
NOTION_PAGE_ID=...
NOTION_TOKEN_V2=...
NOTION_ACTIVE_USER=...

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**규칙**:
- 클라이언트 노출: `NEXT_PUBLIC_` 접두사
- 서버 전용: 접두사 없음

## 정적 자산

### 이미지
- **외부 (Notion)**: `next.config.js`의 `images.domains`에 등록
- **내부**: `public/images/` 또는 `app/_assets/`

### 폰트
- **Google Fonts**: `app/layout.tsx`에서 `next/font` 사용
- **로컬 폰트**: `public/fonts/`

## 스타일 파일 구조

```
app/
├── globals.css              # 글로벌 스타일 + Tailwind
components/
├── NotionPage.module.css    # 컴포넌트별 CSS Module (선택)
```

**우선순위**:
1. Tailwind 유틸리티 (기본)
2. CSS Module (컴포넌트 특화)
3. 글로벌 CSS (전역 스타일)
