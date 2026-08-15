'use client';

import { AlertTriangle } from 'lucide-react';
import { cn, daysSinceActivity } from '@/lib/utils';

export function StaleAlert({ lastActivityDate, className }: { lastActivityDate: string; className?: string }) {
  const days = daysSinceActivity(lastActivityDate);
  if (days < 7) return null;
  const urgent = days >= 14;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border',
        urgent
          ? 'bg-red-50 text-red-700 border-red-200'
          : 'bg-amber-50 text-amber-700 border-amber-200',
        className
      )}
    >
      <AlertTriangle className="w-3 h-3" />
      Stale: {days}d
    </span>
  );
}
