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
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  // 페이지 이동 시 Navbar 상태 초기화 (글리치 방지)
  useEffect(() => {
    setScrolled(false)
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 sm:py-6 pointer-events-none flex justify-center">
      <motion.nav 
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.45)',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(12px) saturate(100%)',
          borderRadius: scrolled ? '2rem' : '1.25rem',
          maxWidth: scrolled ? '420px' : '1024px',
          width: '100%',
          paddingLeft: scrolled ? '1.25rem' : '1.5rem',
          paddingRight: scrolled ? '1.25rem' : '1.5rem',
          paddingTop: scrolled ? '0.625rem' : '0.5rem',
          paddingBottom: scrolled ? '0.625rem' : '0.5rem',
          gap: scrolled ? '2rem' : '1rem',
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 30,
        }}
        className="flex items-center justify-between pointer-events-auto overflow-hidden border border-white/20 shadow-black/5"
      >
        {/* Logo / Title Area */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-black/5 bg-white border border-border/50">
            <img 
              src="/favicon.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <AnimatePresence>
            {!scrolled && (
              <motion.span 
                key="nav-title"
                initial={{ opacity: 0, x: -10, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -10, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-[15px] font-black tracking-tight text-foreground whitespace-nowrap hidden sm:inline-block overflow-hidden"
              >
                {siteConfig.title}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-[13px] font-black transition-colors duration-300 rounded-xl group ${
                  isActive 
                    ? 'text-foreground' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="pill-active"
                    className="absolute inset-0 bg-gray-100/80 rounded-xl -z-0"
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

        {/* Mobile Toggle - Show on small screens */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground shrink-0 pointer-events-auto"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-20 sm:top-24 left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl shadow-black/10 md:hidden pointer-events-auto border border-white/20 max-h-[80vh] overflow-y-auto"
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
