import { type ClassValue, clsx } from 'clsx';
import { differenceInDays, parseISO, format } from 'date-fns';
import { ProjectStatus, TaskStatus, IssuePriority, IssueStatus, MilestoneStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function daysSinceActivity(isoDate: string): number {
  return differenceInDays(new Date(), parseISO(isoDate));
}

export function formatDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'MMM d, yyyy');
  } catch {
    return isoDate;
  }
}

export function formatTimestamp(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'MMM d, yyyy h:mm a');
  } catch {
    return isoDate;
  }
}

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  'On Track':    'bg-emerald-100 text-emerald-800 border-emerald-200',
  'At Risk':     'bg-amber-100 text-amber-800 border-amber-200',
  'Blocked':     'bg-red-100 text-red-800 border-red-200',
  'Completed':   'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-violet-100 text-violet-800 border-violet-200',
  'Planning':    'bg-slate-100 text-slate-700 border-slate-200',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  'Open':        'bg-slate-100 text-slate-700 border-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'Blocked':     'bg-red-100 text-red-700 border-red-200',
  'Done':        'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Todo':        'bg-slate-100 text-slate-600 border-slate-200',
};

export const MILESTONE_STATUS_COLORS: Record<MilestoneStatus, string> = {
  'Upcoming':    'bg-slate-100 text-slate-600 border-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'Completed':   'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Delayed':     'bg-amber-100 text-amber-800 border-amber-200',
};

export const PRIORITY_COLORS: Record<IssuePriority, string> = {
  'Low':      'bg-slate-100 text-slate-600 border-slate-200',
  'Medium':   'bg-amber-100 text-amber-700 border-amber-200',
  'High':     'bg-orange-100 text-orange-700 border-orange-200',
  'Critical': 'bg-red-100 text-red-800 border-red-200',
};

export const ISSUE_STATUS_COLORS: Record<IssueStatus, string> = {
  'Open':         'bg-red-50 text-red-700 border-red-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Resolved':     'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const SOURCE_LABELS: Record<string, string> = {
  slack:               'Slack',
  standup_note:        'Standup',
  github_pr_comment:   'PR',
  meeting_summary:     'Meeting',
  manual:              'Update',
};

export const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500',
];

export function avatarColor(id: string): string {
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}