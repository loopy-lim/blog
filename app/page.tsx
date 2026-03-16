import { Hero } from "@/components/Hero";
import { Contact } from "@/components/Contact";
import { RecentPosts } from "@/components/RecentPosts";
import { getStaticDatabase } from "@/lib/static-data";
import { getDefaultCover, getLocalImagePath } from "@/lib/image-utils";
import { formatDateString } from "@/lib/utils";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${siteConfig.author} | 프론트엔드 개발자 기술 블로그`,
  description: siteConfig.description,
  keywords: [
    siteConfig.author,
    "프론트엔드 개발자",
    "기술 블로그",
    "React",
    "Flutter",
    "성능 최적화",
    "CI/CD",
  ],
  openGraph: {
    title: `${siteConfig.author} | 프론트엔드 개발자 기술 블로그`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    locale: "ko_KR",
    type: "website",
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
    title: `${siteConfig.author} | 프론트엔드 개발자 기술 블로그`,
    description: siteConfig.description,
    images: ["/images/og/default.jpg"],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

// 포스트 타입 정의
interface BlogPost {
  id: string;
  title: string;
  description?: string;
  slug: string;
  publishedAtLabel?: string;
  tags?: string[];
  coverImage?: string;
}

async function getRecentPosts(): Promise<BlogPost[]> {
  try {
    const blogData = await getStaticDatabase();
    const posts = blogData.posts.slice(0, 6);

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      publishedAtLabel: post.publishedAt ? formatDateString(post.publishedAt) : "Recent",
      tags: post.tags,
      coverImage: post.coverImage ? getLocalImagePath(post.coverImage) : getDefaultCover(post.id),
    }));
  } catch (error) {
    console.error("Error loading recent posts:", error);
    return [];
  }
}

export default async function Home() {
  let recentPosts: BlogPost[] = [];
  const currentYear = new Date().getFullYear();

  try {
    recentPosts = await getRecentPosts();
  } catch (error) {
    console.error('Error loading recent posts:', error);
  }

  return (
    <main>
      <Hero />
      <RecentPosts posts={recentPosts} />
      <Contact currentYear={currentYear} />
    </main>
  );
}
