'use client';

import React, { createContext, useContext, useState } from 'react';
import { Project } from '@/types';
import { MOCK_PROJECTS } from '@/lib/mockData';

type ViewMode = 'internal' | 'customer';

interface DashboardContextValue {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [viewMode, setViewMode] = useState<ViewMode>('internal');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DashboardContext.Provider
      value={{
        projects,
        setProjects,
        viewMode,
        setViewMode,
        selectedProjectId,
        setSelectedProjectId,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
