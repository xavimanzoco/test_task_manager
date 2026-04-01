'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types/task';
import { deleteTask } from '@/lib/api';
import TaskForm from './TaskForm';

export default function TaskActions({ task }: { task: Task }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    await deleteTask(task.id);
    router.push('/');
  }

  if (editing) {
    return (
      <div className="w-full mt-4">
        <TaskForm task={task} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setEditing(true)}
        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Edit
      </button>

      {confirmDelete ? (
        <div className="flex gap-2">
          <span className="text-sm text-gray-600 self-center">Are you sure?</span>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
        >
          Delete
        </button>
      )}
    </div>
  );
}
