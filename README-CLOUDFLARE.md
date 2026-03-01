# Cloudflare Pages 배포 가이드 (Next.js 정적 export)

## 1. 준비사항

### 환경변수 설정
Cloudflare Pages 대시보드에서 아래 환경변수를 설정합니다.

```
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.pages.dev
NEXT_PUBLIC_AUTHOR_NAME=Your Name
```

### 빌드 설정
- 프레임워크: `Next.js (Static HTML Export)`
- 빌드 명령어: `bun run build`
- 출력 디렉토리: `out`

## 2. Cloudflare Pages 설정

1. Cloudflare 대시보드에서 `Pages` 프로젝트를 생성합니다.
2. GitHub 리포지토리를 연결합니다.
3. Build configuration을 아래처럼 설정합니다.

```bash
Build command: bun run build
Build output directory: out
Root directory: /
```

## 3. 로컬 확인

```bash
# 정적 사이트 빌드
bun run build

# out/ 로컬 확인
bun run start
```

## 4. 체크리스트

- `bun run build`가 성공한다.
- `out/` 디렉토리가 생성된다.
- 배포 후 `/`, `/blog`, `/blog/<slug>` 페이지가 정상 렌더링된다.
- `_next/static` 자산이 정상 로드된다.
