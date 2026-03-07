import { Projects } from '@/components/Projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: '프로젝트 사례와 성과',
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Projects />
    </main>
  );
}
