'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react'
import { siteConfig } from '@/site.config'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
]

const aboutSubItems = [
  { name: '소개', href: '/about' },
  { name: '프로젝트', href: '/projects' },
  { name: '경력', href: '/experience' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const pathname = usePathname()
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  useEffect(() => {
    setScrolled(false)
    setMobileMenuOpen(false)
    setAboutDropdownOpen(false)
  }, [pathname])

  // 외부 클릭 시 dropdown 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setAboutDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // dropdown 위치 계산
  useEffect(() => {
    if (aboutDropdownOpen && dropdownButtonRef.current) {
      const buttonRect = dropdownButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: buttonRect.bottom + 8,
        left: buttonRect.left,
      })
    }
  }, [aboutDropdownOpen, scrolled])

  // About 관련 페이지인지 확인
  const isAboutActive = pathname.startsWith('/about') || pathname.startsWith('/projects') || pathname.startsWith('/experience')

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 sm:py-6 flex justify-center pointer-events-none">
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: scrolled ? 'blur(24px) saturate(110%)' : 'blur(12px) saturate(100%)',
          borderRadius: scrolled ? '2rem' : '1.5rem',
          maxWidth: scrolled ? '450px' : '1024px',
          width: '100%',
          paddingLeft: scrolled ? '1.25rem' : '1.5rem',
          paddingRight: scrolled ? '1.25rem' : '1.5rem',
          paddingTop: '0.625rem',
          paddingBottom: '0.625rem',
          gap: scrolled ? '2rem' : '1rem',
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 30,
        }}
        className="flex items-center justify-between pointer-events-auto overflow-hidden border border-white/40 shadow-xl shadow-black/[0.03]"
      >
        {/* Logo / Title Area */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground relative overflow-hidden transition-all group-hover:bg-accent">
            <div className="w-2.5 h-2.5 rounded-full bg-background absolute bottom-1 right-1" />
          </div>

          <AnimatePresence>
            {!scrolled && (
              <motion.span
                key="nav-title"
                initial={{ opacity: 0, x: -10, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -10, width: 0 }}
                className="text-[14px] font-black tracking-tight text-foreground whitespace-nowrap hidden sm:inline-block overflow-hidden"
              >
                {siteConfig.author}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.filter(item => item.name !== 'About').map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-[13px] font-bold transition-all duration-300 rounded-full group ${
                  isActive
                    ? 'text-accent'
                    : 'text-muted/60 hover:text-foreground'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill-active"
                    className="absolute inset-0 bg-accent/[0.03] border border-accent/10 rounded-full -z-0"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}

          {/* About Dropdown Button */}
          <button
            ref={dropdownButtonRef}
            onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
            className={`relative px-4 py-2 text-[13px] font-bold transition-all duration-300 rounded-full flex items-center gap-1 ${
              isAboutActive
                ? 'text-accent'
                : 'text-muted/60 hover:text-foreground'
            }`}
          >
            <span className="relative z-10">About</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
            {isAboutActive && (
              <motion.div
                layoutId="nav-pill-active-about"
                className="absolute inset-0 bg-accent/[0.03] border border-accent/10 rounded-full -z-0"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>

          <div className="w-px h-4 bg-border/40 mx-2" />

          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted/40 hover:text-foreground transition-all duration-300 shrink-0"
          >
            <Github size={18} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground shrink-0 pointer-events-auto"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* About Dropdown Menu - rendered at header level to escape overflow-hidden */}
      <AnimatePresence>
        {aboutDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
            className="w-36 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 py-1.5 z-[101] pointer-events-auto"
          >
            {aboutSubItems.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href}
                onClick={() => setAboutDropdownOpen(false)}
                className={`block px-4 py-2 text-[13px] font-medium transition-colors ${
                  pathname === subItem.href
                    ? 'text-accent bg-accent/5'
                    : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                }`}
              >
                {subItem.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-2xl rounded-[2rem] p-8 shadow-2xl md:hidden pointer-events-auto border border-white/40"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-4 text-xl font-bold text-foreground border-b border-border/40 last:border-0"
                >
                  {item.name}
                  <ArrowUpRight size={20} className="text-muted/20" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
