export const siteConfig = {
  title: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'My Blog',
  author: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author',
  description: 'Loopy is a software engineer and blogger who shares insights on web development, programming, and technology trends.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/loopy-lim',
  },
} as const

export type SiteConfig = typeof siteConfig
