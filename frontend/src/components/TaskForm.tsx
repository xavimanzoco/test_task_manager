'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskStatus, TaskPriority, Task } from '@/types/task';
import { createTask, updateTask } from '@/lib/api';

interface TaskFormProps {
  task?: Task;         // si viene task es edición, si no es creación
  parentId?: number;  // para crear subtareas
  onCancel?: () => void;
}

export default function TaskForm({ task, parentId, onCancel }: TaskFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState(task?.status ?? TaskStatus.NOT_STARTED);
  const [priority, setPriority] = useState(task?.priority ?? TaskPriority.MEDIUM);
  const [effort, setEffort] = useState(task?.effort_estimate?.toString() ?? '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        router.refresh();
      } else {
        const created = await createTask(data);
        router.push(`/tasks/${created.id}`);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={TaskStatus.NOT_STARTED}>Not Started</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Effort estimate</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={effort}
          onChange={(e) => setEffort(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => onCancel ? onCancel() : router.back()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : task ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
