'use client';

import { Info } from 'lucide-react';
import { useDashboard } from '@/lib/context';

export function DemoBanner() {
  const { viewMode } = useDashboard();
  const isInternal = viewMode === 'internal';

  return (
    <div
      className={`rounded-xl border px-4 py-3 flex items-start gap-3 text-sm mb-4 transition-colors ${
        isInternal
          ? 'bg-violet-50 border-violet-200 text-violet-900'
          : 'bg-sky-50 border-sky-200 text-sky-900'
      }`}
    >
      <Info className="w-4 h-4 mt-0.5 shrink-0" />
      <div>
        {isInternal ? (
          <>
            <strong>Internal View</strong> — You are seeing everything: raw notes, internal-only tasks, cost flags,
            escalation threads, unredacted blockers, and all technical details. This view is for the delivery team only.
          </>
        ) : (
          <>
            <strong>Customer View</strong> — Showing only sanitized, customer-facing content: milestone progress,
            shared documents, and public updates. Internal tasks, cost data, and private notes are hidden.
          </>
        )}
      </div>
    </div>
  );
}
