import { Hero } from "@/components/Hero";
import { Contact } from "@/components/Contact";
import { RecentPosts } from "@/components/RecentPosts";
import { getDatabase } from "@/lib/notion";

// 포스트 타입 정의
interface BlogPost {
  id: string;
  title: string;
  description?: string;
  slug: string;
  publishAt?: string;
  tags?: Array<{ name: string }>;
}

async function getRecentPosts(): Promise<BlogPost[]> {
  try {
    const database = await getDatabase();
    const posts = database.results as Array<{
      id: string;
      properties: {
        title: { title: Array<{ plain_text: string }> };
        slug: { rich_text: Array<{ plain_text: string }> };
        description?: { rich_text: Array<{ plain_text: string }> };
        publishAt?: { date: { start: string } };
        tags?: { multi_select: Array<{ name: string }> };
      };
    }>;

    return posts.slice(0, 4).map((post) => ({
      id: post.id,
      title: post.properties.title.title[0]?.plain_text || "Untitled",
      description: post.properties.description?.rich_text[0]?.plain_text,
      slug: post.properties.slug.rich_text[0]?.plain_text || post.id,
      publishAt: post.properties.publishAt?.date?.start,
      tags: post.properties.tags?.multi_select,
    }));
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

export default async function Home() {
  const recentPosts = await getRecentPosts();

  return (
    <main className="min-h-screen">
      <Hero />
      <RecentPosts posts={recentPosts} />
      <Contact />
    </main>
  );
}
