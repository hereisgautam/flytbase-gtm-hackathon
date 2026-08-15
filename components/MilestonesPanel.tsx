'use client';

import { useDashboard } from '@/lib/context';
import { Project, Milestone, Task, TaskStatus } from '@/types';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { Card, CardHeader, CardBody } from './ui/Card';
import { TASK_STATUS_COLORS, MILESTONE_STATUS_COLORS, formatDate, cn } from '@/lib/utils';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Lock, LayoutGrid, List } from 'lucide-react';

const KANBAN_COLS: TaskStatus[] = ['Open', 'In Progress', 'Blocked', 'Done'];

function TaskCard({ task }: { task: Task }) {
  const { viewMode } = useDashboard();
  if (task.isInternalOnly && viewMode === 'customer') return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-slate-800 leading-snug">{task.title}</span>
        {task.isInternalOnly && (
          <span title="Internal only"><Lock className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /></span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Avatar initials={task.assignee.avatar} id={task.assignee.id} size="sm" title={task.assignee.name} />
          <span className="text-xs text-slate-500">{task.assignee.name}</span>
        </div>
        <span className="text-xs text-slate-400">{formatDate(task.dueDate)}</span>
      </div>
    </div>
  );
}

function KanbanBoard({ milestones }: { milestones: Milestone[] }) {
  const { viewMode } = useDashboard();
  const allTasks = milestones.flatMap(m =>
    m.tasks.filter(t => !(t.isInternalOnly && viewMode === 'customer'))
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {KANBAN_COLS.map(col => {
        const tasks = allTasks.filter(t => t.status === col);
        return (
          <div key={col} className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={TASK_STATUS_COLORS[col]}>{col}</Badge>
              <span className="text-xs text-slate-400 font-medium">{tasks.length}</span>
            </div>
            {tasks.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                No tasks
              </div>
            ) : (
              tasks.map(t => <TaskCard key={t.id} task={t} />)
            )}
          </div>
        );
      })}
    </div>
  );
}

function MilestoneRow({ milestone }: { milestone: Milestone }) {
  const { viewMode } = useDashboard();
  const [expanded, setExpanded] = useState(true);

  if (milestone.isInternalOnly && viewMode === 'customer') return null;

  const visibleTasks = milestone.tasks.filter(t => !(t.isInternalOnly && viewMode === 'customer'));

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition text-left"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        <span className="font-semibold text-slate-800 flex-1">{milestone.title}</span>
        {milestone.isInternalOnly && <span title="Internal only"><Lock className="w-3.5 h-3.5 text-violet-400" /></span>}
        <Badge className={MILESTONE_STATUS_COLORS[milestone.status]}>{milestone.status}</Badge>
        <span className="text-xs text-slate-400 ml-2">{formatDate(milestone.targetDate)}</span>
      </button>

      {expanded && (
        <div className="divide-y divide-slate-100">
          {visibleTasks.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">No visible tasks.</p>
          ) : (
            visibleTasks.map(task => (
              <div key={task.id} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="text-sm text-slate-800 truncate">{task.title}</span>
                  {task.isInternalOnly && <Lock className="w-3 h-3 text-violet-400 shrink-0" />}
                </div>
                <Badge className={cn(TASK_STATUS_COLORS[task.status], 'shrink-0')}>{task.status}</Badge>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Avatar initials={task.assignee.avatar} id={task.assignee.id} size="sm" title={task.assignee.name} />
                  <span className="text-xs text-slate-500 hidden sm:block">{task.assignee.name}</span>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{formatDate(task.dueDate)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function MilestonesPanel({ project }: { project: Project }) {
  const [mode, setMode] = useState<'list' | 'kanban'>('list');
  const { viewMode } = useDashboard();
  const visibleMilestones = project.milestones.filter(m => !(m.isInternalOnly && viewMode === 'customer'));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Milestones & Tasks</h2>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setMode('list')}
              className={cn('flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition',
                mode === 'list' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setMode('kanban')}
              className={cn('flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition',
                mode === 'kanban' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {mode === 'list' ? (
          <div className="space-y-3">
            {visibleMilestones.map(m => <MilestoneRow key={m.id} milestone={m} />)}
          </div>
        ) : (
          <KanbanBoard milestones={visibleMilestones} />
        )}
      </CardBody>
    </Card>
  );
}
