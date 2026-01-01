import { Suspense } from 'react'
import { getStaticDatabase } from '@/lib/static-data'
import { PostCard } from '@/components/blog/PostCard'
import Link from 'next/link'

// 정적 사이트로 변경 - revalidate 제거

export default async function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </div>
    </main>
  )
}

function PostListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-5/6"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function PostList() {
  try {
    const blogData = await getStaticDatabase()

    if (blogData.posts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No posts found.
          </p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            Check back later for new content!
          </p>
        </div>
      )
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogData.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error loading posts:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 text-lg">
          Error loading posts. Please run &quot;pnpm build-data&quot; first.
        </p>
      </div>
    )
  }
}
