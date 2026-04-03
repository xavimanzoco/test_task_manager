'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Task, TaskStatus } from '@/types/task';
import { updateTask } from '@/lib/api';
import PriorityBadge from './PriorityBadge';

const nextStatus: Record<TaskStatus, TaskStatus> = {
  [TaskStatus.NOT_STARTED]: TaskStatus.IN_PROGRESS,
  [TaskStatus.IN_PROGRESS]: TaskStatus.DONE,
  [TaskStatus.DONE]: TaskStatus.NOT_STARTED,
};

const statusAccent: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'bg-slate-300',
  [TaskStatus.IN_PROGRESS]: 'bg-indigo-400',
  [TaskStatus.DONE]: 'bg-emerald-400',
};

const statusCardBg: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'bg-white border-slate-200/80 hover:border-slate-300',
  [TaskStatus.IN_PROGRESS]: 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-200',
  [TaskStatus.DONE]: 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200',
};

const statusBadge: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100',
  [TaskStatus.DONE]: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100',
};

export default function TaskCard({ task }: { task: Task }) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [loading, setLoading] = useState(false);

  async function handleStatusClick(e: React.MouseEvent) {
    e.preventDefault();
    if (loading) return;
    const next = nextStatus[status];
    setStatus(next);
    setLoading(true);
    try {
      await updateTask(task.id, { status: next });
    } catch {
      setStatus(status);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/tasks/${task.id}`} className="group block">
      <div className={`relative border rounded-2xl p-5
                      transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                      hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.07)]
                      hover:-translate-y-1 h-full flex flex-col
                      ${statusCardBg[status]}`}>

        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${statusAccent[status]}`} />

        <div className="mb-3">
          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}

        {task.children && task.children.length > 0 && (
          <div className="mt-3 flex flex-col gap-1">
            {task.children.slice(0, 3).map((child) => (
              <div key={child.id} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                <span className="text-[11px] text-slate-400 truncate">{child.title}</span>
              </div>
            ))}
            {task.children.length > 3 && (
              <span className="text-[10px] text-slate-400 pl-2.5">+{task.children.length - 3} more</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex gap-1.5 scale-90 origin-left">
            <button
              onClick={handleStatusClick}
              title="Click to change status"
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${statusBadge[status]} ${loading ? 'opacity-60' : ''}`}
            >
              {status.replace('_', ' ')}
            </button>
            <PriorityBadge priority={task.priority} />
          </div>

          <div className="flex items-center gap-3">
            {task.effort_estimate != null && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {task.effort_estimate} PTS
              </span>
            )}
            {task.childrenCount != null && task.childrenCount > 0 && (
              <span className="text-[10px] font-medium text-indigo-400">
                ↳ {task.childrenCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
