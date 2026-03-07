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

    const findHeadings = () => {
      const article = document.querySelector('article')
      if (!article) return false

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

    if (findHeadings()) return

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
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!mounted || headings.length === 0) return null

  return (
    <nav className="space-y-1 relative">
      <ul className="relative z-10">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          
          return (
            <li key={heading.id} className="relative group/toc">
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(heading.id)
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.pageYOffset - 100
                    window.scrollTo({ top, behavior: 'smooth' })
                  }
                }}
                className={`block py-2 pr-4 text-[12px] font-bold leading-snug transition-all duration-200 border-l border-transparent hover:text-foreground ${
                  heading.level === 1 ? 'pl-4' : 
                  heading.level === 2 ? 'pl-4' : 
                  'pl-8 text-[11px] opacity-80'
                } ${
                  isActive
                    ? 'text-accent border-accent bg-stone-50/50'
                    : 'text-muted border-border hover:border-muted/30'
                }`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
