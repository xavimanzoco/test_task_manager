'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import TaskForm from './TaskForm';

interface SubtaskListProps {
  tasks: Task[];
  parentId: number;
}

export default function SubtaskList({ tasks, parentId }: SubtaskListProps) {
  const [addingSubtask, setAddingSubtask] = useState(false);

  return (
    <div>
      {tasks.length === 0 && !addingSubtask && (
        <p className="text-sm text-gray-400 mb-4">No subtasks yet.</p>
      )}

      {tasks.map((task) => (
        <SubtaskItem key={task.id} task={task} />
      ))}

      {addingSubtask ? (
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
          <TaskForm
            parentId={parentId}
            onCancel={() => setAddingSubtask(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setAddingSubtask(true)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          + Add subtask
        </button>
      )}
    </div>
  );
}

function SubtaskItem({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {task.children && task.children.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                {expanded ? '▼' : '▶'}
              </button>
            )}
            <span className="font-medium text-gray-900">{task.title}</span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-500 mb-2">{task.description}</p>
          )}

          <div className="flex gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.effort_estimate != null && (
              <span className="text-xs text-gray-400 self-center">
                Effort: {task.effort_estimate}
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && task.children && task.children.length > 0 && (
        <div className="mt-4 ml-4 border-l-2 border-gray-100 pl-4">
          <SubtaskList tasks={task.children} parentId={task.id} />
        </div>
      )}

      {addingSubtask && (
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
          <TaskForm
            parentId={task.id}
            onCancel={() => setAddingSubtask(false)}
          />
        </div>
      )}

      <button
        onClick={() => setAddingSubtask(!addingSubtask)}
        className="mt-2 text-xs text-blue-600 hover:underline"
      >
        {addingSubtask ? 'Cancel' : '+ Add subtask'}
      </button>
    </div>
  );
}
