# Cloudflare Pages 정적 사이트 배포 가이드

## 🎯 완전 정적 사이트 전략

- **빌드 시점**: Notion 데이터를 JSON으로 변환하여 저장
- **런타임**: JSON 파일만 읽어서 렌더링 (API 호출 없음)
- **장점**: 매우 빠른 로딩, 낮은 비용, 안정적인 배포

## 📋 배포 전 준비

### 1. 환경변수 설정
Cloudflare Pages 대시보드 → Settings → Environment variables

```
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx  
NEXT_PUBLIC_SITE_URL=https://blog.ll3.kr
NEXT_PUBLIC_AUTHOR_NAME=임채승
```

### 2. Node.js 버전
`package.json`에 engines 추가 (이미 설정됨):
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🚀 Cloudflare Pages 배포 설정

### 1. 기본 설정
- **Framework preset**: `Next.js (Static HTML Export)`
- **Build command**: `bun run build`
- **Build output directory**: `out`
- **Root directory**: `/`

### 2. 빌드 과정
```bash
# 1. 이미지 다운로드
bun run download-images

# 2. Notion 데이터 → JSON 변환  
bun run build-data

# 3. Next.js 정적 사이트 빌드
bun run build
```

### 3. 배포 후 파일 구조
```
out/
├── _next/          # Next.js 정적 자산
├── blog/           # 블로그 페이지
├── images/         # 다운로드된 이미지
├── data/           # JSON 데이터 (빌드 후 불필요)
├── index.html      # 홈페이지
└── ...
```

## 🔧 Cloudflare 최적화 설정

### 1. 이미지 최적화
Cloudflare의 **Speed > Optimization** 사용:
- **WebP conversion**: 자동 WebP 변환
- ** Polish**: 이미지 압축
- **Mirage**: 모바일 이미지 최적화

### 2. 캐시 규칙
```
# Pages Rules 설정
blog.ll3.kr/images/*             - Cache Level: Cache Everything, Edge TTL: 1 month
blog.ll3.kr/_next/static/*       - Cache Level: Cache Everything, Edge TTL: 1 year  
blog.ll3.kr/*                    - Cache Level: Cache Everything, Edge TTL: 4 hours
```

### 3. 리디렉션 규칡
```
# 필요한 경우 설정
/about-me -> /about
/portfolio -> /
```

## 📊 성능 예상

### 장점:
- **FCP/LCP**: 매우 빠름 (< 1초)
- **Core Web Vitals**: 95+ 점수 예상
- **TTFB**: Edge 캐시로 < 100ms
- **API 비용**: 0 (런타임 API 호출 없음)

### 예상 메트릭:
- **빌드 시간**: 1-2분 (포스트 수에 따라)
- **사이트 크기**: 5-10MB (이미지 포함)
- **페이지 로드**: < 1초 (전 세계)

## 🔄 업데이트 워크플로우

### 새 포스트 발행 시:
1. Notion에 포스트 작성
2. GitHub에 코드 푸시
3. Cloudflare가 자동으로 빌드/배포
4. 1-2분 내에 전 세계에 배포 완료

### 주기적인 유지보수:
- 월 1회 빌드 실행하여 최신 데이터 동기화
- 이미지 정리 (사용하지 않는 이미지 삭제)

## ⚠️ 주의사항

### 1. Notion API 제한
- 빌드 시점에만 API 호출 (제한 걱정 없음)
- 빌드 빈도 조절 필요

### 2. 데이터 일관성
- 빌드 시점 데이터 기반으로 렌더링
- 실시간 동기화 아님

### 3. 이미지 관리
- `/public/images/`에 있는 파일들만 배포됨
- 빌드 후 불필요한 이미지 정리 필요

### 4. Cloudflare Worker 미사용
- 이 프로젝트는 Cloudflare Worker/Wrangler를 사용하지 않습니다.
- Cloudflare Pages 정적 배포만 사용합니다.

## 🎉 배포 확인 체크리스트

- [ ] 환경변수 설정 완료
- [ ] 빌드 성공 확인 (`bun run build`)
- [ ] `out/` 디렉토리 생성 확인  
- [ ] Cloudflare Pages 배포 성공
- [ ] 도메인 연결 (blog.ll3.kr)
- [ ] SSL 인증서 활성화 확인
- [ ] 페이지 로딩 속도 테스트
- [ ] 모바일 반응형 확인
- [ ] SEO 메타태그 확인
