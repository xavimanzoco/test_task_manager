import { TaskPriority } from '@/types/task';

const styles: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-500',
  [TaskPriority.MEDIUM]: 'bg-yellow-50 text-yellow-600',
  [TaskPriority.HIGH]: 'bg-red-50 text-red-600',
};

const labels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
};

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}
