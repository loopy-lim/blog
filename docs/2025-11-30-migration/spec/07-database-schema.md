# Database Schema 스펙

## Notion Database 구조

### 필수 속성 (Properties)

| 속성명 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| `title` | Title | ✓ | 포스트 제목 | "Next.js 마이그레이션 가이드" |
| `slug` | Text | ✓ | URL slug (고유값) | "nextjs-migration-guide" |
| `publishAt` | Date | ✓ | 발행 날짜 | 2024-01-15 |
| `draft` | Checkbox | ✓ | 초안 여부 | ☑️ 또는 ☐ |
| `description` | Text | - | 포스트 설명 (SEO) | "Astro에서 Next.js로..." |
| `tags` | Multi-select | - | 태그 | ["Next.js", "Migration"] |
| `modifiedAt` | Last edited time | - | 수정 시간 (자동) | 2024-01-16 10:30 |

---

## 속성별 상세 스펙

### `title` (Title)
- **타입**: Title
- **필수**: ✓
- **설명**: 블로그 포스트의 제목
- **검증**: 
  - 비어있으면 안 됨
  - 권장 길이: 10-60자
- **예시**: "Next.js App Router 완벽 가이드"

---

### `slug` (Text)
- **타입**: Text (또는 Formula)
- **필수**: ✓
- **설명**: URL에 사용되는 고유 식별자
- **검증**:
  - 고유값이어야 함 (중복 불가)
  - 소문자, 숫자, 하이픈(`-`)만 사용
  - 공백 없음
- **예시**: 
  - ✅ `nextjs-app-router-guide`
  - ✅ `2024-migration-story`
  - ❌ `Next.js Guide` (공백, 대문자)
  - ❌ `가이드` (한글)

**Formula로 자동 생성 (선택)**:
```
replaceAll(replaceAll(lower(prop("title")), " ", "-"), "[^a-z0-9-]", "")
```

---

### `publishAt` (Date)
- **타입**: Date
- **필수**: ✓
- **설명**: 포스트 발행 날짜/시간
- **검증**:
  - 미래 날짜 허용 (예약 발행)
  - 현재 날짜 이전 것만 표시 (쿼리 필터)
- **예시**: 2024-01-15 14:30

**쿼리 필터**:
```typescript
{
  property: 'publishAt',
  date: {
    on_or_before: new Date().toISOString()
  }
}
```

---

### `draft` (Checkbox)
- **타입**: Checkbox
- **필수**: ✓
- **설명**: 초안 여부 (체크 = 초안, 미체크 = 발행)
- **기본값**: ☑️ (체크)
- **검증**: `draft = false`인 것만 블로그에 표시

**쿼리 필터**:
```typescript
{
  property: 'draft',
  checkbox: {
    equals: false // draft가 아닌 것만
  }
}
```

---

### `description` (Text)
- **타입**: Text
- **필수**: - (선택)
- **설명**: 포스트 간단 설명 (SEO 메타 태그)
- **검증**:
  - 권장 길이: 50-160자 (SEO 최적화)
- **예시**: "Astro에서 Next.js로 마이그레이션하는 과정과 주의사항을 정리했습니다."

---

### `tags` (Multi-select)
- **타입**: Multi-select
- **필수**: - (선택)
- **설명**: 포스트 카테고리/태그
- **검증**:
  - 미리 정의된 태그 사용 권장
  - 태그당 1-2 단어 권장
- **예시**: `["Next.js", "Migration", "React"]`

**태그 목록 예시**:
- Next.js
- React
- TypeScript
- Notion
- Migration
- Tutorial
- Dev Log

---

### `modifiedAt` (Last edited time)
- **타입**: Last edited time
- **필수**: - (자동)
- **설명**: Notion에서 자동으로 기록하는 수정 시간
- **용도**: 업데이트 날짜 표시

---

## 선택 속성 (옵션)

### `coverImage` (Files & media)
- **타입**: Files & media
- **설명**: 포스트 커버 이미지
- **대안**: 페이지 커버(Page cover) 사용 가능

### `author` (Select)
- **타입**: Select
- **설명**: 작성자 (다중 작성자인 경우)
- **예시**: "Loopy", "Guest Author"

