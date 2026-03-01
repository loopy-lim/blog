'use client'

import { useEffect, useState } from 'react'
import NextTopLoader from 'nextjs-toploader'

export default function TopLoader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextTopLoader 
      color="#000000"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #000000,0 0 5px #000000"
    />
  )
}
