import { fetchTask } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import SubtaskList from '@/components/SubtaskList';
import TaskActions from '@/components/TaskActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  const task = await fetchTask(Number(id)).catch(() => null);

  if (!task) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Back to tasks
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">{task.title}</h1>
          <TaskActions task={task} />
        </div>

        {task.description && (
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">{task.description}</p>
        )}

        <div className="flex gap-2 mb-4">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {task.effort_estimate != null && (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
              ⏱ {task.effort_estimate} pts
            </span>
          )}
        </div>

        {task.aggregatedEffort && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Aggregated Effort</p>
            <div className="flex gap-8">
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-gray-700">{task.aggregatedEffort.not_started}</p>
                <p className="text-xs text-gray-400">Not started</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-blue-500">{task.aggregatedEffort.in_progress}</p>
                <p className="text-xs text-gray-400">In progress</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-green-500">{task.aggregatedEffort.done}</p>
                <p className="text-xs text-gray-400">Done</p>
              </div>
              <div className="flex flex-col gap-1 ml-auto">
                <p className="text-lg font-semibold text-gray-900">{task.aggregatedEffort.total}</p>
                <p className="text-xs text-gray-400">Total</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Subtasks</h2>
        <SubtaskList tasks={task.children ?? []} parentId={task.id} />
      </div>
    </main>
  );
}
