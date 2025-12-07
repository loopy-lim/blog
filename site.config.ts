export const siteConfig = {
  title: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'My Blog',
  author: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author',
  description: 'A blog built with Next.js and Notion',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
} as const

export type SiteConfig = typeof siteConfig