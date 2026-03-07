# Blog

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com/)

**Live Demo**: [blog.ll3.kr](https://blog.ll3.kr)

Next.js 15 기반의 개인 블로그입니다. Notion을 Headless CMS로 사용하며, Cloudflare Pages에 정적 배포됩니다.

## Features

### Content Management
- **Notion as CMS** - Notion 데이터베이스에서 블로그 콘텐츠 관리
- **Static Export** - 빌드 시점에 모든 페이지를 정적 HTML로 생성
- **Build-time Data Generation** - Notion API 데이터를 JSON으로 캐싱하여 빌드 성능 최적화

### SEO Optimization
- **Open Graph Images** - 포스트별 커스텀 OG 이미지 자동 생성
- **RSS Feed** - RSS 2.0 피드 자동 생성
- **Sitemap** - 검색엔진 최적화를 위한 sitemap.xml 생성
- **JSON-LD** - 구조화된 데이터 마크업

### UI/UX
- **Reading Progress** - 포스트 읽기 진행률 표시
- **Table of Contents** - 자동 생성되는 목차
- **Image Zoom** - 이미지 클릭 시 확대 보기
- **Syntax Highlighting** - Shiki 기반 코드 하이라이팅
- **Responsive Design** - 모바일 친화적 반응형 디자인

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS 4.1 |
| CMS | Notion API |
| Build | Bun |
| Deployment | Cloudflare Pages |
| Code Highlighting | Shiki |
| Animations | Framer Motion |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- Node.js >= 18 (for compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/loopy/blog.git
cd blog

# Install dependencies
bun install
```

### Environment Variables

`.env.local.example`을 복사하여 `.env.local`을 생성합니다:

```bash
cp .env.local.example .env.local
```

필요한 환경 변수:

```env
# Notion API Configuration
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_AUTHOR_NAME=Your Name

# Optional: Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
```

### Development

```bash
# Start development server
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## Notion Setup

### 1. Notion Integration 생성

1. [Notion Developers](https://www.notion.so/my-integrations)에서 새 Integration 생성
2. API Key 복사하여 `NOTION_API_KEY`에 설정

### 2. Database 생성

Notion에서 새 데이터베이스를 생성하고 다음 속성을 추가:

| Property Name | Type | Description |
|---------------|------|-------------|
| `title` | Title | 포스트 제목 |
| `slug` | Rich Text | URL 슬러그 (비워두면 페이지 ID 사용) |
| `description` | Rich Text | 포스트 설명 (SEO용) |
| `publishAt` | Date | 발행 날짜 |
| `tags` | Multi-select | 태그 |
| `draft` | Checkbox | true면 비공개 |

### 3. Integration 연결

1. 데이터베이스 페이지에서 "..." 메뉴 > "Add connections"
2. 생성한 Integration 선택
3. Database ID를 URL에서 복사: `https://www.notion.so/[DATABASE_ID]?v=...`

## Build & Deployment

### Build Process

이 프로젝트는 정적 사이트 생성을 위해 다단계 빌드 파이프라인을 사용:

```bash
bun run build
```

빌드 단계:

1. **download-images** - Notion 이미지를 로컬로 다운로드
2. **build-data** - Notion 데이터를 JSON으로 캐싱
3. **generate-og-images** - OG 이미지 생성
4. **generate-rss** - RSS 피드 생성
5. **next build** - Next.js 정적 빌드

각 단계는 실패해도 빌드가 계속 진행되도록 설계되어 있습니다.

### Cloudflare Pages

1. Cloudflare Pages 프로젝트 생성
2. Build settings:
   - **Build command**: `bun run build`
   - **Build output directory**: `out`
3. Environment variables 설정
4. 배포

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈페이지
│   ├── globals.css              # 전역 스타일
│   ├── sitemap.ts               # Sitemap 생성
│   ├── robots.ts                # Robots.txt
│   └── blog/
│       ├── page.tsx             # 블로그 목록
│       └── [slug]/
│           └── page.tsx         # 개별 포스트
├── components/                   # React 컴포넌트
│   ├── blog/                    # 블로그 관련
│   │   ├── NotionContent.tsx   # Notion 렌더러
│   │   ├── BlockRenderer.tsx   # 블록 렌더러
│   │   ├── CodeBlock.tsx       # 코드 하이라이팅
│   │   ├── PostCard.tsx        # 포스트 카드
│   │   ├── ReadingProgress.tsx # 읽기 진행률
│   │   ├── TableOfContents.tsx # 목차
│   │   └── ZoomableImage.tsx   # 이미지 확대
│   ├── seo/                     # SEO 컴포넌트
│   │   └── JsonLd.tsx          # 구조화된 데이터
│   └── ui/                      # UI 컴포넌트
├── lib/                         # 유틸리티
│   ├── notion.ts               # Notion API 래퍼
│   ├── static-data.ts          # 정적 데이터 로더
│   └── utils.ts                # 공용 유틸리티
├── scripts/                     # 빌드 스크립트
│   ├── build-data.ts           # 데이터 빌드
│   ├── download-images.ts      # 이미지 다운로드
│   ├── generate-og-images.ts   # OG 이미지 생성
│   └── generate-rss.ts         # RSS 생성
├── data/                        # 빌드된 데이터 (gitignored)
│   ├── blog.json               # 포스트 메타데이터
│   └── post-*.json             # 개별 포스트 데이터
├── public/                      # 정적 파일
│   └── images/notion/          # 다운로드된 Notion 이미지
└── out/                         # 빌드 출력 (gitignored)
```

## Commands

| Command | Description |
|---------|-------------|
| `bun dev` | 개발 서버 시작 (localhost:3000) |
| `bun build` | 프로덕션 빌드 |
| `bun start` | 빌드된 사이트 로컬 서빙 |
| `bun lint` | Oxlint 실행 |
| `bun type-check` | TypeScript 타입 검사 |
| `bun build-data` | Notion 데이터 JSON 생성 |
| `bun download-images` | Notion 이미지 다운로드 |
| `bun generate-og-images` | OG 이미지 생성 |
| `bun generate-rss` | RSS 피드 생성 |

## Customization

### Site Configuration

`site.config.ts`에서 사이트 설정을 수정:

```typescript
export const siteConfig = {
  title: 'My Blog',
  author: 'Your Name',
  description: 'Site description',
  url: 'https://your-domain.com',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/your-username',
  },
}
```

### Styling

- `app/globals.css` - 전역 스타일 및 Notion 콘텐츠 스타일
- `tailwind.config.ts` - Tailwind 설정

## License

MIT
