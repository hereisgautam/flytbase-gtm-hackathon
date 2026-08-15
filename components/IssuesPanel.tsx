'use client';

import { useDashboard } from '@/lib/context';
import { Project, IssueCategory, IssuePriority, IssueStatus } from '@/types';
import { Badge } from './ui/Badge';
import { Card, CardHeader, CardBody } from './ui/Card';
import { PRIORITY_COLORS, ISSUE_STATUS_COLORS, cn } from '@/lib/utils';
import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  'Bug':               'bg-red-50 text-red-700 border-red-200',
  'Feature Request':   'bg-violet-50 text-violet-700 border-violet-200',
  'Question':          'bg-blue-50 text-blue-700 border-blue-200',
  'Support':           'bg-amber-50 text-amber-700 border-amber-200',
  'Implementation':    'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function IssuesPanel({ project }: { project: Project }) {
  const { viewMode } = useDashboard();
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');

  const categories: (IssueCategory | 'All')[] = ['All', 'Bug', 'Feature Request', 'Question', 'Support', 'Implementation'];
  const statuses: (IssueStatus | 'All')[] = ['All', 'Open', 'Under Review', 'Resolved'];

  const visible = project.issues.filter(issue => {
    if (issue.isInternalOnly && viewMode === 'customer') return false;
    if (categoryFilter !== 'All' && issue.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && issue.status !== statusFilter) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500" />
            Issues
            <span className="ml-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{visible.length}</span>
          </h2>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            {/* Category filter */}
            <div className="flex gap-1 flex-wrap">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={cn(
                    'px-2.5 py-1 rounded-full border text-xs font-medium transition',
                    categoryFilter === c
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-slate-200" />
            {/* Status filter */}
            <div className="flex gap-1">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'px-2.5 py-1 rounded-full border text-xs font-medium transition',
                    statusFilter === s
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {visible.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400 text-center">No issues match the current filters.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {visible.map(issue => (
              <div key={issue.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition">
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="text-sm text-slate-800 truncate">{issue.title}</span>
                  {issue.isInternalOnly && <span title="Internal only"><Lock className="w-3 h-3 text-violet-400 shrink-0" /></span>}
                </div>
                <Badge className={cn(CATEGORY_COLORS[issue.category], 'shrink-0')}>{issue.category}</Badge>
                <Badge className={cn(PRIORITY_COLORS[issue.priority], 'shrink-0')}>{issue.priority}</Badge>
                <Badge className={cn(ISSUE_STATUS_COLORS[issue.status], 'shrink-0')}>{issue.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
