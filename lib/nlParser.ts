/**
 * Client-side Natural Language Parser
 * Simulates AI extraction using heuristic regex rules.
 */
import { Project, ProjectStatus, ActivityUpdate, Milestone, Task } from '@/types';

// ── Keyword dictionaries ──────────────────────────────────────────────────────
const BLOCKED_KW   = /\b(block(ed|ing)?|stuck|halted|stalled|waiting on|can['']?t proceed|no saml|missing metadata)\b/i;
const AT_RISK_KW   = /\b(at risk|risk(y)?|behind schedule|delay(ed|ing)?|overrun|concern(ed)?|behind|may miss|slipping)\b/i;
const DONE_KW      = /\b(complete(d)?|done|finished|shipped|deployed|delivered|signed.?off|closed|resolved)\b/i;
const IN_PROG_KW   = /\b(in progress|working on|under way|started|ongoing|in flight|implementing)\b/i;

// ── NL query filters ──────────────────────────────────────────────────────────
export interface NLQueryResult {
  type: 'filter' | 'answer';
  filteredProjectIds?: string[];
  answerText?: string;
  matchedStatus?: ProjectStatus;
}

export function parseNLQuery(query: string, projects: Project[]): NLQueryResult {
  const q = query.toLowerCase();

  // "Who is working on <project name>"
  const whoMatch = q.match(/who.*(work|own|assign|lead|manag).*(?:on\s+)?(.+)/i);
  if (whoMatch) {
    const nameFrag = whoMatch[2].replace(/[?!.]/g, '').trim();
    const proj = projects.find(p =>
      p.name.toLowerCase().includes(nameFrag) ||
      p.customerName.toLowerCase().includes(nameFrag)
    );
    if (proj) {
      const names = proj.owners.map(o => `${o.name} (${o.role})`).join(', ');
      return { type: 'answer', answerText: `**${proj.name}** is owned by: ${names}` };
    }
  }

  // Status-based filters
  if (/blocked/.test(q)) {
    const ids = projects.filter(p => p.status === 'Blocked').map(p => p.id);
    return { type: 'filter', filteredProjectIds: ids, matchedStatus: 'Blocked' };
  }
  if (/at.?risk|behind|delay/.test(q)) {
    const ids = projects.filter(p => p.status === 'At Risk').map(p => p.id);
    return { type: 'filter', filteredProjectIds: ids, matchedStatus: 'At Risk' };
  }
  if (/complet/.test(q)) {
    const ids = projects.filter(p => p.status === 'Completed').map(p => p.id);
    return { type: 'filter', filteredProjectIds: ids, matchedStatus: 'Completed' };
  }
  if (/on.?track|healthy|green/.test(q)) {
    const ids = projects.filter(p => p.status === 'On Track').map(p => p.id);
    return { type: 'filter', filteredProjectIds: ids, matchedStatus: 'On Track' };
  }

  // Stale / no update
  if (/stale|no.?update|inactive/.test(q)) {
    const ids = projects
      .filter(p => {
        const days = Math.floor((Date.now() - new Date(p.lastActivityDate).getTime()) / 86400000);
        return days >= 7;
      })
      .map(p => p.id);
    return { type: 'filter', filteredProjectIds: ids, answerText: 'Showing projects with no update in ≥7 days.' };
  }

  // Customer-name search
  const byCustomer = projects.filter(p =>
    p.customerName.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
  );
  if (byCustomer.length > 0) {
    return { type: 'filter', filteredProjectIds: byCustomer.map(p => p.id) };
  }

  return { type: 'answer', answerText: 'No matching projects found. Try "blocked", "at risk", "completed", or a project/customer name.' };
}

// ── Update ingestion parser ───────────────────────────────────────────────────
export interface ParsedUpdate {
  summary: string;
  statusChange?: ProjectStatus;
  affectedMilestoneIds?: string[];
  affectedTaskIds?: string[];
}

export function parseUnstructuredUpdate(text: string, project: Project): ParsedUpdate {
  let statusChange: ProjectStatus | undefined;

  if (BLOCKED_KW.test(text))        statusChange = 'Blocked';
  else if (AT_RISK_KW.test(text))   statusChange = 'At Risk';
  else if (DONE_KW.test(text))      statusChange = 'Completed';
  else if (IN_PROG_KW.test(text))   statusChange = 'On Track';

  // Try to match milestone/task names mentioned in text
  const affectedMilestoneIds: string[] = [];
  const affectedTaskIds: string[] = [];

  for (const m of project.milestones) {
    const words = m.title.split(' ').filter(w => w.length > 4);
    if (words.some(w => text.toLowerCase().includes(w.toLowerCase()))) {
      affectedMilestoneIds.push(m.id);
    }
    for (const t of m.tasks) {
      const tWords = t.title.split(' ').filter(w => w.length > 4);
      if (tWords.some(w => text.toLowerCase().includes(w.toLowerCase()))) {
        affectedTaskIds.push(t.id);
      }
    }
  }

  // Build a concise summary
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) ?? [text];
  const summary = sentences.slice(0, 2).join(' ').trim().replace(/\s+/g, ' ');

  return { summary, statusChange, affectedMilestoneIds, affectedTaskIds };
}
