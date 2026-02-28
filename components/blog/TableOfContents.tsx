'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
      {/* Vertical Indicator Line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
      
      <ul className="relative z-10">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          
          return (
            <li key={heading.id} className="relative">
              {isActive && (
                <motion.div 
                  layoutId="toc-active"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  })
                }}
                className={`block py-1.5 pr-4 text-[13px] font-bold leading-snug transition-all duration-300 border-l-2 border-transparent hover:text-foreground ${
                  heading.level === 1 ? 'pl-4' : 
                  heading.level === 2 ? 'pl-4' : 
                  'pl-8 text-[12px] opacity-80'
                } ${
                  isActive
                    ? 'text-accent border-accent/30'
                    : 'text-muted/40'
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
