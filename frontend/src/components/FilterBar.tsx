'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { TaskStatus, TaskPriority } from '@/types/task';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? '');
  const [priority, setPriority] = useState(searchParams.get('priority') ?? '');

  const debouncedSearch = useDebounce(search, 500);
  const isFirstRender = useRef(true);

  function buildParams(s: string, st: string, p: string) {
    const params = new URLSearchParams();
    if (s) params.set('search', s);
    if (st) params.set('status', st);
    if (p) params.set('priority', p);
    return params;
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = buildParams(debouncedSearch, status, priority);
    router.push(`/?${params.toString()}`);
  }, [debouncedSearch, status, priority]);

  function clear() {
    setSearch('');
    setStatus('');
    setPriority('');
    router.push('/');
  }

  const inputClass = "border border-slate-200 rounded-xl px-4 h-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 text-slate-700 placeholder-slate-400";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} w-87 pr-9`}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-xs"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={inputClass}
      >
        <option value="">All statuses</option>
        <option value={TaskStatus.NOT_STARTED}>Not Started</option>
        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
        <option value={TaskStatus.DONE}>Done</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={inputClass}
      >
        <option value="">All priorities</option>
        <option value={TaskPriority.LOW}>Low</option>
        <option value={TaskPriority.MEDIUM}>Medium</option>
        <option value={TaskPriority.HIGH}>High</option>
      </select>
    </div>
  );
}
