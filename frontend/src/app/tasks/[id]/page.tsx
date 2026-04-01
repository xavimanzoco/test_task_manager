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
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to tasks
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <TaskActions task={task} />
        </div>

        {task.description && (
          <p className="text-gray-600 mb-4">{task.description}</p>
        )}

        <div className="flex gap-2 mb-4">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {task.effort_estimate != null && (
          <p className="text-sm text-gray-500">Effort: {task.effort_estimate}</p>
        )}

        {task.aggregatedEffort && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Aggregated Effort</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <p className="font-semibold text-gray-900">{task.aggregatedEffort.not_started}</p>
                <p className="text-gray-400 text-xs">Not started</p>
              </div>
              <div>
                <p className="font-semibold text-blue-600">{task.aggregatedEffort.in_progress}</p>
                <p className="text-gray-400 text-xs">In progress</p>
              </div>
              <div>
                <p className="font-semibold text-green-600">{task.aggregatedEffort.done}</p>
                <p className="text-gray-400 text-xs">Done</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{task.aggregatedEffort.total}</p>
                <p className="text-gray-400 text-xs">Total</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subtasks</h2>
        <SubtaskList tasks={task.children ?? []} parentId={task.id} />
      </div>
    </main>
  );
}
