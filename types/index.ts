export type ProjectStatus = 'On Track' | 'At Risk' | 'Blocked' | 'Completed' | 'In Progress' | 'Planning';
export type TaskStatus = 'Open' | 'In Progress' | 'Blocked' | 'Done' | 'Todo';
export type IssueCategory = 'Bug' | 'Feature Request' | 'Question' | 'Support' | 'Implementation';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type MilestoneStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Delayed';
export type IssueStatus = 'Open' | 'Under Review' | 'Resolved';
export type DocumentCategory = 'SOW' | 'Architecture' | 'Onboarding Guide' | 'Report';
export type UpdateSource = 'slack' | 'standup_note' | 'github_pr_comment' | 'meeting_summary' | 'manual';

export interface Owner {
  id: string;
  name: string;
  /** Initials (e.g. "SC") or a full https:// image URL */
  avatar: string;
  role: string;
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: Owner;
  dueDate: string;
  priority?: IssuePriority;
  isInternalOnly?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  status: MilestoneStatus;
  tasks: Task[];
  isInternalOnly?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  linkedMilestoneId?: string;
  isInternalOnly?: boolean;
}

export interface ActivityUpdate {
  id: string;
  timestamp: string;
  author: Owner | { name: string; avatar: string };
  /** Raw unstructured text from Slack, standup note, PR comment, etc. */
  rawText?: string;
  /** AI-extracted or manually written summary */
  summary: string;
  statusChange?: ProjectStatus;
  affectedTaskIds?: string[];
  isCustomerVisible: boolean;
  /** Origin channel: slack, standup_note, github_pr_comment, meeting_summary */
  source?: UpdateSource;
  /** Channel or location name, e.g. "#proj-aurora-engineering" */
  channel?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  category: DocumentCategory;
  isCustomerVisible: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  customerName: string;
  status: ProjectStatus;
  owners: Owner[];
  leadId?: string;
  lastActivityDate: string;
  progressPercentage: number;
  startDate?: string;
  targetDate?: string;
  milestones: Milestone[];
  issues: Issue[];
  updates: ActivityUpdate[];
  documents: DocumentItem[];
}