'use client';

import { useDashboard } from '@/lib/context';
import { Badge } from './ui/Badge';
import { AvatarGroup } from './ui/Avatar';
import { ProgressBar } from './ui/ProgressBar';
import { StaleAlert } from './StaleAlert';
import { MilestonesPanel } from './MilestonesPanel';
import { IssuesPanel } from './IssuesPanel';
import { DocumentVault } from './DocumentVault';
import { ActivityFeed } from './ActivityFeed';
import { STATUS_COLORS, formatDate, cn } from '@/lib/utils';
import { ArrowLeft, Calendar } from 'lucide-react';

export function ProjectDetail() {
  const { projects, selectedProjectId, setSelectedProjectId, viewMode } = useDashboard();
  const project = projects.find(p => p.id === selectedProjectId);

  if (!project) return null;

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => setSelectedProjectId(null)}
          className="mt-1 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition shrink-0"
          title="Back to all projects"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
            <Badge className={STATUS_COLORS[project.status]}>{project.status}</Badge>
            <StaleAlert lastActivityDate={project.lastActivityDate} />
          </div>
          <div className="flex items-center gap-4 flex-wrap text-sm text-slate-500">
            <span>Customer: <strong className="text-slate-700">{project.customerName}</strong></span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Last activity: {formatDate(project.lastActivityDate)}
            </span>
            <AvatarGroup owners={project.owners} max={4} />
          </div>
          {/* Progress */}
          <div className="flex items-center gap-3 mt-2">
            <ProgressBar value={project.progressPercentage} className="w-48" />
            <span className="text-xs font-medium text-slate-500">{project.progressPercentage}% complete</span>
          </div>
        </div>
      </div>

      {/* Panels grid */}
      <div className="space-y-5">
        <MilestonesPanel project={project} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <IssuesPanel project={project} />
          <DocumentVault project={project} />
        </div>
        <ActivityFeed project={project} />
      </div>
    </div>
  );
}
