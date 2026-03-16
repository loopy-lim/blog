export const siteConfig = {
  title: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'My Blog',
  author: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author',
  description:
    '임채승의 기술 블로그. 프론트엔드, React, Flutter, 성능 최적화, CI/CD, 실무 트러블슈팅 경험을 기록합니다.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/loopy-lim',
  },
} as const

export type SiteConfig = typeof siteConfig
