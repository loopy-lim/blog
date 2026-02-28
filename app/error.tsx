'use client'

import { useEffect } from 'react'

type ErrorWithDigest = Error & { digest?: string }

export default function Error({
  error,
  reset,
}: {
  error: ErrorWithDigest
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Router error boundary caught an error:', error)
    if (error?.digest) {
      console.error('Error digest:', error.digest)
    }
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-6">
        <h1 className="text-xl font-black text-foreground">Something went wrong.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page failed to render. Check logs with the digest below.
        </p>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm font-mono text-foreground break-all">
          digest: {error?.digest ?? 'N/A'}
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-4 inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-bold hover:bg-gray-50"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
