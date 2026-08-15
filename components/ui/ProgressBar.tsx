'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  colorClass?: string;
}

export function ProgressBar({ value, className, colorClass }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const color = colorClass ?? (pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : pct >= 30 ? 'bg-amber-500' : 'bg-red-500');
  return (
    <div className={cn('h-1.5 w-full rounded-full bg-slate-100 overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
    </div>
  );
}
