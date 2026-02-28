'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ZoomableImageProps {
  src: string
  alt: string
  caption?: string
}

export function ZoomableImage({ src, alt, caption }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // 모달 오픈 시 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <div 
        className="relative w-full rounded-2xl overflow-hidden border border-border/40 shadow-sm flex justify-center mx-auto transition-shadow duration-500 hover:shadow-md cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto object-contain block mx-auto transition-transform duration-700 hover:scale-[1.01] max-h-[75vh]"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            <motion.button
              className="fixed top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110]"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-full flex flex-col items-center cursor-zoom-out"
            >
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              {caption && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-white/80 text-center font-medium max-w-2xl px-4"
                >
                  {caption}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
