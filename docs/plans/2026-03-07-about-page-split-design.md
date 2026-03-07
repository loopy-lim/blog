# About 페이지 분리 설계

## 목적

1. **사용자 경험 개선** - 긴 스크롤 감소
2. **탐색 개선** - 헤더 메뉴에서 직접 접근
3. **SEO/공유 최적화** - 개별 URL로 공유 가능

## URL 구조

```
/about          → 소개 + KeyAchievements + Skills + Contact
/projects       → Projects (caseStudies)
/experience     → Experience (경력 타임라인)
```

## 페이지 구성

### `/about` 페이지
- About (소개)
- KeyAchievements
- Skills
- **"더 보기" 섹션** → Projects, Experience로 이동하는 CTA 카드
- Contact

### `/projects` 페이지
- Projects 컴포넌트 (기존 `components/Projects.tsx` 재사용)
- `/app/projects/page.tsx` 신규 생성

### `/experience` 페이지
- Experience 컴포넌트 (기존 `components/Experience.tsx` 재사용)
- `/app/experience/page.tsx` 신규 생성

## 내비게이션 구조

### Navbar 드롭다운
```
[Blog] [About ▼]
         ├── 소개 (/about)
         ├── 프로젝트 (/projects)
         └── 경력 (/experience)
```

### 구현 상세
- About 메뉴 hover 시 드롭다운 표시
- 모바일: 햄버거 메뉴 내에서 하위 메뉴 펼침
- 현재 페이지 하이라이트 유지

## 파일 변경사항

### 신규 생성
- `app/projects/page.tsx` - Projects 페이지
- `app/experience/page.tsx` - Experience 페이지

### 수정
- `app/about/page.tsx` - Projects, Experience 섹션 제거, "더 보기" 섹션 추가
- `components/layout/Navbar.tsx` - 드롭다운 메뉴 구현

### 재사용 (변경 없음)
- `components/Projects.tsx`
- `components/Experience.tsx`
- `lib/data.ts`

## 데이터

기존 `lib/data.ts`의 `resume` 객체 그대로 사용:
- `caseStudies` → `/projects` 페이지
- `experience` → `/experience` 페이지
- 나머지 → `/about` 페이지
