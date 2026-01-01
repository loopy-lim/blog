"use client"

import Link from "next/link";
import { resume } from "@/lib/data";
import GradientBackground from "@/components/ui/GradientBackground";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      <GradientBackground />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-6xl font-black tracking-tight text-gray-900 sm:text-7xl lg:text-8xl animate-fade-in-up">
            <span className="block">{resume.basics.name}</span>
            <span className="block text-3xl font-bold text-gray-500 sm:text-4xl mt-4">
              {resume.basics.label}
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600 sm:text-2xl leading-relaxed font-bold animate-fade-in-up delay-100">
            {resume.basics.shortSummary}
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-200">
            <Link
              href={resume.basics.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-gray-900 bg-gray-900 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-transparent hover:text-gray-900"
            >
              <span className="mr-2">GitHub</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-blue-600 bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-transparent hover:text-blue-600"
            >
              더 알아보기
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-green-600 bg-green-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-transparent hover:text-green-600"
            >
              <span className="mr-2">블로그</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
        </div>
      </div>
    </section>
  );
}
