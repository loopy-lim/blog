import { Hero } from "@/components/Hero";
import { Contact } from "@/components/Contact";
import { RecentPosts } from "@/components/RecentPosts";
import { getStaticDatabase } from "@/lib/static-data";

// 포스트 타입 정의
interface BlogPost {
  id: string;
  title: string;
  description?: string;
  slug: string;
  publishAt?: string;
  tags?: string[];
}

async function getRecentPosts(): Promise<BlogPost[]> {
  try {
    const blogData = await getStaticDatabase();
    const posts = blogData.posts.slice(0, 4);

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      publishAt: post.publishedAt,
      tags: post.tags,
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
