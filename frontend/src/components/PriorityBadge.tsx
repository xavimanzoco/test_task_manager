import { TaskPriority } from '@/types/task';

const styles: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'bg-green-100 text-green-700',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-700',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-700',
};

const labels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
};

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}
