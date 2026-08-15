'use client';

import { useDashboard } from '@/lib/context';
import { Project } from '@/types';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { Lock, FileText, Download } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

const CATEGORY_BADGE: Record<string, string> = {
  'SOW':              'bg-blue-50 text-blue-700 border-blue-200',
  'Architecture':     'bg-violet-50 text-violet-700 border-violet-200',
  'Onboarding Guide': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Report':           'bg-amber-50 text-amber-700 border-amber-200',
};

export function DocumentVault({ project }: { project: Project }) {
  const { viewMode } = useDashboard();

  const visibleDocs = project.documents.filter(d => !(d.isCustomerVisible === false && viewMode === 'customer'));

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Document Vault
          <span className="ml-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
            {visibleDocs.length}
          </span>
        </h2>
      </CardHeader>
      <CardBody className="p-0">
        {visibleDocs.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400 text-center">No documents available in this view.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleDocs.map(doc => (
              <div key={doc.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition">
                <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-slate-800 truncate">{doc.name}</span>
                    {!doc.isCustomerVisible && (
                      <span title="Internal only"><Lock className="w-3 h-3 text-violet-400 shrink-0" /></span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{doc.size} · {formatDate(doc.uploadedAt)}</span>
                </div>
                <Badge className={cn(CATEGORY_BADGE[doc.category] ?? 'bg-slate-100 text-slate-600', 'shrink-0')}>
                  {doc.category}
                </Badge>
                <button
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition shrink-0"
                  title="Download (demo)"
                  onClick={() => alert(`Demo: downloading ${doc.name}`)}
                >
                  <Download className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
