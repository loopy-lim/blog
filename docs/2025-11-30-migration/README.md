# Documentation

블로그 프로젝트의 아키텍처, 가이드, 그리고 마이그레이션 관련 문서입니다.

## 📁 문서 구조

```
docs/
├── README.md                    # 이 파일
├── migration/                   # 마이그레이션 관련 (Astro → Next.js)
│   └── migration-plan.md
└── spec/                        # 아키텍처 & 가이드
    ├── 01-project-structure.md
    ├── 02-notion-integration.md
    ├── 03-component-architecture.md
    ├── 04-routing.md
    ├── 05-styling.md
    ├── 06-environment-config.md
    └── 07-database-schema.md
```

---

## 📚 아키텍처 & 가이드 (`spec/`)

프로젝트의 구조, 기술 스택, 개발 가이드를 담고 있습니다.

### [01. 프로젝트 구조](./spec/01-project-structure.md)
Next.js 프로젝트의 디렉토리 구조 및 파일 구성
- 디렉토리 구조 및 명명 규칙
- 파일 구성 원칙
- 경로 별칭 설정
- 정적 자산 관리

### [02. Notion 통합](./spec/02-notion-integration.md)
Notion을 CMS로 사용하는 방법
- `@notionhq/client` 공식 SDK 사용법
- 환경 변수 설정
- API 래퍼 및 유틸리티 함수
- 데이터 페칭 전략 (ISR)
- Draft 필터링

### [03. 컴포넌트 아키텍처](./spec/03-component-architecture.md)
React 컴포넌트 설계 및 구조
- 핵심 컴포넌트 (`NotionPage`, `PostCard`, `Header`, `Footer`)
- UI 컴포넌트 라이브러리
- 서버 vs 클라이언트 컴포넌트
- 접근성 고려사항

### [04. 라우팅](./spec/04-routing.md)
Next.js App Router 사용법
- 페이지 정의 (`page.tsx`, `layout.tsx`)
- 동적 라우트 (`[slug]`)
- 메타데이터 및 SEO
- 에러 핸들링 및 로딩 상태

### [05. 스타일링](./spec/05-styling.md)
Tailwind CSS 기반 스타일링
- Tailwind 설정 및 확장
- 글로벌 스타일
- Notion 콘텐츠 커스터마이징
- 다크 모드 구현
- 반응형 디자인

### [06. 환경 설정](./spec/06-environment-config.md)
프로젝트 환경 설정 및 배포
- 환경 변수 관리
- `site.config.ts`
- Next.js/TypeScript 설정
- Vercel 배포 가이드

### [07. Database 스키마](./spec/07-database-schema.md)
Notion Database 구조 및 속성
- Database 속성 정의 (`title`, `slug`, `draft`, `publishAt`, `tags`)
- 속성별 검증 규칙
- 쿼리 예시
- 데이터 검증

---

## 🔄 마이그레이션 (`migration/`)

Astro에서 Next.js로의 마이그레이션 관련 문서입니다.

### [마이그레이션 계획](./migration/migration-plan.md)
Astro + Notion → Next.js + Notion 전환 계획
- 현재/목표 프로젝트 분석
- 주요 변경 사항
- 단계별 절차
- 타임라인 예상

---

## 🚀 빠른 시작

### 신규 개발자
1. [프로젝트 구조](./spec/01-project-structure.md) 먼저 읽기
2. [환경 설정](./spec/06-environment-config.md)으로 개발 환경 세팅
3. [Notion 통합](./spec/02-notion-integration.md) 및 [Database 스키마](./spec/07-database-schema.md) 확인
4. 개발 시작!

### 기능 추가 시
- 해당 영역의 스펙 문서 참고 (컴포넌트, 라우팅, 스타일링 등)

---

## 🔑 기술 스택

- **프레임워크**: Next.js 14+ (App Router)
- **CMS**: Notion (공식 SDK `@notionhq/client`)
- **스타일링**: Tailwind CSS
- **언어**: TypeScript
- **패키지 매니저**: pnpm
- **배포**: Vercel

---

## 📝 문서 작성 가이드

### 새 문서 추가
1. 적절한 폴더에 파일 생성 (`spec/` 또는 `migration/`)
2. 이 README.md에 링크 추가
3. 파일명은 `kebab-case.md` 형식 사용

### 문서 업데이트
- 변경 사항을 명확히 기록
- 관련 문서도 함께 업데이트
- 날짜 기록 (문서 하단)

---

## 📚 참고 자료

### 공식 문서
- [Next.js](https://nextjs.org/docs)
- [Notion API](https://developers.notion.com/)
- [@notionhq/client](https://github.com/makenotion/notion-sdk-js)
- [Tailwind CSS](https://tailwindcss.com/)

### 라이브러리
- [react-notion-x](https://github.com/NotionX/react-notion-x) - Notion 콘텐츠 렌더링

---

**마지막 업데이트**: 2025-11-30
