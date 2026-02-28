import { Hero } from "@/components/Hero";
import { Contact } from "@/components/Contact";
import { RecentPosts } from "@/components/RecentPosts";
import { getStaticDatabase } from "@/lib/static-data";
import { getDefaultCover, getLocalImagePath } from "@/lib/image-utils";

// 포스트 타입 정의
interface BlogPost {
  id: string;
  title: string;
  description?: string;
  slug: string;
  publishAt?: string;
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
      publishAt: post.publishedAt,
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

  try {
    recentPosts = await getRecentPosts();
  } catch (error) {
    console.error('Error loading recent posts:', error);
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <RecentPosts posts={recentPosts} />
      <Contact />
    </main>
  );
}