### `status` (Select)
- **타입**: Select
- **설명**: 포스트 상태
- **옵션**: Draft, In Review, Published, Archived
- **용도**: `draft` 대신 사용 가능

### `featured` (Checkbox)
- **타입**: Checkbox
- **설명**: 메인 페이지에 추천 포스트로 표시
- **기본값**: ☐

---

## Database 설정

### Views (뷰)

#### 1. **All Posts** (기본 뷰)
- 필터: 없음
- 정렬: `publishAt` 내림차순 (최신순)
- 표시 속성: `title`, `slug`, `publishAt`, `draft`, `tags`

#### 2. **Published**
- 필터: `draft = false`
- 정렬: `publishAt` 내림차순
- 표시 속성: `title`, `publishAt`, `tags`

#### 3. **Drafts**
- 필터: `draft = true`
- 정렬: `modifiedAt` 내림차순
- 표시 속성: `title`, `modifiedAt`

#### 4. **Scheduled** (예약 발행)
- 필터: 
  - `draft = false`
  - `publishAt` > 현재 날짜
- 정렬: `publishAt` 오름차순
- 표시 속성: `title`, `publishAt`

---

## 쿼리 예시

### 발행된 포스트 (최신순)

```typescript
await notion.databases.query({
  database_id: DATABASE_ID,
  filter: {
    and: [
      {
        property: 'draft',
        checkbox: { equals: false },
      },
      {
        property: 'publishAt',
        date: { on_or_before: new Date().toISOString() },
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
```

### 특정 태그 포스트

```typescript
await notion.databases.query({
  database_id: DATABASE_ID,
  filter: {
    and: [
      {
        property: 'draft',
        checkbox: { equals: false },
      },
      {
        property: 'tags',
        multi_select: { contains: 'Next.js' },
      },
    ],
  },
})
```

### 최근 업데이트된 포스트

```typescript
await notion.databases.query({
  database_id: DATABASE_ID,
  filter: {
    property: 'draft',
    checkbox: { equals: false },
  },
  sorts: [
    {
      property: 'modifiedAt',
      direction: 'descending',
    },
  ],
  page_size: 5,
})
```

---

## 마이그레이션 매핑

### Astro content.config.ts → Notion Database

| Astro Property | Notion Property | 변경 사항 |
|---|---|---|
| `title` | `title` | 동일 |
| `description` | `description` | 동일 |
| `publishAt` | `publishAt` | 동일 |
| `modifiedAt` | `modifiedAt` | 동일 |
| `tags` | `tags` | 동일 |
| `slug` | `slug` | 동일 |
| `draft` (filter) | `draft` | Checkbox 속성으로 명시화 |

---

## 데이터 검증

### TypeScript 타입

```typescript
import { z } from 'zod'

export const PostMetadataSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(200).optional(),
  publishedAt: z.date().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  draft: z.boolean(),
})

export type PostMetadata = z.infer<typeof PostMetadataSchema>
```

### 런타임 검증

```typescript
export function validatePost(post: unknown): PostMetadata {
  try {
    return PostMetadataSchema.parse(post)
  } catch (error) {
    console.error('Invalid post data:', error)
    throw new Error('Post validation failed')
  }
}
```

---

## 권장 사항

### Slug 생성 규칙
1. **수동 입력** (권장): 명확하고 의미있는 slug
2. **자동 생성**: Formula 사용 (title 기반)
3. **검증**: 중복 체크, URL-safe 문자만 사용

### Draft 관리
- 새 포스트 작성 시 `draft = true` (기본값)
- 발행 준비 완료 시 `draft = false`
- 아카이브 필요 시 별도 `archived` 속성 추가 또는 Database 분리

### 태그 관리
- 태그는 5-10개 이내로 제한
- 일관된 네이밍 사용 (예: "Next.js" vs "NextJS")
- 대소문자 일관성 유지

### 발행 날짜
- 과거 포스트 임포트 시: 실제 발행 날짜 입력
- 예약 발행: 미래 날짜 입력 (쿼리로 자동 필터링)
