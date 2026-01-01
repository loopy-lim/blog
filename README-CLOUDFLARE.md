# Cloudflare Pages 배포 가이드

## 1. 준비사항

### 환경변수 설정
Cloudflare Pages 대시보드에서 환경변수를 설정해야 합니다:

```
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.pages.dev
NEXT_PUBLIC_AUTHOR_NAME=Your Name
```

### 빌드 설정
- **프레임워크**: Next.js
- **빌드 명령어**: `pnpm build`
- **출력 디렉토리**: `.next` (Next.js가 자동으로 설정)

## 2. 배포步骤

### Cloudflare Pages 설정:
1. Cloudflare 대시보드 → Pages → "Create application"
2. GitHub 리포지토리 연결
3. 빌드 설정:
   ```bash
   Build command: pnpm build
   Build output directory: .next
   Root directory: / 
   ```

### Node.js 버전 설정
`package.json`에 engines 필드 추가:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 3. 성능 최적화

### Edge Functions 설정
```javascript
// cloudflare-pages.config.js
export const onRequest = async (context) => {
  const response = await context.next();
  
  // 정적 자원 캐싱
  if (context.request.url.includes('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // 이미지 캐싱
  if (context.request.url.includes('/images')) {
    response.headers.set('Cache-Control', 'public, max-age=86400');
  }
  
  return response;
};
```

## 4. 도메인 연결

### 커스텀 도메인 설정:
1. Pages 프로젝트 → Custom domains
2. 도메인 추가 (예: blog.yourdomain.com)
3. DNS 레코드 자동 설정 확인

### SSL 설정:
- 자동으로 SSL 인증서 발급됨
- HTTPS强制 리디렉션 설정 가능

## 5. 주의사항

### ISR (Incremental Static Regeneration):
- Cloudflare Pages는 Next.js 15 ISR을 지원
- revalidate 시간이 1시간 이상 권장
- Edge Functions로 캐시 제어 가능

### 이미지 최적화:
- Next.js Image 컴포넌트 사용 가능
- Cloudflare Image Optimizations와 연동
- WebP/AVIF 포맷 자동 변환

### Notion API 제한:
- Notion API 요청 제한: 3 requests/second
- React cache()로 중복 요청 방지
- Edge에서 캐시하여 API 호출 최소화

## 6. 모니터링

### Cloudflare Analytics:
- Real User Metrics (RUM)
- Page Views, 방문자 수
- Core Web Vitals 측정

### 성능 측정:
```bash
# 빌드 크기 확인
pnpm build
ls -la .next/

# Web Vitals 테스트
npx lighthouse https://your-domain.pages.dev
```

## 7. 문제 해결

### 빌드 오류:
- Node.js 버전 확인 (>=18)
- pnpm 버전 호환성 확인
- 환경변수 설정 확인

### ISR 동작 안할 때:
- revalidate 시간 확인
- 캐시 헤더 설정 확인
- Functions 설정 확인

### 이미지 로딩 문제:
- remotePatterns 설정 확인
- Cloudflare 이미지 최적화 확인
- CORS 설정 확인
