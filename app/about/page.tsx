import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";

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
  return (
    <main className="min-h-screen bg-background">
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </main>
  );
}
