'use client'

import Link from 'next/link'

// 포스트 타입 정의
interface BlogPost {
  id: string
  title: string
  description?: string
  slug: string
  publishAt?: string
  tags?: Array<{ name: string }>
}

interface RecentPostsProps {
  posts: BlogPost[]
}

function formatDate(dateString?: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            최근 포스트
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            개발과 성장에 대한 기록들
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up delay-200">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-400"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2 transition-colors">
                  <Link href={`/blog/${post.slug}`} className="absolute inset-0" />
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {post.description}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.name}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={post.publishAt}>{formatDate(post.publishAt)}</time>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-3 text-lg font-medium text-gray-900 transition-colors hover:border-blue-600 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            모든 포스트 보기
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
