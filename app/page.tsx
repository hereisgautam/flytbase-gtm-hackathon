'use client';

import { Header } from '@/components/Header';
import { DemoBanner } from '@/components/DemoBanner';
import { ProjectsOverview } from '@/components/ProjectsOverview';
import { ProjectDetail } from '@/components/ProjectDetail';
import { useDashboard } from '@/lib/context';

export default function Home() {
  const { selectedProjectId } = useDashboard();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <DemoBanner />
        {selectedProjectId ? <ProjectDetail /> : <ProjectsOverview />}
      </main>
    </div>
  );
}
