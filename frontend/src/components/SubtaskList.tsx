'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    <div className="flex flex-col gap-2">
      {tasks.length === 0 && !addingSubtask && (
        <p className="text-sm text-slate-400 mb-2">No subtasks yet.</p>
      )}

      {tasks.map((task) => (
        <SubtaskItem key={task.id} task={task} />
      ))}

      {addingSubtask ? (
        <div className="mt-2 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <TaskForm
            parentId={parentId}
            onCancel={() => setAddingSubtask(false)}
            onSuccess={() => setAddingSubtask(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setAddingSubtask(true)}
          className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 text-left transition-colors"
        >
          + Add subtask
        </button>
      )}
    </div>
  );
}

function SubtaskItem({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-100 rounded-xl bg-white hover:border-indigo-200 hover:shadow-sm transition-all">
      <Link href={`/tasks/${task.id}`} className="block p-4">
        <div className="flex items-start gap-2">
          {task.children && task.children.length > 0 && (
            <button
              onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
              className="text-slate-400 hover:text-slate-600 transition-colors text-xs w-4 shrink-0 mt-0.5"
            >
              {expanded ? '▼' : '▶'}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 group-hover:text-indigo-600 truncate mb-2">
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-slate-400 mb-2 leading-relaxed">{task.description}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="scale-90 origin-left flex gap-1.5">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
              {task.effort_estimate != null && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  {task.effort_estimate} PTS
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {expanded && task.children && task.children.length > 0 && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 ml-4 border-l-2 border-l-slate-100">
          <SubtaskList tasks={task.children} parentId={task.id} />
        </div>
      )}
    </div>
  );
}
