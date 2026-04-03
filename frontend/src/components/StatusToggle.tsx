'use client';

import { useState } from 'react';
import { TaskStatus } from '@/types/task';
import { updateTask } from '@/lib/api';

const styles: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100',
  [TaskStatus.DONE]: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100',
};

const nextStatus: Record<TaskStatus, TaskStatus> = {
  [TaskStatus.NOT_STARTED]: TaskStatus.IN_PROGRESS,
  [TaskStatus.IN_PROGRESS]: TaskStatus.DONE,
  [TaskStatus.DONE]: TaskStatus.NOT_STARTED,
};

export default function StatusToggle({ taskId, initialStatus }: { taskId: number; initialStatus: TaskStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate to task detail
    if (loading) return;

    const next = nextStatus[status];
    setStatus(next); // optimistic update
    setLoading(true);

    try {
      await updateTask(taskId, { status: next });
    } catch {
      setStatus(status); // revert on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      title="Click to change status"
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${styles[status]} ${loading ? 'opacity-60' : ''}`}
    >
      {status.replace('_', ' ')}
    </button>
  );
}
