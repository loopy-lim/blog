import { Experience } from '@/components/Experience';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience',
  description: '경력 및 업무 이력',
};

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Experience />
    </main>
  );
}
