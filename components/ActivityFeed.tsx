'use client';

import { useDashboard } from '@/lib/context';
import { Project, ActivityUpdate } from '@/types';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { STATUS_COLORS, SOURCE_LABELS, formatTimestamp, cn } from '@/lib/utils';
import { parseUnstructuredUpdate } from '@/lib/nlParser';
import { useState } from 'react';
import { Send, Zap, Lock, Eye, EyeOff } from 'lucide-react';

const SOURCE_COLORS: Record<string, string> = {
  slack:             'bg-purple-50 text-purple-700 border-purple-200',
  standup_note:      'bg-blue-50 text-blue-700 border-blue-200',
  github_pr_comment: 'bg-slate-100 text-slate-700 border-slate-200',
  meeting_summary:   'bg-amber-50 text-amber-700 border-amber-200',
  manual:            'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function UpdateCard({ update }: { update: ActivityUpdate }) {
  const { viewMode } = useDashboard();
  const [rawExpanded, setRawExpanded] = useState(false);

  if (!update.isCustomerVisible && viewMode === 'customer') return null;

  const initials = update.author.avatar;
  const authorId = 'id' in update.author
    ? (update.author as { id: string }).id
    : update.author.name;
  const authorName = update.author.name;
  const isUrl = initials.startsWith('http');

  return (
    <div className="flex gap-3 py-4 border-b border-slate-100 last:border-0">
      <Avatar initials={initials} src={isUrl ? initials : undefined} id={authorId} size="sm" title={authorName} />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-800">{authorName}</span>

          {update.source && (
            <Badge className={cn(SOURCE_COLORS[update.source] ?? 'bg-slate-100 text-slate-600', 'gap-1')}>
              {SOURCE_LABELS[update.source] ?? update.source}
              {update.channel && (
                <span className="opacity-60 truncate max-w-[120px] text-xs">{update.channel}</span>
              )}
            </Badge>
          )}

          {!update.isCustomerVisible && viewMode === 'internal' && (
            <Badge className="bg-violet-50 text-violet-700 border-violet-200">
              <Lock className="w-2.5 h-2.5" />
              Internal
            </Badge>
          )}
          {update.statusChange && (
            <Badge className={STATUS_COLORS[update.statusChange]}>
              to {update.statusChange}
            </Badge>
          )}
          <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{formatTimestamp(update.timestamp)}</span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">{update.summary}</p>

        {update.rawText && viewMode === 'internal' && (
          <div className="mt-1">
            <button
              onClick={() => setRawExpanded(e => !e)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition"
            >
              {rawExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {rawExpanded ? 'Hide raw note' : 'Show raw note'}
            </button>
            {rawExpanded && (
              <div className="mt-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600 font-mono leading-relaxed whitespace-pre-wrap">
                {update.rawText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ActivityFeed({ project }: { project: Project }) {
  const { viewMode, setProjects } = useDashboard();
  const [inputText, setInputText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [lastExtracted, setLastExtracted] = useState<string | null>(null);

  const visibleUpdates = project.updates.filter(
    u => !(u.isCustomerVisible === false && viewMode === 'customer')
  );

  async function processUpdate() {
    if (!inputText.trim()) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 600));

    const parsed = parseUnstructuredUpdate(inputText, project);

    const newUpdate: ActivityUpdate = {
      id: `u-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: { name: 'You', avatar: 'YO' },
      rawText: inputText,
      summary: parsed.summary,
      statusChange: parsed.statusChange,
      affectedTaskIds: parsed.affectedTaskIds,
      isCustomerVisible: isVisible,
      source: 'manual',
      channel: 'Dashboard',
    };

    setProjects(prev =>
      prev.map(p => {
        if (p.id !== project.id) return p;
        return {
          ...p,
          updates: [newUpdate, ...p.updates],
          lastActivityDate: new Date().toISOString(),
          ...(parsed.statusChange ? { status: parsed.statusChange } : {}),
        };
      })
    );

    setLastExtracted(
      (parsed.statusChange ? `Status set to "${parsed.statusChange}". ` : 'No status change detected. ') +
      (parsed.affectedTaskIds?.length ? `Linked to ${parsed.affectedTaskIds.length} task(s).` : '')
    );
    setInputText('');
    setProcessing(false);
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Activity Feed &amp; Update Ingestion
        </h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3">
          <textarea
            rows={3}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste a Slack message, standup note, PR comment, or meeting summary..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={e => setIsVisible(e.target.checked)}
                className="rounded border-slate-300 accent-blue-600"
              />
              Customer-visible
            </label>
            <button
              disabled={processing || !inputText.trim()}
              onClick={processUpdate}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
                processing || !inputText.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              <Send className="w-3.5 h-3.5" />
              {processing ? 'Processing...' : 'Process Update'}
            </button>
          </div>
          {lastExtracted && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              {lastExtracted}
            </div>
          )}
        </div>

        <div>
          {visibleUpdates.length === 0 ? (
            <p className="py-4 text-sm text-slate-400 text-center">No updates in this view.</p>
          ) : (
            visibleUpdates.map(u => <UpdateCard key={u.id} update={u} />)
          )}
        </div>
      </CardBody>
    </Card>
  );
}