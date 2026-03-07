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
      <div className="w-full max-w-lg rounded-xl glass-panel p-12 border border-white/40 relative overflow-hidden">
        {/* Subtle top light effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Something went wrong.</h1>
        <p className="mt-4 text-base text-muted font-medium leading-relaxed">
          The page failed to render properly. <br />
          Please try again or check back later.
        </p>

        <div className="mt-10 rounded-lg bg-black/[0.03] border border-black/[0.05] p-6 text-[13px] font-mono text-muted/80 break-all leading-relaxed">
          <span className="text-foreground/40 mr-2">DIGEST:</span>
          {error?.digest ?? 'N/A'}
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex items-center justify-center w-full sm:w-auto rounded-lg bg-foreground text-background px-8 py-3.5 text-sm font-bold hover:bg-accent transition-all duration-300 active:scale-[0.98]"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
