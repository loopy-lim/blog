// Cloudflare Pages Functions for ISR and caching
export const onRequest = async (context) => {
  // ISR 캐싱 헤더 설정
  const response = await context.next();

  // 블로그 페이지는 1시간 캐싱
  if (context.request.url.includes('/blog')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  }

  return response;
};
