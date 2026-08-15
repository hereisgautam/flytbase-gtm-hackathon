'use client';

import { useDashboard } from '@/lib/context';
import { Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { NLQueryBar } from './NLQueryBar';
import { cn } from '@/lib/utils';

export function Header() {
  const { viewMode, setViewMode, selectedProjectId, setSelectedProjectId } = useDashboard();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 gap-4">
        {/* Logo + breadcrumb */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight">DeliveryOps</span>
          </div>
          {selectedProjectId && (
            <>
              <span className="text-slate-300">/</span>
              <button
                onClick={() => setSelectedProjectId(null)}
                className="text-sm text-slate-500 hover:text-slate-700 transition"
              >
                All Projects
              </button>
            </>
          )}
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setViewMode('internal')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition',
              viewMode === 'internal'
                ? 'bg-white shadow-sm text-slate-900 border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Internal View
          </button>
          <button
            onClick={() => setViewMode('customer')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition',
              viewMode === 'customer'
                ? 'bg-white shadow-sm text-slate-900 border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <EyeOff className="w-3.5 h-3.5" />
            Customer View
          </button>
        </div>
      </div>

      {/* Search row */}
      <div className="px-6 pb-3">
        <NLQueryBar />
      </div>
    </header>
  );
}
