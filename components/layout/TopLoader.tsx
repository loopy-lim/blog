'use client'

import NextTopLoaderImport from 'nextjs-toploader'

// Vite/vinext 환경에서 ESM/CJS 인터옵 문제를 해결하기 위한 처리
const NextTopLoader = (NextTopLoaderImport as any).default || NextTopLoaderImport

export default function TopLoader() {
  if (typeof NextTopLoader !== 'function') {
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
