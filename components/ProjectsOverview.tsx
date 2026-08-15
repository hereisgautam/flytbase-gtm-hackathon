'use client';

import { useDashboard } from '@/lib/context';
import { Project, ProjectStatus } from '@/types';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { AvatarGroup } from './ui/Avatar';
import { Card } from './ui/Card';
import { StaleAlert } from './StaleAlert';
import { STATUS_COLORS, formatDate } from '@/lib/utils';
import { ChevronRight, Calendar } from 'lucide-react';

const ALL_STATUSES: ProjectStatus[] = ['On Track', 'In Progress', 'Planning', 'At Risk', 'Blocked', 'Completed'];

function ProjectRow({ project }: { project: Project }) {
  const { setSelectedProjectId } = useDashboard();

  return (
    <Card
      onClick={() => setSelectedProjectId(project.id)}
      className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50"
    >
      {/* Name + customer */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-900 truncate">{project.name}</span>
          <StaleAlert lastActivityDate={project.lastActivityDate} />
        </div>
        <span className="text-xs text-slate-500">{project.customerName}</span>
        {project.description && (
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{project.description}</p>
        )}
      </div>

      {/* Owners */}
      <div className="shrink-0">
        <AvatarGroup owners={project.owners} />
      </div>

      {/* Status badge */}
      <div className="shrink-0 w-28">
        <Badge className={STATUS_COLORS[project.status]}>{project.status}</Badge>
      </div>

      {/* Progress */}
      <div className="shrink-0 w-36 space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span className="font-medium">{project.progressPercentage}%</span>
        </div>
        <ProgressBar value={project.progressPercentage} />
      </div>

      {/* Last activity */}
      <div className="shrink-0 flex items-center gap-1 text-xs text-slate-400">
        <Calendar className="w-3.5 h-3.5" />
        {formatDate(project.lastActivityDate)}
      </div>

      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
    </Card>
  );
}

export function ProjectsOverview() {
  const { projects } = useDashboard();

  const counts: Partial<Record<ProjectStatus, number>> = {};
  for (const p of projects) {
    counts[p.status] = (counts[p.status] ?? 0) + 1;
  }

  return (
    <div className="space-y-4">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.filter(s => counts[s]).map(s => (
          <span
            key={s}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${STATUS_COLORS[s]}`}
          >
            <span className="font-bold">{counts[s]}</span>
            {s}
          </span>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {projects.map(project => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}