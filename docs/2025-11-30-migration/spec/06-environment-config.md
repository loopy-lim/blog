# 환경 설정 스펙

## 환경 변수

### `.env.local` (로컬 개발)

```bash
# Notion 설정
NOTION_PAGE_ID=your-notion-page-id-32-chars
NOTION_TOKEN_V2=your-notion-token-v2
NOTION_ACTIVE_USER=your-active-user-id

# 사이트 설정 (클라이언트 노출)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### `.env.production` (프로덕션, 선택)

```bash
NOTION_PAGE_ID=production-page-id
NOTION_TOKEN_V2=production-token
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 환경 변수 네이밍 규칙

- **서버 전용**: 접두사 없음 (예: `NOTION_TOKEN_V2`)
- **클라이언트 노출**: `NEXT_PUBLIC_` 접두사 (예: `NEXT_PUBLIC_SITE_URL`)

### `.gitignore`에 추가

```gitignore
# 환경 변수
.env*.local
.env.production
```

---

## 사이트 설정

### `site.config.ts`

중앙 집중식 사이트 메타데이터 관리

```typescript
export const siteConfig = {
  // 기본 정보
  title: 'My Blog',
  author: 'Your Name',
  description: 'A blog about development, design, and more.',
  
  // URL
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  
  // 소셜 링크
  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    email: 'your@email.com',
  },
  
  // SEO
  seo: {
    keywords: ['blog', 'development', 'design'],
    image: '/og-image.png', // Open Graph 이미지
  },
  
  // Notion
  notion: {
    pageId: process.env.NOTION_PAGE_ID!,
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  },
  
  // 기타
  postsPerPage: 10,
  revalidateInterval: 3600, // ISR interval (초)
}

export type SiteConfig = typeof siteConfig
```

### 사용 예시

```typescript
import { siteConfig } from '@/site.config'

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}
```

---

## Next.js 설정

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Notion 이미지 도메인 허용
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
    ],
  },
  
  // 실험적 기능 (선택)
  experimental: {
    // 필요 시 활성화
  },
  
  // 리다이렉트 (선택)
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

---

## TypeScript 설정

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
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
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 주요 설정

- `paths`: `@/` 별칭으로 절대 경로 import
- `strict`: 엄격한 타입 체크
- `jsx: "preserve"`: Next.js가 JSX 처리

---

## ESLint 설정

### `eslint.config.js`

기존 Astro 설정 → Next.js 설정으로 교체

```javascript
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // 커스텀 규칙
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]

export default eslintConfig
```

---

## Prettier 설정

### `.prettierrc.mjs`

기존 Astro 설정 유지 (Tailwind 플러그인 포함)

```javascript
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
}
```

---

## Package.json 스크립트

### `package.json`

```json
{
  "name": "blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,md,mdx,json}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-notion-x": "^7.0.0",
    "notion-client": "^6.16.0",
    "notion-types": "^6.16.0",
    "notion-utils": "^6.16.0",
    "date-fns": "^3.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  },
  "packageManager": "pnpm@10.13.1"
}
```

---

## Git 설정

### `.gitignore`

```gitignore
# 의존성
node_modules/
.pnp
.pnp.js

# Next.js
/.next/
/out/
.swc/

# 프로덕션
/build

# 환경 변수
.env*.local
.env.production

# 디버깅
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 로컬 파일
.DS_Store
*.pem

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Vercel
.vercel
```

---

## 배포 설정

### Vercel (권장)

#### 1. Vercel CLI 설치
```bash
pnpm add -g vercel
```

#### 2. 배포
```bash
vercel
```

#### 3. 환경 변수 설정
Vercel 대시보드 → Settings → Environment Variables

```
NOTION_PAGE_ID=xxx
NOTION_TOKEN_V2=xxx
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 기타 플랫폼

#### Netlify
`netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Cloudflare Pages
- Build command: `pnpm build`
- Build output directory: `.next`

---

## 개발 환경 설정

### VS Code 확장 프로그램 (권장)

`.vscode/extensions.json`:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code 설정

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## 초기 설정 체크리스트

- [ ] `.env.local` 생성 및 환경 변수 입력
- [ ] `site.config.ts` 사이트 정보 입력
- [ ] `next.config.js` Notion 이미지 도메인 확인
- [ ] `package.json` 의존성 설치 (`pnpm install`)
- [ ] Git 저장소 초기화 및 `.gitignore` 확인
- [ ] 개발 서버 실행 (`pnpm dev`)
- [ ] ESLint 및 Prettier 동작 확인
- [ ] Vercel 프로젝트 연결 (배포 시)

---

## 마이그레이션 시 주의사항

### 제거할 설정 파일
- `astro.config.mjs`
- Astro 관련 ESLint 설정

### 유지할 설정 파일
- `.prettierrc.mjs`
- `pnpm-lock.yaml` (재생성됨)
- `.gitignore` (일부 수정)

### 환경 변수 변환

| Astro | Next.js |
|---|---|
| `NOTION_API_KEY` | `NOTION_TOKEN_V2` |
| `NOTION_DATABASE_ID` | `NOTION_PAGE_ID` |
| `PUBLIC_SITE_URL` | `NEXT_PUBLIC_SITE_URL` |
