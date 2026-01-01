'use client'

import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [mounted, setMounted] = useState(false)
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Notion 콘텐츠가 로드될 때까지 대기
    const findHeadings = () => {
      const article = document.querySelector('article')
      if (!article) return false

      // id가 있는 heading만 선택 (BlockRenderer에서 이미 id 부여됨)
      const elements = article.querySelectorAll('h1[id], h2[id], h3[id]')
      if (elements.length === 0) return false

      const items: TOCItem[] = Array.from(elements).map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
      }))
      setHeadings(items)
      return true
    }

    // 즉시 시도
    if (findHeadings()) return

    // 콘텐츠 로드 대기 (MutationObserver 사용)
    const observer = new MutationObserver(() => {
      if (findHeadings()) {
        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [mounted])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  // 서버에서는 렌더링하지 않음
  if (!mounted || headings.length === 0) return null

  return (
    <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
      <nav className="sticky top-24 max-h-[70vh] overflow-y-auto">
        <div className="glass rounded-2xl p-4">
        <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          목차
        </h4>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
                className={`toc-item block text-sm transition-colors ${
                  heading.level === 2 ? 'ml-0' : heading.level === 3 ? 'ml-3' : ''
                } ${
                  activeId === heading.id
                    ? 'active text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
        </div>
      </nav>
    </aside>
  )
}
