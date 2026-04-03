import { TaskStatus } from '@/types/task';

const styles: Record<TaskStatus, string> = {
  [TaskStatus.NOT_STARTED]: 'bg-slate-100 text-slate-600 border-slate-200',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-600 border-blue-100',
  [TaskStatus.DONE]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}