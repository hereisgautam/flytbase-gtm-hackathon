'use client';

import { useDashboard } from '@/lib/context';
import { parseNLQuery } from '@/lib/nlParser';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function NLQueryBar() {
  const { projects, setSelectedProjectId, searchQuery, setSearchQuery } = useDashboard();
  const [result, setResult] = useState<{ text: string; ids?: string[] } | null>(null);
  const [inputValue, setInputValue] = useState('');

  function handleSearch() {
    if (!inputValue.trim()) return;
    const parsed = parseNLQuery(inputValue, projects);
    setSearchQuery(inputValue);
    if (parsed.type === 'answer') {
      setResult({ text: parsed.answerText ?? '' });
    } else {
      const names = (parsed.filteredProjectIds ?? [])
        .map(id => projects.find(p => p.id === id)?.name ?? id)
        .join(', ');
      const prefix = parsed.answerText ? parsed.answerText + ' ' : '';
      setResult({
        text: `${prefix}Found ${parsed.filteredProjectIds?.length ?? 0} project(s): ${names || 'none'}`,
        ids: parsed.filteredProjectIds,
      });
    }
  }

  function handleClear() {
    setInputValue('');
    setSearchQuery('');
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder='Ask anything… "Which projects are blocked?" · "Who is working on Drone Delivery?"'
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shrink-0"
        >
          Search
        </button>
        {inputValue && (
          <button onClick={handleClear} className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>

      {result && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex items-start gap-2">
          <Search className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
          <span>
            {result.text.split('**').map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
            {result.ids && result.ids.length > 0 && (
              <span className="ml-2 gap-1 inline-flex flex-wrap">
                {result.ids.map(id => {
                  const p = projects.find(pr => pr.id === id);
                  return p ? (
                    <button
                      key={id}
                      onClick={() => setSelectedProjectId(id)}
                      className="underline underline-offset-2 hover:text-blue-900 font-medium"
                    >
                      {p.name}
                    </button>
                  ) : null;
                })}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
