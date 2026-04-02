import Link from 'next/link';
import { Task } from '@/types/task';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer group">
        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-black line-clamp-2">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">{task.description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          {task.effort_estimate != null ? (
            <span>⏱ {task.effort_estimate} pts</span>
          ) : (
            <span />
          )}
          {task.childrenCount != null && task.childrenCount > 0 && (
            <span>↳ {task.childrenCount} subtask{task.childrenCount > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
