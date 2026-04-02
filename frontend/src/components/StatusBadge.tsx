import { TaskStatus } from '@/types/task';

const styles: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'bg-gray-100 text-gray-500',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-600',
  [TaskStatus.DONE]: 'bg-green-50 text-green-600',
};

const labels: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'Not started',
  [TaskStatus.IN_PROGRESS]: 'In progress',
  [TaskStatus.DONE]: 'Done',
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
