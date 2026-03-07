import { About } from "@/components/About";
import { KeyAchievements } from "@/components/KeyAchievements";
import { Skills } from "@/components/Skills";
import { Background } from "@/components/Background";
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
    <main className="space-y-0">
      <About />
      <KeyAchievements />
      <Skills />
      <Background />
      
      {/* 더 보기 섹션 */}
      <section className="py-24 px-4 bg-black/[0.01] border-y border-border/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em] mb-12 text-center">
            Deep Dive
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Link
              href="/projects"
              className="group p-8 bg-white rounded-2xl border border-border/60 shadow-sm hover:border-accent/40 transition-all active:scale-[0.98]"
            >
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                Projects →
              </h3>
              <p className="text-muted text-[15px] font-medium leading-relaxed break-keep">
                실제 비즈니스 임팩트를 만든 프로젝트와 기술적 의사결정 과정을 확인하세요.
              </p>
            </Link>
            <Link
              href="/experience"
              className="group p-8 bg-white rounded-2xl border border-border/60 shadow-sm hover:border-accent/40 transition-all active:scale-[0.98]"
            >
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                Experience →
              </h3>
              <p className="text-muted text-[15px] font-medium leading-relaxed break-keep">
                스타트업과 조직에서의 경력, 그리고 함께 성장해온 협업 이력을 확인하세요.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Contact currentYear={currentYear} />
    </main>
  );
}
