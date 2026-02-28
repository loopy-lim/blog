'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  FileText, 
  User, 
  Code, 
  ChevronLeft, 
  Menu,
  Github,
  Mail,
  ExternalLink
} from 'lucide-react'
import { siteConfig } from '@/site.config'

const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Blog', icon: FileText, href: '/blog' },
  { name: 'About', icon: User, href: '/about' },
  { name: 'Projects', icon: Code, href: '/#projects' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) setIsOpen(false)
      else setIsOpen(true)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => setIsOpen(!isOpen)

  const sidebarVariants = {
    open: { width: 240, x: 0 },
    closed: { width: 0, x: -240 },
    mobileOpen: { width: 240, x: 0 },
    mobileClosed: { width: 0, x: -240 }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && !isOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md border shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[2px]"
          onClick={toggleSidebar}
        />
      )}

      <motion.aside
        initial={isMobile ? "mobileClosed" : "open"}
        animate={isMobile ? (isOpen ? "mobileOpen" : "mobileClosed") : (isOpen ? "open" : "closed")}
        variants={sidebarVariants}
        className={`fixed top-0 left-0 h-full bg-[#fbfbfa] border-r border-[#edece9] z-50 overflow-hidden flex flex-col`}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold hover:bg-gray-200/50 p-1.5 rounded-md transition-colors w-full overflow-hidden">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs shrink-0">
              {siteConfig.title[0]}
            </div>
            <span className="truncate text-sm">{siteConfig.title}</span>
          </Link>
          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-200/50 rounded-md transition-colors text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-gray-200/70 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#edece9] space-y-4">
          <div className="flex items-center gap-3 px-3">
             <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
               <Github size={18} />
             </a>
             <a href={`mailto:${siteConfig.author}`} className="text-gray-400 hover:text-gray-600 transition-colors">
               <Mail size={18} />
             </a>
          </div>
          <p className="px-3 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            © 2024 {siteConfig.author}
          </p>
        </div>
      </motion.aside>

      {/* Main Content Padding Adjuster */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .main-content {
            margin-left: ${isOpen ? '240px' : '0px'};
            transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      `}</style>
    </>
  )
}
