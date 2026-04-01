import Link from 'next/link';
import { Task } from '@/types/task';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
        </div>

        {task.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          {task.effort_estimate != null && (
            <span>Effort: {task.effort_estimate}</span>
          )}
          {task.childrenCount != null && task.childrenCount > 0 && (
            <span>{task.childrenCount} subtask{task.childrenCount > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
