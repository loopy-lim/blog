import { About } from "@/components/About";
import { KeyAchievements } from "@/components/KeyAchievements";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.author}에 대해 알아보세요. 기술 스택, 경험, 프로젝트 등을 소개합니다.`,
  openGraph: {
    title: `About | ${siteConfig.title}`,
    description: `${siteConfig.author}에 대해 알아보세요. 기술 스택, 경험, 프로젝트 등을 소개합니다.`,
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.title,
    locale: "ko_KR",
    type: "profile",
    images: [
      {
        url: "/images/og/default.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About | ${siteConfig.title}`,
    description: `${siteConfig.author}에 대해 알아보세요. 기술 스택, 경험, 프로젝트 등을 소개합니다.`,
    images: ["/images/og/default.jpg"],
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main>
      <About />
      <KeyAchievements />
      <Skills />
      {/* 더 보기 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            더 알아보기
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/projects"
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                프로젝트 →
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                진행한 프로젝트와 성과를 확인하세요.
              </p>
            </Link>
            <Link
              href="/experience"
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                경력 →
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                경력과 업무 이력을 확인하세요.
              </p>
            </Link>
          </div>
        </div>
      </section>
      <Contact currentYear={currentYear} />
    </main>
  );
}
