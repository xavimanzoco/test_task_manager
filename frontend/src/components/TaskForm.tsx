'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskStatus, TaskPriority, Task } from '@/types/task';
import { createTask, updateTask } from '@/lib/api';

interface TaskFormProps {
  task?: Task;
  parentId?: number;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function TaskForm({ task, parentId, onCancel, onSuccess }: TaskFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState(false);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState(task?.status ?? TaskStatus.NOT_STARTED);
  const [priority, setPriority] = useState(task?.priority ?? TaskPriority.MEDIUM);
  const [effort, setEffort] = useState(task?.effort_estimate?.toString() ?? '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = {
        title,
        description: description || undefined,
        status,
        priority,
        effort_estimate: effort ? parseFloat(effort) : undefined,
        parent_id: parentId,
      };

      if (task) {
        await updateTask(task.id, data);
        onSuccess?.();
        router.refresh();
      } else if (parentId) {
        await createTask(data);
        onSuccess?.();
        router.refresh();
      } else {
        const created = await createTask(data);
        onSuccess?.();
        router.push(`/tasks/${created.id}`);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = "w-full border border-slate-200 rounded-xl px-4 h-10 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 text-slate-800 placeholder-slate-400 transition-colors";
  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
          {error}
        </p>
      )}

      <div>
        <label className={labelClass}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
          placeholder="Task title..."
          className={`${fieldClass} ${titleError ? 'border-red-300 bg-red-50 focus:ring-red-400 focus:border-red-300' : ''}`}
        />
        {titleError && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-bold shrink-0">!</span>
            Title is required
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Add a description..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 text-slate-800 placeholder-slate-400 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className={fieldClass}
          >
            <option value={TaskStatus.NOT_STARTED}>Not Started</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className={fieldClass}
          >
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Effort estimate</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={effort}
          placeholder="0"
          onChange={(e) => setEffort(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="flex gap-3 justify-end pt-1">
        <button
          type="button"
          onClick={() => onCancel ? onCancel() : router.back()}
          className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm shadow-indigo-200"
        >
          {loading ? 'Saving...' : task ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
