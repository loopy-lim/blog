'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Menu, X, ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/site.config'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 임계값을 조금 더 높여서 의도치 않은 깜빡임 방지
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-6 pointer-events-none flex justify-center">
      <motion.nav 
        layout
        initial={false}
        transition={{ 
          type: 'spring', 
          stiffness: 350, 
          damping: 35,
          mass: 1
        }}
        style={{ 
          borderRadius: scrolled ? '9999px' : '1rem',
        }}
        className={`flex items-center justify-between pointer-events-auto overflow-hidden border shadow-black/5 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl px-4 py-2 w-auto gap-8' 
            : 'bg-transparent border-transparent py-2 w-full max-w-5xl px-6'
        }`}
      >
        {/* Logo / Title Area */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <motion.div 
            layout
            className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-black/5 bg-white border border-border/50"
          >
            <img 
              src="/favicon.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          
          <AnimatePresence mode="popLayout">
            {!scrolled && (
              <motion.span 
                key="nav-title"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-[15px] font-black tracking-tight text-foreground whitespace-nowrap hidden sm:inline-block"
              >
                {siteConfig.title}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Desktop Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-[13px] font-black transition-colors duration-300 rounded-full group ${
                  isActive 
                    ? 'text-foreground' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="pill-active"
                    className="absolute inset-0 bg-gray-100 rounded-full -z-0"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
          
          <div className="w-px h-4 bg-border/60 mx-2" />
          
          <a 
            href={siteConfig.links.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-muted hover:text-foreground transition-all duration-300 shrink-0"
          >
            <Github size={18} />
          </a>
        </div>

        {/* Mobile Toggle - Only show when expanded */}
        <AnimatePresence>
          {!scrolled && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground shrink-0"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl shadow-black/10 md:hidden pointer-events-auto border border-white/20"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-4 text-xl font-black text-foreground border-b border-border/50 last:border-0"
                >
                  {item.name}
                  <ArrowUpRight size={20} className="text-muted/40" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
